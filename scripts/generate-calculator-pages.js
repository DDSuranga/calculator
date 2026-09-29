// Pre-render crawlable pages while retaining the shared calculator engine and SPA navigation.
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const scriptPath = path.join(root, 'script.js');
let source = fs.readFileSync(scriptPath, 'utf8');
const guides = JSON.parse(fs.readFileSync(path.join(__dirname, 'classic-guides.json'), 'utf8'));
source = source.replace(/\/\/ BEGIN GENERATED CLASSIC GUIDES[\s\S]*?\/\/ END GENERATED CLASSIC GUIDES/,
 '// BEGIN GENERATED CLASSIC GUIDES\nconst CLASSIC_GUIDES = '+JSON.stringify(guides,null,2)+';\n// END GENERATED CLASSIC GUIDES');
fs.writeFileSync(scriptPath, source);
// Read definitions/renderers only; registered event callbacks are not executed.
const elements = {};
const context = {document:{addEventListener(){},querySelectorAll:()=>[],getElementById:id=>elements[id] ||= {}},window:{addEventListener(){}},console};
vm.createContext(context); vm.runInContext(source, context);
const run = code => vm.runInContext(code, context);
const data = run('calculatorData'), groups = run('NAV_GROUPS'), anchors = run('CATEGORY_ANCHORS');
const escape = context.escapeGuideText;
const title = c => c.title || c.name;
const url = c => `https://onlinecalmaster.com/${c.slug}/`;
// Balanced containers preserve nested form/help markup.
function elementRange(html, id) {
 const startTag = new RegExp(`<([a-z][\\w-]*)\\b[^>]*\\bid="${id}"[^>]*>`, 'i').exec(html);
 if (!startTag) throw Error('Missing container: '+id);
 const tags = new RegExp(`</?${startTag[1]}\\b[^>]*>`, 'gi');
 tags.lastIndex = startTag.index + startTag[0].length;
 let depth=1, match;
 while ((match=tags.exec(html))) { depth += match[0].startsWith('</') ? -1 : 1; if (!depth) return {start:startTag.index, openEnd:startTag.index+startTag[0].length, closeStart:match.index, end:tags.lastIndex}; }
 throw Error('Unclosed container: '+id);
}
function fill(html,id,content) {const r=elementRange(html,id);return html.slice(0,r.openEnd)+content+html.slice(r.closeStart);}
const link = (c,cls='') => `<a${cls ? ` class="${cls}"` : ''} href="/${c.slug}/" data-target="${c.target}">${escape(title(c))}</a>`;
const nav = groups.map(([category,label])=>`<section class="navigation-group"><h2>${escape(label)}</h2>${data.filter(c=>c.category===category).map(c=>link(c,'calculator-nav-link')).join('')}</section>`).join('\n');
let template = fs.readFileSync(path.join(root,'index.html'),'utf8');
template = fill(template,'calculatorList',nav).replace(/Showing \d+ calculators/,`Showing ${data.length} calculators`);
template = template.replace(/<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, block=>{
 const schema=JSON.parse(block.replace(/^[^>]*>|<\/script>$/g,''));
 const id=schema['@type']==='WebApplication'?'calculatorApplicationSchema':schema['@type']==='FAQPage'?'homepageFaqSchema':null;
 return id ? block.replace(/<script[^>]*>/,`<script type="application/ld+json" id="${id}">`) : block;
});
if (!template.includes('id="noScriptHelp"')) template=template.replace('</head>','<noscript><style>body.app-loading .app-loader{display:none} #calculatorSidebar{display:block!important;position:static!important}</style></noscript>\n</head>').replace('<main class="calculator-container" id="mainCalculator" tabindex="-1">','<main class="calculator-container" id="mainCalculator" tabindex="-1">\n<noscript id="noScriptHelp"><p>Enable JavaScript to calculate. The guides and calculator links below remain available without it.</p></noscript>');
for (const c of data) template=template.replaceAll(`href="/${c.slug}"`,`href="/${c.slug}/"`);
const basic=data.find(c=>c.target==='basic');
template=fill(template,'calculatorGuide',context.getCalculatorGuideHtml(basic));
template=fill(template,'contextDescription',escape(context.getCalculatorIntroduction(basic)));
context.current=basic;
template=fill(template,'relatedCalculators',run('getRelatedCalculators(current)').map(c=>link(c)).join(''));
fs.writeFileSync(path.join(root,'index.html'),template);
for (const calculator of data) {
 context.current=calculator;
 const pageTitle=escape(calculator.seoTitle || title(calculator)+' | OnlineCalMaster'), description=escape(calculator.metaDescription);
 let html=template.replace('<head>','<head>\n    <base href="/">')
 .replace(/<title>[\s\S]*?<\/title>/,`<title>${pageTitle}</title>`)
 .replace(/(<meta name="description" content=")[^"]*/,'$1'+description)
 .replace(/(<link rel="canonical" href=")[^"]*/,'$1'+url(calculator))
 .replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${escape(title(calculator))}</h1>`)
 .replace(/(<p class="hero-subtitle">)[\s\S]*?<\/p>/,'$1'+escape(context.getCalculatorIntroduction(calculator))+'</p>');
 for (const [key,value] of [['og:title',pageTitle],['og:description',description],['og:url',url(calculator)],['twitter:title',pageTitle],['twitter:description',description]]) html=html.replace(new RegExp('(<meta (?:property|name)="'+key+'" content=")[^"]*'),'$1'+value);
 html=fill(html,'calculatorGuide',context.getCalculatorGuideHtml(calculator));
 if (calculator.target === 'gst') html=html.replace(/\s*<meta name="keywords"[^>]*>/,'');
 html=fill(html,'contextDescription',escape(context.getCalculatorIntroduction(calculator)));
 html=fill(html,'calculatorBreadcrumb',`<a href="/">Home</a><a href="/#${anchors[calculator.category]}">${escape(calculator.category)}</a><span aria-current="page">${escape(title(calculator))}</span>`);
 html=fill(html,'relatedCalculators',run('getRelatedCalculators(current)').map(c=>link(c)).join(''));
 html=fill(html,'calculatorApplicationSchema',JSON.stringify(context.getCalculatorApplicationSchema(calculator),null,2));
 html=html.replace(/<script type="application\/ld\+json" id="homepageFaqSchema">[\s\S]*?<\/script>/,'');
 html=html.replace(/    <section class="homepage-seo"[\s\S]*?(?=    <footer class="site-footer")/,'');
 const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:'https://onlinecalmaster.com/'},{'@type':'ListItem',position:2,name:calculator.category,item:'https://onlinecalmaster.com/#'+anchors[calculator.category]},{'@type':'ListItem',position:3,name:title(calculator),item:url(calculator)}]};
 html=html.replace('</head>',`<script type="application/ld+json" id="calculatorBreadcrumbSchema">${JSON.stringify(breadcrumb)}</script>\n</head>`);
 if (calculator.dynamicTool) {
  context.renderDynamicTool(calculator);
  for (const id of ['dynamicToolTitle','dynamicToolDescription','dynamicToolForm','dynamicToolHelp']) html=fill(html,id,elements[id].innerHTML || escape(elements[id].textContent));
 }
 const inactive=[];
 for (const id of new Set(data.map(c=>c.elementId))) {
  const range=elementRange(html,id), panel=html.slice(range.start,range.end);
  if (id===calculator.elementId) {
   const shown=panel.replace(/^<div[^>]*>/,tag=>tag.replace(/ style="[^"]*"/,'').replace(/>$/,' style="display: block;">'));
   html=html.slice(0,range.start)+shown+html.slice(range.end);
  } else { inactive.push(panel); html=html.slice(0,range.start)+html.slice(range.end); }
 }
 const guideStart=elementRange(html,'calculatorGuide').start;
 html=html.slice(0,guideStart)+`<template id="calculatorPanels">${inactive.join('\n')}</template>\n`+html.slice(guideStart);
 fs.mkdirSync(path.join(root,calculator.slug),{recursive:true});
 fs.writeFileSync(path.join(root,calculator.slug,'index.html'),html.replace(/[ \t]+$/gm,'').trimEnd()+'\n');
}
console.log(`Pre-rendered ${data.length} calculator pages and homepage navigation.`);
