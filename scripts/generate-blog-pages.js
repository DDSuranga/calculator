// Only the explicitly listed article sources are published. No directory copying.
const fs = require('fs'), path = require('path'), assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const articles = require('../content/articles.json');
const template = fs.readFileSync(path.join(root, 'templates/article.html'), 'utf8');
const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const origin = 'https://onlinecalmaster.com';
const escape = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const integrations = [...home.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>m[0]).filter(s=> /adsbygoogle\.js|googletagmanager\.com\/gtm\.js|googletagmanager\.com\/gtag\/js|gtag\('config'/.test(s)).join('\n');
assert.equal((integrations.match(/adsbygoogle\.js/g)||[]).length, 1);
const gtmNoscript = home.match(/<noscript><iframe[\s\S]*?<\/iframe><\/noscript>/)[0];
const slugs = new Set(articles.map(a=>a.slug));
assert.equal(slugs.size, articles.length);
for (const a of articles) {
    assert.match(a.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert(fs.existsSync(path.join(root, a.calculator, 'index.html')));
    for (const slug of a.related) assert(slugs.has(slug), `Unpublished related article: ${slug}`);
}
function card(a) { return `<li><h3><a href="/blog/${a.slug}/">${escape(a.title)}</a></h3><p>${escape(a.summary)}</p></li>`; }
function write(relative, title, description, breadcrumb, content, schema, type) {
    const values={TITLE:escape(title),DESCRIPTION:escape(description),URL:origin+relative,OG_TYPE:type,INTEGRATIONS:integrations,GTM_NOSCRIPT:gtmNoscript,BREADCRUMB:breadcrumb,CONTENT:content,SCHEMA:JSON.stringify(schema).replace(/</g,'\\u003c')};
    const html=template.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{assert(key in values,key);return values[key];});
    const dir=path.join(root, relative);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'index.html'),html);
}
const crumb = (title,url) => ({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:origin+'/'},{'@type':'ListItem',position:2,name:'Knowledge Base',item:origin+'/blog/'},...(url ? [{'@type':'ListItem',position:3,name:title,item:origin+url}] : [])]});
for (const a of articles) {
    const body=fs.readFileSync(path.join(root,'content/articles',a.slug+'.html'),'utf8');
    assert(!/<h1\b|<script\b|<iframe\b/i.test(body), a.slug+' invalid article body');
    const headings=[...body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
    assert(headings.length>=4);
    const toc=`<nav class="kb-toc" aria-label="On this page"><h2>On this page</h2><ul>${headings.map(m=>`<li><a href="#${m[1]}">${m[2]}</a></li>`).join('')}</ul></nav>`;
    const related=a.related.length ? `<section class="kb-related"><h2>Related reading</h2><ul>${a.related.map(slug=>{const r=articles.find(a=>a.slug===slug);return `<li><a href="/blog/${slug}/">${escape(r.title)}</a></li>`;}).join('')}</ul></section>` : '';
    const content=`<article class="kb-article"><header><p class="kb-category">${escape(a.category)}</p><h1>${escape(a.title)}</h1><p>${escape(a.summary)}</p></header>${toc}${body}<aside class="kb-use-tool"><h2>Try the calculation</h2><p><a href="/${a.calculator}/">Open the ${escape(a.calculatorName)}</a> to apply the method. Check the stated inputs and limitations before interpreting the result.</p></aside>${related}<p>Found an error? <a href="/contact.html">Contact OnlineCalMaster</a> with the article URL, inputs and expected result. Avoid sending sensitive personal information.</p></article>`;
    const url='/blog/'+a.slug+'/';
    const schema=[{'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.description,inLanguage:'en',url:origin+url,mainEntityOfPage:origin+url,publisher:{'@type':'Organization',name:'OnlineCalMaster',url:origin+'/'}},crumb(a.title,url)];
    write(url,a.title,a.description,`<a href="/">Home</a><a href="/blog/">Knowledge Base</a><span aria-current="page">${escape(a.title)}</span>`,content,schema,'article');
}
const title='Knowledge Base: Practical Calculation Guides';
const content=`<h1>${title}</h1><p>Understand the method behind the result. These guides explain formulas, measurements, rounding and common mistakes, with examples you can check in our free calculators.</p>${[...new Set(articles.map(a=>a.category))].map(category=>`<section><h2>${escape(category)}</h2><ul class="kb-cards">${articles.filter(a=>a.category===category).map(card).join('')}</ul></section>`).join('')}<p>Need a result now? <a href="/">Browse all calculators</a>. For information about the site and reporting calculation errors, visit <a href="/about.html">About Us</a>.</p>`;
write('/blog/',title,'Practical guides to age, volume, tips, percentage change and date counting, with worked examples and links to free OnlineCalMaster calculators.','<a href="/">Home</a><span aria-current="page">Knowledge Base</span>',content,[{'@context':'https://schema.org','@type':'CollectionPage',name:title,url:origin+'/blog/'},crumb(title)],'website');
console.log(`Generated Knowledge Base index and ${articles.length} articles.`);
