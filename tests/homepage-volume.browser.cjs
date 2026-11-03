const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://localhost:5530';
(async () => {
    const browser = await chromium.launch({channel: 'chrome', headless: true});
    try {
        const context = await browser.newContext();
        await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        const page = await context.newPage(), errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const width of [360, 414, 1440]) for (const dark of [false, true]) {
            await page.setViewportSize({width, height: 1000});
            assert.equal((await page.goto(base + '/')).status(), 200);
            await page.evaluate(value => {document.body.classList.toggle('dark-mode', value);document.body.classList.toggle('light-mode', !value);}, dark);
            assert(await page.locator('#basicCalculator').isVisible());
            assert.equal(await page.locator('#calculatorList a[data-target]').count(), 42);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
            await page.evaluate(() => {window.homepageReloadMarker = true;});
            for (const [expression, expected] of [['45/5', '9'], ['25*4', '100'], ['100-35', '65'], ['12+8', '20']]) {
                await page.locator('#basicCalculator button[onclick="clearDisplay()"]').click();
                await page.keyboard.type(expression);
                await page.keyboard.press('Enter');
                assert.equal(await page.locator('#display').inputValue(), expected);
                assert.equal(await page.evaluate(() => window.homepageReloadMarker), true);
            }
            await page.locator('#basicCalculator button[onclick="clearDisplay()"]').click();
            await page.keyboard.type('45/5');
            await page.locator('#display').focus();
            await page.keyboard.press('Enter');
            assert.equal(await page.locator('#display').inputValue(), '9');
            await page.locator('#basicCalculator button[onclick="clearDisplay()"]').click();
            await page.keyboard.type('45/5');
            await page.locator('#basicCalculator button[onclick="calculate()"]').click();
            assert.equal(await page.locator('#display').inputValue(), '9');
            await page.locator('#calculatorList a[data-target="volume"]').evaluate(link => link.click());
            await page.waitForSelector('.volume-shape-form');
            assert.equal(new URL(page.url()).pathname, '/volume-calculator/');
            assert.equal(await page.locator('.volume-shape-form').count(), 9);
        }
        assert.deepEqual(errors, []);
        console.log('PASS: production homepage, 42 navigation entries, Enter/equals/no reload, Volume navigation, three widths and both themes; no first-party exceptions.');
    } finally {await browser.close();}
})().catch(error => {console.error(error);process.exitCode = 1;});
