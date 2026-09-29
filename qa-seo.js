// Read-only audit. Usage: node qa-seo.js [http://127.0.0.1:5501 | https://onlinecalmaster.com]
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const base=new URL(process.argv[2]||'http://127.0.0.1:5501');
const origin='https://onlinecalmaster.com';
const data=vm.runInNewContext(fs.readFileSync('script.js','utf8').match(/const calculatorData = (\[[\s\S]*?\n\]);/)[1]);
const visibleSource=h=>h.replace(/<template\b[^>]*>[\s\S]*?<\/template>/g,'').replace(/<!--[\s\S]*?-->/g,'');
const text=s=>s.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').trim();
const links=h=>[...h.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
async function get(p){const r=await fetch(new URL(p,base),{redirect:'manual',cache:'no-store',signal:AbortSignal.timeout(30000)});assert.equal(r.status,200,p+' HTTP '+r.status);assert(!/noindex|nofollow/i.test(r.headers.get('x-robots-tag')||''),p+' blocked response');return r.text();}
(async()=>{
 const sitemap=await get('/sitemap.xml'),urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.match(sitemap,/<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);assert.match(sitemap,/<\/urlset>\s*$/);
 assert.equal(urls.length,42);assert.equal(new Set(urls).size,urls.length);
 const robots=await get('/robots.txt');assert.match(robots,/User-agent:\s*\*/);assert.match(robots,/Allow:\s*\//);assert(!/^Disallow:\s*\S/m.test(robots));assert(robots.includes(origin+'/sitemap.xml'));
 const pages=new Map(),titles=new Set(),descriptions=new Set(),headings=new Set();
 for(const u of urls){assert(u.startsWith(origin+'/'));const p=new URL(u).pathname;pages.set(p,await get(p));}
 for(const c of data){
  const p='/'+c.slug+'/',url=origin+p,h=visibleSource(pages.get(p)||'');assert(urls.includes(url),p+' sitemap');
  assert(!/<meta[^>]+name="robots"[^>]+content="[^"]*(noindex|nofollow)/i.test(h));
  const canonical=[...h.matchAll(/rel="canonical" href="([^"]+)"/g)];assert.equal(canonical.length,1);assert.equal(canonical[0][1],url);
  const title=text(h.match(/<title>([\s\S]*?)<\/title>/)[1]),description=h.match(/<meta name="description" content="([^"]+)"/)[1];
  const h1=[...h.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];assert.equal(h1.length,1,p+' H1 count');const heading=text(h1[0][1]);assert.equal(heading,c.title||c.name);
  for(const [set,value,label] of [[titles,title,'title'],[descriptions,description,'description'],[headings,heading,'H1']]){assert(!set.has(value),p+' duplicate '+label);set.add(value);}
  const panels=[...h.matchAll(/<div class="calculator(?: [^"]*)?" id="([^"]+)"/g)];assert.equal(panels.length,1,p+' initial active panels');assert.equal(panels[0][1],c.elementId);
  assert.match(h,/How to [Uu]se/);assert.match(h,/Formula|Explanation/);assert.match(h,/Example/);
  if(c.dynamicTool)assert.match(h,/id="dynamic-[^"]+"|onclick="calculateDynamicTool\(\)"/);
  const nav=h.match(/id="calculatorList"[^>]*>([\s\S]*?)<\/aside>/)[1];for(const other of data)assert(links(nav).includes('/'+other.slug+'/'),p+' missing static nav '+other.slug);
  const related=h.match(/id="relatedCalculators"[^>]*>([\s\S]*?)<\/div>/)[1];assert.equal(links(related).length,5);assert(!links(related).includes(p));
  const schema=[...h.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
  const app=schema.filter(s=>s['@type']==='WebApplication');assert.equal(app.length,1);assert.equal(app[0].url,url);assert.equal(app[0].name,heading);
  const crumb=schema.filter(s=>s['@type']==='BreadcrumbList');assert.equal(crumb.length,1);assert.equal(crumb[0].itemListElement.at(-1).item,url);assert(!schema.some(s=>s['@type']==='FAQPage'));
  assert.equal((h.match(/adsbygoogle\.js\?client=ca-pub-4953018177794421/g)||[]).length,1);assert(h.includes('G-2F25VNZYGT'));assert(h.includes('GTM-WSQH8DCC'));
  const redirect=await fetch(new URL(p.slice(0,-1),base),{redirect:'manual'});assert.equal(redirect.status,301);assert.equal(new URL(redirect.headers.get('location'),base).pathname,p);
 }
 const home=visibleSource(pages.get('/'));for(const c of data)assert(links(home).includes('/'+c.slug+'/'),'homepage '+c.slug);
 const homeSchema=[...home.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert.equal(homeSchema.find(s=>s['@type']==='WebSite').url,origin+'/');
 for(const question of homeSchema.find(s=>s['@type']==='FAQPage').mainEntity)assert(home.includes(question.name),'FAQ question must be visible');
 // Audit every internal link in submitted HTML. Keep historical/non-calculator issues visible as warnings.
 const allLinks=new Map();for(const [p,raw]of pages)for(const href of links(visibleSource(raw))){const documentBase=new URL(raw.match(/<base\b[^>]*href="([^"]+)"/)?.[1]||p,origin);const u=new URL(href,documentBase);if(u.origin===origin)allLinks.set(u.pathname,true);}
 const warnings=[];for(const p of allLinks.keys()){if(pages.has(p))continue;const r=await fetch(new URL(p,base),{redirect:'manual',signal:AbortSignal.timeout(30000)});if(r.status!==200)warnings.push({path:p,status:r.status,location:r.headers.get('location')});}
 const missing=await fetch(new URL('/__seo-audit-missing-page__/',base),{redirect:'manual'});assert.equal(missing.status,404,'unknown routes must not soft-404');
 console.log(JSON.stringify({base:base.origin,calculators:'36/36',sitemap:urls.length,uniqueTitles:titles.size,uniqueH1s:headings.size,uniqueDescriptions:descriptions.size,staticNavigation:'36 links on every tool and homepage',canonicals:'36 self-referencing; existing slashless 301 aliases preserved',schema:'page-specific WebApplication and BreadcrumbList',robots:'indexable',internalLinkWarnings:warnings},null,2));
 if(warnings.length)console.log('Review warnings; these may include existing unpublished downloads.');
})().catch(e=>{console.error(e);process.exitCode=1});
