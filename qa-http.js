// Exercise real HTTP routes and deployed first-party assets, not a file:// fallback.
// Usage: node qa-http.js [http://127.0.0.1:5501 | https://onlinecalmaster.com]
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const base = new URL(process.argv[2] || 'http://127.0.0.1:5501');
const registry = vm.runInNewContext(fs.readFileSync('script.js', 'utf8').match(/const calculatorData = (\[[\s\S]*?\n\]);/)[1]);
async function get(path, options = {}) {
    const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30000), cache: 'no-cache', ...options });
    assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
    return response;
}
(async () => {
    const sitemap = await (await get('/sitemap.xml')).text();
    const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
    let schemaCount = 0;
    for (const path of paths) {
        const html = await (await get(path)).text();
        assert.match(html, /<title>[^<]+<\/title>/, path);
        assert.match(html, /<meta name="description" content="[^"]+"/, path);
        assert.match(html, /rel="canonical" href="https:\/\/onlinecalmaster.com\//, path);
        for (const schema of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) { JSON.parse(schema[1]); schemaCount++; }
    }
    for (const tool of registry) {
        const path = `/${tool.slug}/`;
        assert.ok(paths.includes(path), `Missing sitemap route ${path}`);
        const response = await get(path.slice(0, -1));
        assert.equal(new URL(response.url).pathname, path);
        const html = await response.text();
        assert.ok(html.includes(`rel="canonical" href="https://onlinecalmaster.com${path}"`), path);
        assert.ok(html.includes('<base href="/">'), path);
    }
    assert.match(await (await get('/robots.txt')).text(), /Sitemap:\s*https:\/\/onlinecalmaster.com\/sitemap.xml/i);
    for (const file of ['script.js', 'styles.css', 'service-worker.js', 'manifest.json']) {
        const live = (await (await get('/' + file)).text()).replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
        const local = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
        assert.equal(live, local, `${file}: server must serve this release`);
    }
    const manifest = await (await get('/manifest.json')).json();
    assert.ok(!manifest.shortcuts.some(shortcut => /currency/i.test(shortcut.name)));
    for (const icon of manifest.icons) {
        const response = await get(icon.src);
        assert.match(response.headers.get('content-type'), /image\/png/);
        const png = Buffer.from(await response.arrayBuffer());
        assert.equal(png.subarray(1, 4).toString(), 'PNG');
        assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes);
    }
    for (const shortcut of manifest.shortcuts) await get(shortcut.url);
    console.log(`${base.origin}: ${registry.length}/35 calculator routes, ${paths.length} sitemap pages, ${schemaCount} schemas, robots, release assets, manifest/icons/shortcuts passed.`);
})().catch(error => { console.error(error.message); process.exitCode = 1; });
