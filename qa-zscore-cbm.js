// Pure arithmetic and integration tests; no network calls or email delivery.
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const context = { console, document: { getElementById: () => null, addEventListener() {}, querySelectorAll: () => [] }, window: { addEventListener() {} } };
vm.createContext(context);
vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);
let checks = 0;
function near(actual, expected) { assert(Math.abs(actual - expected) <= Math.max(Math.abs(expected) * 1e-12, 1e-15), `${actual} != ${expected}`); checks++; }
function reject(fn) { assert.throws(fn); checks++; }
const z = (x, mean, sd) => context.calculateZScoreValues({ zRaw: x, zMean: mean, zSD: sd });
function cbm(...args) { const defaults = [50, 40, 30, 10, 'cm']; const [l, w, h, q, unit] = defaults.map((d, i) => i < args.length ? args[i] : d); return context.calculateCbmValues({ cbmLength: l, cbmWidth: w, cbmHeight: h, cbmQuantity: q, cbmUnit: unit }); }
near(z(85, 75, 10).z, 1); near(z(60, 75, 10).z, -1.5); near(z(-2.5, -1, 0.5).z, -3); near(z(0, 0, 2).z, 0); near(z(1.25, .5, .25).z, 3);
for (const bad of ['', ' ', undefined, 'abc', '12oops', '0x10', NaN, Infinity, '-Infinity', '1e309', '<img>']) {
    reject(() => z(bad, 0, 1)); reject(() => z(1, bad, 1)); reject(() => z(1, 0, bad));
    reject(() => cbm(bad)); reject(() => cbm(1, bad)); reject(() => cbm(1, 1, bad)); reject(() => cbm(1, 1, 1, bad));
}
for (const sd of [0, -1]) reject(() => z(1, 0, sd));
reject(() => z(1e308, -1e308, 1)); reject(() => z(1e-300, 0, 1e300));
near(cbm().perCarton, .06); near(cbm().total, .6); near(cbm().cubicFeet, 21.18880003289316);
near(cbm(.5, .4, .3, 10, 'm').total, .6);
near(cbm(12, 12, 12, 1, 'in').perCarton, .028316846592); near(cbm(12, 12, 12, 1, 'in').cubicFeet, 1);
near(cbm(1, 1, 1, 2, 'ft').total, .056633693184); near(cbm(1, 1, 1, 2, 'ft').cubicFeet, 2);
near(cbm(10.5, 20.5, 30.5, 2).total, .01313025);
for (const bad of [0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1]) reject(() => cbm(1, 1, 1, bad));
for (const bad of [0, -1]) { reject(() => cbm(bad)); reject(() => cbm(1, bad)); reject(() => cbm(1, 1, bad)); }
for (const unit of ['mm', '', '__proto__', 'toString']) reject(() => cbm(1, 1, 1, 1, unit));
reject(() => cbm(1e308, 1e308, 1e308)); reject(() => cbm(1e-300, 1e-300, 1e-300));
assert.notEqual(context.formatNewCalculatorNumber(1e-15), '0'); checks++;
const registry = vm.runInContext('calculatorData', context);
assert.equal(registry.length, 40);
for (const [target, slug] of [['zScore', 'z-score-calculator'], ['cbm', 'cbm-calculator']]) {
    const calculator = registry.find(c => c.target === target);
    assert.equal(calculator.slug, slug);
    const html = fs.readFileSync(`${slug}/index.html`, 'utf8');
    assert(html.includes(`https://onlinecalmaster.com/${slug}/`));
    assert(html.includes('id="dynamicToolForm"')); assert(html.includes('WebApplication'));
    assert(fs.readFileSync('sitemap.xml', 'utf8').includes(`/${slug}/`));
    assert(fs.readFileSync('index.html', 'utf8').includes(`href="/${slug}/"`));
    checks += 6;
}
console.log(`PASS ${checks} Z-Score/CBM arithmetic, invalid-input, numerical-range and static integration checks.`);
