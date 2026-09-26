// Generate GitHub Pages directory entries from the one shared application shell.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const data = vm.runInNewContext(source.match(/const calculatorData = (\[[\s\S]*?\n\]);/)[1]);
const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const escape = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
for (const calculator of data) {
 const title = escape((calculator.title || calculator.name) + ' | OnlineCalMaster');
 const description = escape(calculator.metaDescription);
 const url = `https://onlinecalmaster.com/${calculator.slug}/`;
 let html = template.replace('<head>', '<head>\n    <base href="/">')
 .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
 .replace(/(<meta name="description" content=")[^"]*/, '$1'+description)
 .replace(/(<link rel="canonical" href=")[^"]*/, '$1'+url);
 for (const [key,value] of [['og:title',title],['og:description',description],['og:url',url],['twitter:title',title],['twitter:description',description]]) {
  html = html.replace(new RegExp('(<meta (?:property|name)="'+key+'" content=")[^"]*'), '$1'+value);
 }
 const dir=path.join(root,calculator.slug);
 fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'index.html'),html.replace(/[ \t]+$/gm,'').trimEnd()+'\n');
}
console.log(`Generated ${data.length} shared-engine calculator entry pages.`);
