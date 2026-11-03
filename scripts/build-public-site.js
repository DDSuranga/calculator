// Copy approved public files without transforming their HTML or runtime assets.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.resolve(process.argv[2] || path.join(root, '_site'));
if (fs.existsSync(output)) throw new Error('Output must be a new directory; existing files are never removed: ' + output);
const files = new Set([
    '.nojekyll', 'CNAME', 'CNAME.txt', 'LICENSE.txt', 'ads.txt', 'robots.txt', 'sitemap.xml',
    'script.js', 'styles.css', 'blog.js', 'blog.css', 'manifest.json', 'service-worker.js',
    'Logo.png', 'favicon.ico', 'favicon-32x32.png', 'apple-touch-icon.png',
    'icon-48x48.png', 'icon-192x192.png', 'icon-512x512.png',
    'b29d22c720714300a8b5dd23f580be47.txt', 'calculators/gst-calculator-india.html'
]);
files.add('assets/bmi/hero-health.webp');
for (const sex of ['male','female']) {
    for (const band of ['toddler','child','teen']) files.add('assets/bmi/characters/'+sex+'-'+band+'-1.webp');
    for (const band of ['adult','middle','senior','elderly']) for(let build=0;build<6;build++) files.add('assets/bmi/characters/'+sex+'-'+band+'-'+build+'.webp');
}
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!urls.length) throw new Error('Sitemap contains no public URLs.');
for (const value of urls) {
    const url = new URL(value);
    if (url.origin !== 'https://onlinecalmaster.com' || url.search || url.hash) throw new Error('Unexpected sitemap URL: ' + value);
    const route = decodeURIComponent(url.pathname).slice(1);
    if (route.includes('..') || route.includes('\\') || /^(?:tests|scripts|content|templates|_site|\.)\//i.test(route)) throw new Error('Nonpublic sitemap path: ' + route);
    const file = route.endsWith('/') || !route ? route + 'index.html' : route;
    if (!/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.html$/.test(file)) throw new Error('Unexpected page path: ' + file);
    files.add(file);
}
// Validate the whole list before creating output; symlinks must never escape the source tree.
for (const file of files) {
    const source = path.join(root, file);
    if (!fs.statSync(source).isFile() || fs.realpathSync(source) !== source) throw new Error('Not a regular public source file: ' + file);
    if (/\.(html|js|css|json|xml|txt)$/.test(file)) {
        const text = fs.readFileSync(source, 'utf8');
        if (/[A-Z]:[\\/](?:Users|PROJECTS)[\\/]|codex-runtimes|PASTE_(?:GOOGLE|BING)_VERIFICATION_CODE_HERE/i.test(text)) throw new Error('Local path or obsolete placeholder in public file: ' + file);
    }
}
for (const file of files) {
    const destination = path.join(output, file);
    fs.mkdirSync(path.dirname(destination), {recursive:true});
    fs.copyFileSync(path.join(root, file), destination);
}
console.log(`Public artifact: ${files.size} files, ${urls.length} sitemap URLs -> ${output}`);
