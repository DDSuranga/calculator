// GitHub Pages serves foo.html at /foo with HTTP 200 (no directory redirect).
// Retain established canonical URLs rather than adding duplicate sitemap entries.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const aliases = { 'calculators/gst-calculator-india.html': 'gst-calculator/index.html' };
for (const [destination, source] of Object.entries(aliases)) {
    fs.mkdirSync(path.dirname(path.join(root, destination)), { recursive: true });
    fs.copyFileSync(path.join(root, source), path.join(root, destination));
}
console.log(`Generated ${Object.keys(aliases).length} static route compatibility page.`);
