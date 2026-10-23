// Read-only content, HTTP and preservation checks. Optional baseline is a full backup directory.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const articles=require('./content/articles.json');
const base=new URL(process.argv[2]||'http://127.0.0.1:5501');
const backup=process.argv[3];
const origin='https://onlinecalmaster.com';
const source=fs.readFileSync('script.js','utf8');
const normal=s=>s.replace(/\r\n/g,'\n').replace(/^\uFEFF/,'');
const read=p=>fs.readFileSync(p,'utf8');
const bodies=new Map(articles.map(a=>[a.slug,read(`content/articles/${a.slug}.html`)]));
const has=(slug,s)=>assert(bodies.get(slug).includes(s),`${slug}: missing verified example ${s}`);
const age=articles[0].slug,volume=articles[1].slug,tip=articles[2].slug,percent=articles[3].slug,dates=articles[4].slug;
// Independent expected arithmetic, with assertions against the actual published example text.
assert.equal((Date.UTC(2025,5,10)-Date.UTC(2025,4,15))/86400000,26);has(age,'24 years, 11 months, 26 days');has(age,'25 years, 2 months, 5 days');
const elements={};const el=id=>elements[id]||={value:'',innerText:'',innerHTML:'',style:{},addEventListener(){},classList:{add(){},remove(){}}};
const context={console,Date,document:{addEventListener(){},getElementById:el,querySelectorAll:()=>[]},window:{addEventListener(){}},setTimeout(){},localStorage:{getItem(){return null;}}};
vm.createContext(context);vm.runInContext(source,context);
for(const [date,expected] of [['2025-06-10','24 year(s), 11 month(s), 26 day(s)'],['2025-08-20','25 year(s), 2 month(s), 5 day(s)']]){
 const now=new Date(date+'T12:00:00');context.Date=class extends Date{constructor(...args){super(...(args.length?args:[now.getTime()]));}};
 el('birthDateInput').value='2000-06-15';context.calculateAge();assert.equal(el('ageDisplay').value,expected);
}
context.Date=Date;
for(const [value,expected] of [[40*25*20,20000],[5**3,125],[Math.PI*9*10,282.74],[4*Math.PI*27/3,113.10],[Math.PI*9*10/3,94.25]])assert.equal(Number(value.toFixed(2)),expected);
for(const text of ['20,000 cm³','125 cm³','282.74 cm³','113.10 cm³','94.25 cm³'])has(volume,text);
assert.equal(4800*18/100,864);has(tip,'$8.64');assert.equal(5184+864,6048);has(tip,'$60.48');assert.equal(Math.round(5184*18/100)+5184,6117);has(tip,'$61.17');
el('billAmount').value='48';el('tipPercent').value='18';context.calculateTip();assert(el('tipDisplay').value.includes('56.64'));
assert.equal(Math.round(3750*15/100),563);has(tip,'$5.63');
for(const [old,value,expected] of [[80,100,25],[100,80,-20],[100,120,20],[120,96,-20],[100,96,-4],[5,6,20],[-100,-50,-50]]){
 assert.equal((value-old)/old*100,expected);el('oldValue').value=String(old);el('newValue').value=String(value);context.calculatePercentageChange();assert(el('percentageChangeDisplay').value.includes(expected.toFixed(2)+'%'));
}
for(const text of ['25%','−20%','−4% overall','1 percentage point','−50%'])has(percent,text);
for(const [start,end,expected] of [['2025-03-01','2025-03-03',2],['2025-03-03','2025-03-03',0],['2025-03-03','2025-03-01',2],['2024-02-28','2024-03-01',2],['2025-02-28','2025-03-01',1]]){
 assert.equal(Math.abs(Date.parse(end)-Date.parse(start))/86400000,expected);el('date1Input').value=start;el('date2Input').value=end;context.calculateDateDiff();assert.equal(el('dateDiffDisplay').value,`${expected} day(s)`);
}
has(dates,'<td>0 days</td><td>1 date</td>');has(dates,'<td>2 days</td><td>3 dates</td>');
async function get(p){const r=await fetch(new URL(p,base),{redirect:'manual'});assert.equal(r.status,200,p);assert(!/noindex/i.test(r.headers.get('x-robots-tag')||''));return r.text();}
(async()=>{
 const sitemap=await get('/sitemap.xml');const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(sitemapUrls.length,60);
 const titles=new Set(),descriptions=new Set();const pages=new Map();
 for(const route of ['/blog/',...articles.map(a=>`/blog/${a.slug}/`)]){
  const html=await get(route);pages.set(route,html);assert(sitemapUrls.includes(origin+route));assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert(!/<meta[^>]+noindex/i.test(html));
  assert.equal(html.match(/rel="canonical" href="([^"]+)"/)[1],origin+route);
  const title=html.match(/<title>([^<]+)<\/title>/)[1],desc=html.match(/name="description" content="([^"]+)"/)[1];assert(!titles.has(title));assert(!descriptions.has(desc));titles.add(title);descriptions.add(desc);
  const schemas=JSON.parse(html.match(/<script type="application\/ld\+json">([^]*?)<\/script>/)[1]);assert.equal(schemas[0]['@type'],route==='/blog/'?'CollectionPage':'Article');assert.equal(schemas[0].url,origin+route);assert.equal(schemas[1].itemListElement.at(-1).item,origin+route);
  assert(!html.includes('src="/script.js"'));assert(!/\{\{[A-Z_]+\}\}/.test(html));
  assert.equal((html.match(/adsbygoogle\.js/g)||[]).length,1);assert(html.includes('ca-pub-4953018177794421'));assert(html.includes('G-2F25VNZYGT'));assert(html.includes('GTM-WSQH8DCC'));
  const noSlash=await fetch(new URL(route.slice(0,-1),base),{redirect:'manual'});assert.equal(noSlash.status,301);assert.equal(noSlash.headers.get('location'),route);
 }
 const checked=new Set();
 for(const [route,html] of pages){
  for(const [,href]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const u=new URL(href,new URL(route,base));if(u.origin!==base.origin)continue;
   if(!checked.has(u.pathname)){await get(u.pathname);checked.add(u.pathname);}
   if(u.hash){const target=pages.get(u.pathname)||await get(u.pathname);assert(target.includes(`id="${u.hash.slice(1)}"`),href+' missing anchor');}
  }
 }
 for(const a of articles){const calc=await get('/'+a.calculator+'/');assert(calc.includes('/blog/'+a.slug+'/'));assert(pages.get('/blog/'+a.slug+'/').includes('/'+a.calculator+'/'));}
 if(backup){
  const previous=read(path.join(backup,'script.js'));
  const strip=s=>normal(s).replace(/function getCalculatorReadingHtml\(calculator\) \{[\s\S]*?\n\}\n/,'').replace(/function getCalculatorGuideHtml\(calculator\) \{[\s\S]*?\n\}/,'').replace("\n guide.insertAdjacentHTML('beforeend', getCalculatorReadingHtml(calculator));",'');
  assert.equal(strip(source),strip(previous),'Calculator logic changed outside guide presentation');
  for(const file of ['ads.txt','robots.txt','manifest.json','styles.css','about.html','contact.html','privacy-policy.html','CNAME','b29d22c720714300a8b5dd23f580be47.txt'])assert.equal(normal(read(file)),normal(read(path.join(backup,file))),file+' changed');
  const oldSitemap=read(path.join(backup,'sitemap.xml'));for(const [,url]of oldSitemap.matchAll(/<loc>([^<]+)<\/loc>/g))assert(sitemapUrls.includes(url),'lost URL '+url);
  const integrationBlocks=h=>[...h.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)].map(m=>m[0]).filter(s=>/adsbygoogle|googletagmanager|gtag\('config'/.test(s)).map(normal);
  const existingPaths=[...oldSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]).pathname);
  for(const p of existingPaths){const f=p==='/'?'index.html':p.endsWith('/')?p.slice(1)+'index.html':p.slice(1);const old=read(path.join(backup,f)),now=read(f);assert.deepEqual(integrationBlocks(now),integrationBlocks(old),f+' integration changed');for(const pattern of [/<title>[\s\S]*?<\/title>/,/<meta name="description"[^>]*>/,/<link rel="canonical"[^>]*>/])assert.equal(now.match(pattern)?.[0],old.match(pattern)?.[0],f+' metadata changed');}
  console.log(`Baseline preserved: calculator logic, ${existingPaths.length} URLs, existing titles/descriptions/canonicals, ad/analytics loaders, trust pages, robots/ads/manifest/styles/IndexNow.`);
 }
 console.log(`Blog PASS: Batch 1 examples, 16 direct routes, 60 sitemap URLs, schemas, reciprocal links and ${checked.size} linked local resources.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
