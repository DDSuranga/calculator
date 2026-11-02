const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
test('public artifact retains site bytes and excludes internal source/governance files', () => {
    const output = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ocm-public-')), 'site');
    execFileSync(process.execPath, [path.join(root, 'scripts/build-public-site.js'), output]);
    const files = fs.readdirSync(output, {recursive:true}).filter(f => fs.statSync(path.join(output, f)).isFile());
    for (const f of files) {
        assert(fs.readFileSync(path.join(output, f)).equals(fs.readFileSync(path.join(root, f))), f + ' changed');
        assert(!/(?:^|[\\/])(?:tests|scripts|content|templates|\.github|\.vscode|node_modules)(?:[\\/]|$)|\.(?:md|csv|cjs)$|(?:^|[\\/])qa-/i.test(f), f + ' internal');
    }
    for (const f of ['AGENTS.md','AI_SIGNATURE_AUDIT.md','AI_SIGNATURE_AUDIT.csv','ETSY_FEE_IMPLEMENTATION.md','tests/etsy-fee.browser.cjs','tests/roof-pitch.browser.cjs','qa-regression.js']) assert(!fs.existsSync(path.join(output,f)),f);
    for (const f of ['LICENSE.txt','CNAME','ads.txt','robots.txt','sitemap.xml','manifest.json','service-worker.js','b29d22c720714300a8b5dd23f580be47.txt','calculators/gst-calculator-india.html']) assert(fs.existsSync(path.join(output,f)),f);
    const urls = [...fs.readFileSync(path.join(output,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
    assert.equal(urls.length,62);
    for(const u of urls) assert(fs.existsSync(path.join(output,u.slice(1)+(u.endsWith('/')?'index.html':''))),u);
    assert.throws(()=>execFileSync(process.execPath,[path.join(root,'scripts/build-public-site.js'),output],{stdio:'pipe'}));
});
