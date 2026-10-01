// Test static output and HTTP status without following redirects or running JS.
// Usage: node qa-route-aliases.js http://127.0.0.1:5507
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const base = process.argv[2] || 'http://127.0.0.1:5507';
const alias = '/calculators/gst-calculator-india';
const source = fs.readFileSync('script.js', 'utf8');
const resolver = source.match(/function getCleanSlugFromPath\(\) \{[\s\S]*?\n\}/)[0];
for (const pathname of [alias, alias + '.html', '/gst-calculator/']) {
    assert.equal(vm.runInNewContext(resolver + ';getCleanSlugFromPath()', { window: { location: { pathname } } }), 'gst-calculator');
}
assert.equal(fs.readFileSync('calculators/gst-calculator-india.html', 'utf8'), fs.readFileSync('gst-calculator/index.html', 'utf8'));
(async () => {
    for (const pathname of [alias, alias + '.html', '/gst-calculator/']) {
        const response = await fetch(new URL(pathname, base), { redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(30000) });
        assert.equal(response.status, 200, pathname);
        assert.match(response.headers.get('content-type'), /text\/html/);
        const html = await response.text();
        assert.match(html, /<title>GST Calculator India/);
        assert.match(html, /<h1>GST Calculator India<\/h1>/);
        assert.match(html, /<link rel="canonical" href="https:\/\/onlinecalmaster.com\/gst-calculator\/"\s*\/?>/);
        assert.match(html, /id="dynamicToolForm"/);
        assert(!/<meta[^>]+content="[^"]*noindex/i.test(html));
        console.log(`${pathname}: HTTP 200, pre-rendered GST content and canonical verified`);
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
