const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {calculate,shapes}=require('../templates/volume-model');
const {updateEducation}=require('../scripts/render-volume-page');
const article=fs.readFileSync('templates/volume-education.html','utf8').trim();
const page=fs.readFileSync('volume-calculator/index.html','utf8');
test('Nine guide examples agree with independent arithmetic and actual calculator',()=>{
 const examples=[['cube',{a:10},10**3],['rectangular',{l:2,w:3,h:4},24],['cylinder',{r:2,h:3},12*Math.PI],['sphere',{r:2},32*Math.PI/3],['cone',{r:2,h:3},4*Math.PI],['frustum',{R:3,r:1,h:6},26*Math.PI],['ellipsoid',{a:2,b:3,c:4},32*Math.PI],['cap',{R:3,h:1},8*Math.PI/3],['tube',{R:3,r:2,h:5},25*Math.PI]];
 assert.equal(examples.length,shapes.length);
 for(const [shape,values,expected]of examples){const r=calculate(shape,values,Object.fromEntries(Object.keys(values).map(k=>[k,'cm'])),'cm');assert(Math.abs(r.value-expected)<1e-10);assert(article.includes(r.text),shape);}
 assert.equal((2.54**3).toFixed(6),'16.387064');assert.equal((.3048**3).toFixed(12),'0.028316846592');assert.equal((231*2.54**3/1000).toFixed(9),'3.785411784');assert.equal((10/3.785411784).toFixed(5),'2.64172');assert.equal((.6*.4*.3).toFixed(3),'0.072');
});
test('One guide, semantic tables, six FAQs, real internal links and idempotent generation',()=>{
 assert(page.includes(article));assert.equal((page.match(/<h1[\s>]/g)||[]).length,1);
 assert.equal((page.match(/id="volume-education"/g)||[]).length,1);
 for(const obsolete of ['id="calculatorGuide"','class="volume-new-examples"','class="volume-learning"'])assert(!page.includes(obsolete));
 assert.equal((article.match(/<section aria-label="Volume frequently asked questions">([\s\S]*?)<\/section>/)[1].match(/<h3>/g)||[]).length,6);
 assert.equal((article.match(/<caption>/g)||[]).length,2);
 for(const [,href]of article.matchAll(/href="(\/[^"#]+)"/g))assert(fs.existsSync('.'+href+'index.html'),href);
 assert.equal(updateEducation(page),page);assert.throws(()=>updateEducation('<html></html>'),/missing/);
});
