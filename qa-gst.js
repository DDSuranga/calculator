// GST arithmetic, validation, result labels and pre-rendered content regression.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const elements = {};
const context = { document: { addEventListener() {}, querySelectorAll: () => [], getElementById: id => elements[id] ||= {} }, window: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);
const definition = vm.runInContext('dynamicToolDefinitions.gst', context);
const input = (amount = '1000', rate = '18', mode = 'add', type = 'intra', custom = '') => ({ gstAmount: amount, gstRate: rate, gstMode: mode, gstTaxType: type, gstCustomRate: custom });
const close = (actual, expected) => assert(Math.abs(actual - expected) < 0.000001, `${actual} != ${expected}`);
let checks = 0;
for (const [values, base, gst, total] of [
    [input(), 1000, 180, 1180],
    [input('1180', '18', 'remove'), 1000, 180, 1180],
    [input('1000', '5'), 1000, 50, 1050],
    [input('1050', '5', 'remove'), 1000, 50, 1050],
    [input('1000', '18', 'add', 'inter'), 1000, 180, 1180],
    [input('1000', 'custom', 'add', 'intra', '7.5'), 1000, 75, 1075],
    [input('1234.56', '18'), 1234.56, 222.2208, 1456.7808],
    [input('0'), 0, 0, 0],
    [input('1000', '0'), 1000, 0, 1000],
    [input('1000000000000'), 1000000000000, 180000000000, 1180000000000]
]) {
    const result = context.calculateGst(values);
    close(result.base, base); close(result.gst, gst); close(result.total, total);
    assert(!/NaN|Infinity|undefined/.test(JSON.stringify(definition.calculate(values)))); checks++;
}
for (const rate of ['0', '0.25', '3', '5', '12', '18', '28']) {
    for (const type of ['intra', 'inter']) {
        const added = context.calculateGst(input('23456.78', rate, 'add', type));
        const reversed = context.calculateGst(input(String(added.total), rate, 'remove', type));
        close(reversed.base, 23456.78);
        for (const mode of ['add', 'remove']) {
            const labels = definition.calculate(input('1000', rate, mode, type)).rows.map(r => r[0]).join(' ');
            assert.equal(labels.includes('IGST'), type === 'inter');
            assert.equal(labels.includes('CGST'), type === 'intra');
            assert.equal(labels.includes('SGST'), type === 'intra');
        }
        checks++;
    }
}
for (const bad of ['', ' ', '-1', 'abc', '10oops', 'NaN', 'Infinity', '1e309', '1000000000001']) {
    assert.throws(() => context.calculateGst(input(bad))); checks++;
}
for (const bad of ['', '-1', 'abc', '101', 'Infinity']) {
    assert.throws(() => context.calculateGst(input('1000', 'custom', 'add', 'intra', bad))); checks++;
}
assert.throws(() => context.calculateGst(input('1000', '19')));
assert.throws(() => context.calculateGst(input('1000', '18', 'invalid')));
assert.throws(() => context.calculateGst(input('1000', '18', 'add', 'invalid')));
checks += 3;
const result = definition.calculate(input());
assert.equal(result.rows.find(([k]) => k.startsWith('CGST'))[1], '₹90.00');
assert.equal(result.rows.find(([k]) => k.startsWith('SGST'))[1], '₹90.00');
assert.equal(definition.calculate(input('100000', '0')).display, '₹1,00,000.00');
const html = fs.readFileSync('gst-calculator/index.html', 'utf8');
assert.match(html, /<h1>GST Calculator India<\/h1>/);
assert.match(html, /rel="canonical" href="https:\/\/onlinecalmaster.com\/gst-calculator\/"/);
assert(!/name="keywords"/.test(html));
assert.match(html, /name="dynamic-gstMode"/);
assert.match(html, /GST rates can vary/);
assert.match(html, /CGST vs SGST vs IGST/);
assert.match(html, /Remove GST from an inclusive price/);
assert.match(html, /<option value="18" selected>/);
console.log(`${checks} GST arithmetic/validation cases passed, plus tax-label exclusivity, Indian formatting and static SEO checks.`);
