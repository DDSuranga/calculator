// All EmailJS calls below are mocked. This test never sends an email or uses the network.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const html = fs.readFileSync('contact.html', 'utf8');
const source = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(s => s.includes('emailjs.init'));
function setup(options = {}) {
  const button = { disabled: false, textContent: 'Send Message' };
  let calls = 0, resets = 0;
  const alerts = [], logs = [];
  const elements = {
    name: { value: ' Test ' }, email: { value: 'user@example.technology', checkValidity: () => true },
    message: { value: ' private-test-message ' }, 'success-alert': { style: { display: 'block' } },
    'contact-form': { querySelector: () => button, addEventListener(type, fn) { this.submit = fn; }, reset() { resets++; } }
  };
  const context = {
    document: { getElementById: id => elements[id] }, alert: text => alerts.push(text),
    console: { error: (...args) => logs.push(args) }
  };
  if (!options.missingSdk) context.emailjs = {
    init(key) { assert.equal(key, 'eUrV1CCbtewUbs8cg'); if (options.initError) throw new Error('private-init-error'); },
    send(service, template, params) {
      calls++;
      assert.equal(service, 'service_7r5glod'); assert.equal(template, 'template_ifknzgp');
      assert.deepEqual(JSON.parse(JSON.stringify(params)), { from_name: 'Test', from_email: 'user@example.technology', message: 'private-test-message' });
      if (options.send) return options.send();
      return Promise.resolve({ status: 200, text: 'OK' });
    }
  };
  vm.runInNewContext(source, context);
  return { button, elements, alerts, logs, submit: () => elements['contact-form'].submit({ preventDefault() {} }), calls: () => calls, resets: () => resets };
}
(async () => {
  let test = setup(); await test.submit(); assert.equal(test.calls(), 1); assert.equal(test.resets(), 1); assert.equal(test.elements['success-alert'].style.display, 'block');
  test = setup(); test.elements.email.checkValidity = () => false; await test.submit(); assert.equal(test.calls(), 0); assert.match(test.alerts[0], /valid email/); assert.equal(test.elements['success-alert'].style.display, 'none');
  test = setup(); test.elements.name.value = ' '; await test.submit(); assert.equal(test.calls(), 0); assert.match(test.alerts[0], /required fields/);
  for (const status of [0, 400, 401, 403, 404, 412, 422, 429, 500]) {
    test = setup({ send: () => Promise.reject({ status, text: 'private-provider-detail user@example.technology' }) });
    await test.submit(); assert.equal(test.resets(), 0); assert.equal(test.elements.message.value, ' private-test-message ');
    assert.equal(test.elements['success-alert'].style.display, 'none'); assert.equal(test.button.disabled, false); assert.equal(test.button.textContent, 'Send Message');
    assert.match(test.alerts[0], new RegExp('CONTACT-SEND-' + status)); assert.equal(test.logs[0][1].status, status);
    assert.ok(!/private-provider-detail|private-test-message|user@example|eUrV1CCbtewUbs8cg/.test(JSON.stringify([test.alerts, test.logs])));
  }
  for (const options of [{ missingSdk: true }, { initError: true }]) {
    test = setup(options); await test.submit(); assert.equal(test.calls(), 0); assert.equal(test.resets(), 0); assert.equal(test.button.disabled, false);
    assert.match(test.alerts[0], /CONTACT-(SDK|INIT)-UNKNOWN/);
  }
  test = setup({ send() { throw new Error('private-sync-error'); } }); await test.submit(); assert.match(test.alerts[0], /CONTACT-SEND-UNKNOWN/); assert.equal(test.button.disabled, false);
  let resolve; test = setup({ send: () => new Promise(r => { resolve = r; }) });
  const first = test.submit(); await test.submit(); assert.equal(test.calls(), 1); assert.equal(test.button.disabled, true);
  resolve({ status: 200 }); await first; assert.equal(test.button.disabled, false);
  for (const href of ['/', 'about.html', 'privacy-policy.html']) assert.ok(html.includes('href="' + href + '"'));
  assert.ok(html.includes('GTM-M6K9R66W')); assert.ok(html.includes('mailto:onlinecalmaster@gmail.com'));
  assert.ok(!/support@example.com|facebook.com\/yourpage|instagram.com\/yourpage/.test(html));
  assert.ok(html.includes('https://wa.me/94771234567')); assert.ok(html.includes('Inbox delivery is not yet confirmed.'));
  console.log('Contact tests passed: validation, accepted requests, 9 failure statuses, missing SDK, initialization/synchronous failures, duplicate suppression, stale-success clearing, safe diagnostics and preserved links. No emails sent.');
})().catch(error => { console.error(error); process.exitCode = 1; });
