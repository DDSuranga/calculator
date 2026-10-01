const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');
const scriptPath = path.join(projectRoot, 'script.js');
const sitemapPath = path.join(projectRoot, 'sitemap.xml');
const robotsPath = path.join(projectRoot, 'robots.txt');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getBaseUrl() {
    const fromEnv = process.env.SITE_URL || process.env.BASE_URL;
    if (fromEnv) return normalizeBaseUrl(fromEnv);

    const cnamePath = path.join(projectRoot, 'CNAME');
    if (fs.existsSync(cnamePath)) {
        const domain = fs.readFileSync(cnamePath, 'utf8').trim();
        if (domain) return normalizeBaseUrl(`https://${domain}`);
    }

    return 'https://onlinecalmaster.com';
}

function normalizeBaseUrl(value) {
    return value.trim().replace(/\/+$/g, '').toLowerCase();
}

function extractCalculatorData() {
    const script = fs.readFileSync(scriptPath, 'utf8');
    const startToken = 'const calculatorData = [';
    const start = script.indexOf(startToken);
    if (start === -1) throw new Error('calculatorData was not found in script.js.');

    let index = start + 'const calculatorData = '.length;
    let depth = 0;
    let inString = false;
    let quote = '';
    let escaped = false;

    for (; index < script.length; index += 1) {
        const char = script[index];

        if (inString) {
            if (escaped) {
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === quote) {
                inString = false;
                quote = '';
            }
            continue;
        }

        if (char === '\'' || char === '"' || char === '`') {
            inString = true;
            quote = char;
            continue;
        }

        if (char === '[') depth += 1;
        if (char === ']') {
            depth -= 1;
            if (depth === 0) {
                const arraySource = script.slice(start + 'const calculatorData = '.length, index + 1);
                return vm.runInNewContext(arraySource);
            }
        }
    }

    throw new Error('calculatorData array could not be parsed.');
}

function xmlEscape(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function normalizePath(urlPath) {
    if (urlPath === '/') return '/';
    const clean = urlPath.replace(/^\/+|\/+$/g, '').toLowerCase();
    return `/${clean}${clean.includes('.') ? '' : '/'}`;
}

function createEntry(baseUrl, urlPath, lastmod, changefreq, priority) {
    const normalizedPath = normalizePath(urlPath);
    return {
        loc: `${baseUrl}${normalizedPath === '/' ? '/' : normalizedPath}`,
        lastmod,
        changefreq,
        priority
    };
}

function validateEntries(entries) {
    const seen = new Set();
    for (const entry of entries) {
        const url = new URL(entry.loc);
        if (url.href !== url.href.toLowerCase()) {
            throw new Error(`Sitemap URL must be lowercase: ${entry.loc}`);
        }
        if (seen.has(entry.loc)) {
            throw new Error(`Duplicate sitemap URL: ${entry.loc}`);
        }
        seen.add(entry.loc);
    }
}

function buildSitemap(entries) {
    const urls = entries.map(entry => `    <url>
        <loc>${xmlEscape(entry.loc)}</loc>
        <lastmod>${entry.lastmod}</lastmod>
        <changefreq>${entry.changefreq}</changefreq>
        <priority>${entry.priority}</priority>
    </url>`).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots(baseUrl) {
    return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}

function main() {
    const baseUrl = getBaseUrl();
    const lastmod = new Date().toISOString().slice(0, 10);
    const calculators = extractCalculatorData();

    calculators.forEach(calculator => {
        if (!calculator.slug || !slugPattern.test(calculator.slug)) {
            throw new Error(`Invalid slug for ${calculator.name || calculator.target}: ${calculator.slug}`);
        }
    });

    const staticPages = [
        { path: '/', changefreq: 'weekly', priority: '1.0' },
        { path: '/about.html', changefreq: 'monthly', priority: '0.7' },
        { path: '/contact.html', changefreq: 'monthly', priority: '0.6' },
        { path: '/privacy-policy.html', changefreq: 'monthly', priority: '0.5' },
    ];

    const entries = [
        ...staticPages.map(page => createEntry(baseUrl, page.path, lastmod, page.changefreq, page.priority)),
        ...calculators.map(calculator => createEntry(baseUrl, calculator.slug, lastmod, 'weekly', '0.8'))
    ];

    validateEntries(entries);

    fs.writeFileSync(sitemapPath, buildSitemap(entries), 'utf8');
    fs.writeFileSync(robotsPath, buildRobots(baseUrl), 'utf8');

    console.log(`Generated sitemap.xml with ${entries.length} URLs.`);
    console.log(`Generated robots.txt using ${baseUrl}.`);
}

main();
