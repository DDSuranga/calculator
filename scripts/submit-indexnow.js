// Manual utility only; never loaded by visitors or run automatically on deployment.
// Node.js 18+: node scripts/submit-indexnow.js [--submit]
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://onlinecalmaster.com';
const KEY = 'b29d22c720714300a8b5dd23f580be47';
const KEY_URL = `${ORIGIN}/${KEY}.txt`;
const STATE = path.join(os.homedir(), '.onlinecalmaster-indexnow', 'submitted.json');
const hash = text => crypto.createHash('sha256').update(text).digest('hex');

function sitemapUrls(xml) {
    const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(m => m[1].replace(/&amp;/g, '&'));
    if (!urls.length) throw new Error('Sitemap contains no URLs.');
    for (const value of urls) {
        const u = new URL(value);
        if (u.origin !== ORIGIN || u.username || u.password || u.hash || u.search)
            throw new Error(`Refusing noncanonical or external URL: ${value}`);
    }
    return [...new Set(urls)];
}

function validatePage(url, response, html) {
    if (response.status !== 200) throw new Error(`${url}: HTTP ${response.status}; redirects are not followed.`);
    if (!/text\/html/i.test(response.headers.get('content-type') || '')) throw new Error(`${url}: not HTML`);
    if (/\b(noindex|none)\b/i.test(response.headers.get('x-robots-tag') || '')) throw new Error(`${url}: X-Robots-Tag excludes indexing`);
    const tags = html.match(/<(?:meta|link)\b[^>]*>/gi) || [];
    const attr = (tag, name) => tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'))?.[1];
    for (const tag of tags) {
        if (/^(robots|bingbot|googlebot)$/i.test(attr(tag, 'name') || '') && /\b(noindex|none)\b/i.test(attr(tag, 'content') || ''))
            throw new Error(`${url}: noindex meta directive`);
    }
    const canonical = tags.find(t => /^canonical$/i.test(attr(t, 'rel') || ''));
    if (!canonical || attr(canonical, 'href') !== url) throw new Error(`${url}: missing or different canonical`);
}

async function get(url) {
    return fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(30000), cache: 'no-store' });
}

async function main(args = process.argv.slice(2)) {
    if (args.some(a => a !== '--submit') || args.length > 1) throw new Error('Usage: node scripts/submit-indexnow.js [--submit]');
    const submit = args.includes('--submit');
    if (fs.readFileSync(path.join(ROOT, `${KEY}.txt`), 'utf8') !== KEY) throw new Error('Local verification file is not exact.');
    const urls = sitemapUrls(fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8'));
    const robots = await get(`${ORIGIN}/robots.txt`);
    const robotsText = await robots.text();
    // Fail closed if crawl rules change; do not guess which URLs remain permitted.
    if (robots.status !== 200 || /^\s*Disallow:\s*\S+/im.test(robotsText)) throw new Error('Review live robots.txt before submission.');
    const liveSitemap = await get(`${ORIGIN}/sitemap.xml`);
    if (liveSitemap.status !== 200) throw new Error('Live sitemap is unavailable.');
    const liveUrls = new Set(sitemapUrls(await liveSitemap.text()));
    if (urls.some(u => !liveUrls.has(u))) throw new Error('Local sitemap includes URLs not in live sitemap; deploy first.');
    const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
    const changed = [];
    for (const url of urls) {
        const response = await get(url);
        const html = await response.text();
        validatePage(url, response, html);
        const digest = hash(html.replace(/\r\n/g, '\n'));
        if (state[url] !== digest) changed.push({ url, digest });
    }
    console.log(`${urls.length} live indexable URLs validated; ${changed.length} new/changed URLs.`);
    if (!submit) {
        console.log('DRY RUN: no IndexNow request sent. Deploy the key file, then use --submit.');
        console.log(changed.map(x => x.url).join('\n'));
        return;
    }
    const keyResponse = await get(KEY_URL);
    if (keyResponse.status !== 200 || await keyResponse.text() !== KEY) throw new Error('Live verification file missing or incorrect; no submission sent.');
    if (!changed.length) return;
    // Exclusive lock prevents concurrent runs from submitting the same batch.
    fs.mkdirSync(path.dirname(STATE), { recursive: true });
    const lock = `${STATE}.lock`;
    const fd = fs.openSync(lock, 'wx');
    try {
        const latest = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
        const pending = changed.filter(x => latest[x.url] !== x.digest);
        for (let offset = 0; offset < pending.length; offset += 10000) {
            const batch = pending.slice(offset, offset + 10000);
            const response = await fetch('https://api.indexnow.org/indexnow', {
                method: 'POST', redirect: 'error', signal: AbortSignal.timeout(30000),
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
                body: JSON.stringify({ host: 'onlinecalmaster.com', key: KEY, keyLocation: KEY_URL, urlList: batch.map(x => x.url) })
            });
            if (![200, 202].includes(response.status)) throw new Error(`IndexNow HTTP ${response.status}; no automatic retries.`);
            for (const item of batch) latest[item.url] = item.digest;
            fs.writeFileSync(`${STATE}.tmp`, JSON.stringify(latest, null, 2));
            fs.renameSync(`${STATE}.tmp`, STATE);
            console.log(`${batch.length} URLs: HTTP ${response.status}${response.status === 202 ? ' (key validation pending)' : ' (received)'}. Receipt does not guarantee indexing.`);
        }
    } finally {
        fs.closeSync(fd);
        fs.unlinkSync(lock);
    }
}
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = 1; });
module.exports = { sitemapUrls, validatePage };
