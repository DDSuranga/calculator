// Verify cache upgrades, current assets, offline routes and manifest resources.
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const source = fs.readFileSync('service-worker.js', 'utf8');
const cacheName = source.match(/const CACHE_NAME = '([^']+)'/)[1];
const listeners = {}, cache = new Map(), deleted = [];
let networkDown = false, claimed = false, skipped = false;
const bucket = {
    addAll: async urls => {
        for (const url of urls) {
            const file = url === '/' ? 'index.html' : url.slice(1);
            assert.ok(fs.existsSync(file), `Missing precache resource: ${url}`);
            cache.set(url, new Response(fs.readFileSync(file)));
        }
    },
    match: async key => cache.get(typeof key === 'string' ? key : new URL(key.url).pathname)?.clone(),
    put: async (request, response) => cache.set(new URL(request.url).pathname, response)
};
const context = {
    URL, Response,
    caches: {
        open: async () => bucket,
        keys: async () => ['calculator-cache-v8', 'onlinecalmaster-v10-redesign', 'onlinecalmaster-v11-polish', 'onlinecalmaster-v12-adsense-only', 'unrelated-app', cacheName],
        delete: async key => { deleted.push(key); return true; }
    },
    fetch: async (request, options) => {
        assert.equal(options.cache, 'no-cache');
        if (networkDown) throw Error('offline');
        return new Response('new asset');
    },
    self: {
        location: { origin: 'https://onlinecalmaster.com' },
        addEventListener: (key, fn) => { listeners[key] = fn; },
        skipWaiting: async () => { skipped = true; },
        clients: { claim: async () => { claimed = true; } }
    }
};
vm.runInNewContext(source, context);
function request(path, destination, mode) {
    let response;
    listeners.fetch({
        request: { url: 'https://onlinecalmaster.com' + path, method: 'GET', destination, mode },
        respondWith: promise => { response = promise; }
    });
    return response;
}
(async () => {
    for (const event of ['install', 'activate']) {
        let promise;
        listeners[event]({ waitUntil: p => { promise = p; } });
        await promise;
    }
    assert.ok(skipped && claimed);
    assert.deepEqual(deleted, ['calculator-cache-v8', 'onlinecalmaster-v10-redesign', 'onlinecalmaster-v11-polish', 'onlinecalmaster-v12-adsense-only']);
    for (const asset of ['/styles.css', '/script.js', '/manifest.json']) {
        assert.equal(await (await request(asset, asset.endsWith('.css') ? 'style' : asset.endsWith('.js') ? 'script' : 'manifest')).text(), 'new asset');
        assert.equal(await cache.get(asset).clone().text(), 'new asset');
    }
    networkDown = true;
    assert.equal(await (await request('/styles.css', 'style')).text(), 'new asset');
    assert.match(await (await request('/bmi-calculator/', 'document', 'navigate')).text(), /<base href="\/">/);
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    assert.ok(!manifest.shortcuts.some(shortcut => /currency/i.test(shortcut.name)));
    for (const icon of [...manifest.icons, ...manifest.shortcuts.flatMap(shortcut => shortcut.icons || [])]) {
        const png = fs.readFileSync(icon.src.slice(1));
        assert.equal(png.subarray(1, 4).toString(), 'PNG');
        assert.equal(`${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`, icon.sizes);
        assert.equal((await (await request(icon.src, 'image')).arrayBuffer()).byteLength, png.length);
    }
    for (const shortcut of manifest.shortcuts) assert.ok(fs.existsSync(shortcut.url.slice(1) + 'index.html'));
    let ignored = true;
    listeners.fetch({ request: { url: 'https://www.googletagmanager.com/a.js', method: 'GET', destination: 'script' }, respondWith: () => { ignored = false; } });
    assert.ok(ignored);
    console.log('Service worker upgrade, revalidation, offline shell/assets/icons, manifest dimensions/shortcuts and third-party exclusion passed.');
})().catch(error => { console.error(error); process.exitCode = 1; });
