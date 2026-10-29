const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const harness=require('./roof-pitch-harness.cjs');
const h=harness(),calc=(rise,run,unit='in')=>h.context.calculateRoofPitchValues({roofRise:rise,roofRun:run,roofUnit:unit});
const near=(a,b)=>assert(Math.abs(a-b)<=Math.max(1e-12,Math.abs(b)*1e-12),`${a} != ${b}`);
test('Roof pitch: known right triangles, decimal values and flat slope',()=>{
 for(const [rise,run,pitch,angle,percent,length]of [[6,12,6,26.56505117707799,50,Math.sqrt(180)],[3,4,9,36.86989764584402,75,5],[1,1,12,45,100,Math.SQRT2],[0,12,0,0,0,12],[1.5,2,9,36.86989764584402,75,2.5]]){
  const r=calc(rise,run);near(r.pitch,pitch);near(r.angle,angle);near(r.percent,percent);near(r.rafter,length);
 }
});
test('All four units describe the same geometry and return length in selected units',()=>{
 for(const [unit,rise,run,factor]of [['in',6,12,.0254],['ft',.5,1,.3048],['cm',15.24,30.48,.01],['m',.1524,.3048,1]]){
  const r=calc(rise,run,unit);near(r.pitch,6);near(r.rafter*factor,Math.sqrt(.1524**2+.3048**2));assert.equal(r.unit,unit);
 }
});
test('Empty, negative, malformed, non-finite and invalid-unit inputs are rejected',()=>{
 for(const invalid of ['', ' ',undefined,null,'abc','1x','0x10',NaN,Infinity,-Infinity,-1]){
  assert.throws(()=>calc(invalid,12));assert.throws(()=>calc(6,invalid));
 }
 assert.throws(()=>calc(6,0),/run must be greater/);
 for(const unit of ['',undefined,'mm','__proto__','constructor'])assert.throws(()=>h.context.calculateRoofPitchValues({roofRise:6,roofRun:12,roofUnit:unit}),/Select/);
});
test('Large and small finite measurements retain useful results; overflow and underflow reject',()=>{
 for(const scale of [1e-100,1e100]){const r=calc(3*scale,4*scale,'m');near(r.pitch,9);near(r.rafter/scale,5);}
 for(const [rise,run,unit]of [[1e308,1e-308,'m'],[1e-308,1e308,'m'],[1e308,1e308,'m'],[5e-324,1,'in']]){
  if(rise===run){assert(Number.isFinite(calc(rise,run,unit).rafter));continue;}
  assert.throws(()=>calc(rise,run,unit),/supported numerical range/);
 }
});
test('Result breakdown, Copy and invalid-result clearing use the existing workflow',async()=>{
 h.run("activeDisplay='roofPitch'");h.inputs({'dynamic-roofRise':6,'dynamic-roofRun':12,'dynamic-roofUnit':'in'});h.context.calculateDynamicTool();
 assert.equal(h.el('dynamicToolDisplay').value,'6:12');assert.match(h.el('dynamicToolResult').innerHTML,/26.57/);
 h.context.copyDynamicToolResult();await Promise.resolve();assert.match(h.copied(),/Roof Pitch: 6:12/);assert.match(h.copied(),/Rafter Length.*13.42 in/);
 h.inputs({'dynamic-roofRun':0});h.context.calculateDynamicTool();assert.equal(h.el('dynamicToolDisplay').value,'Check inputs');assert.equal(h.run('latestDynamicToolCopyText'),'');
});
test('Static route, canonical, schema, FAQ, sitemap and reciprocal links',()=>{
 const html=fs.readFileSync('roof-pitch-calculator/index.html','utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.match(html,/rel="canonical" href="https:\/\/onlinecalmaster.com\/roof-pitch-calculator\/"/);
 assert.match(html,/Roof Pitch Calculator/);assert.match(html,/Roof Run \(horizontal\)/);assert.match(html,/overhangs/);
 for(const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))JSON.parse(m[1]);
 assert.match(html,/WebApplication/);assert.match(html,/BreadcrumbList/);assert.doesNotMatch(html,/<meta name="robots" content="[^"]*noindex/);
 for(const file of ['index.html','area-calculator/index.html','sitemap.xml'])assert(fs.readFileSync(file,'utf8').includes('/roof-pitch-calculator/'));
});
