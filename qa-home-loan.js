// Reducing-balance housing loan formula and input validation.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const context = { document: { addEventListener() {}, querySelectorAll: () => [], getElementById: () => ({}) }, window: { addEventListener() {} }, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);
const values = (amount = '3000000', rate = '8.5', tenure = '20', unit = 'years') => ({ homeLoanAmount: amount, homeLoanRate: rate, homeLoanTenure: tenure, homeLoanUnit: unit });
const near = (actual, expected) => assert(Math.abs(actual - expected) <= Math.max(1e-6, Math.abs(expected) * 1e-11), `${actual} != ${expected}`);
let checks = 0;
for (const input of [values(), values('1200000', '0', '10'), values('5000000', '7.5', '15'), values('10000000', '9', '25'), values('0'), values('1234567.89', '8.25', '1.5'), values('3000000', '8.5', '240', 'months'), values('1000000000000', '100', '100'), values('1000', '0', '1', 'months')]) {
    const p = Number(input.homeLoanAmount), r = Number(input.homeLoanRate) / 1200, n = Number(input.homeLoanTenure) * (input.homeLoanUnit === 'years' ? 12 : 1);
    const expected = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const result = context.calculateHomeLoanEmi(input);
    near(result.emi, expected); near(result.total, expected * n); near(result.interest, expected * n - p);
    assert.equal(result.months, n); assert(Object.values(result).every(Number.isFinite)); checks++;
}
const example = context.calculateHomeLoanEmi(values());
let balance = example.principal;
for (let month = 0; month < example.months; month++) balance = balance * (1 + 0.085 / 12) - example.emi;
near(balance, 0); checks++;
const zero = context.calculateHomeLoanEmi(values('1200000', '0', '10'));
assert.equal(zero.emi, 10000); assert.equal(zero.interest, 0); assert.equal(zero.total, 1200000); checks++;
const tiny = context.calculateHomeLoanEmi(values('1200000', '0.000000000001', '10'));
near(tiny.emi, 10000); assert(tiny.interest >= 0); checks++;
for (const key of ['homeLoanAmount', 'homeLoanRate', 'homeLoanTenure']) {
    for (const invalid of ['', ' ', '-1', 'abc', 'NaN', 'Infinity', '1e309', '12abc', null, undefined]) {
        assert.throws(() => context.calculateHomeLoanEmi({ ...values(), [key]: invalid })); checks++;
    }
}
for (const input of [values('1000000000001'), values('1000', '101'), values('1000', '8', '0'), values('1000', '8', '101'), values('1000', '8', '1.1'), values('1000', '8', '1.5', 'months'), values('1000', '8', '1201', 'months'), values('1000', '8', '12', 'days')]) {
    assert.throws(() => context.calculateHomeLoanEmi(input)); checks++;
}
const definition = vm.runInContext('dynamicToolDefinitions.homeLoanEmi', context);
for (const value of [example.emi, example.interest, example.total]) assert(definition.help.example.includes(context.formatHomeLoanCurrency(value)));
assert.deepEqual(Array.from(definition.fields, f => f.value), ['3000000', '8.5', '20', 'years']);
assert.equal(context.formatHomeLoanCurrency(3000000), '₹30,00,000.00');
assert(!/NaN|Infinity|undefined/.test(definition.calculate(values()).display));
const html = fs.readFileSync('home-loan-emi-calculator/index.html', 'utf8');
assert(html.includes(definition.help.example)); assert(!/name="keywords"/.test(html));
assert.match(html, /<h1[^>]*>Home Loan EMI Calculator India<\/h1>/);
assert(html.includes('rel="canonical" href="https://onlinecalmaster.com/home-loan-emi-calculator/"'));
assert(html.includes('href="/loan-emi-calculator/"'));
console.log(`${checks} Home Loan EMI formula/validation cases passed, plus amortization, zero/tiny rates, defaults, Indian formatting and generated-example/SEO checks.`);
console.log(JSON.stringify(example, null, 2));
