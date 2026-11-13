const test = require('node:test');
const assert = require('node:assert/strict');
const {calculate, shapes} = require('../templates/volume-model');
const fs = require('node:fs'), cp = require('node:child_process');
const calc = (id, values, unit='cm') => calculate(id, values, Object.fromEntries(Object.keys(values).map(k=>[k,unit])),unit);
const near = (actual, expected) => assert(Math.abs(actual-expected)<=Math.max(1e-12,Math.abs(expected)*1e-12),`${actual} != ${expected}`);
const examples = [
    ['cube',{a:2},8], ['rectangular',{l:2,w:3,h:4},24],
    ['cylinder',{r:2,h:3},37.69911184307752], ['sphere',{r:2},33.510321638291124],
    ['cone',{r:2,h:3},12.566370614359172], ['frustum',{r:1,R:3,h:6},81.68140899333463],
    ['ellipsoid',{a:2,b:3,c:4},100.53096491487338], ['cap',{R:3,h:1},8.377580409572781],
    ['tube',{R:3,r:2,h:5},78.53981633974483]
];
for(const [shape, values, expected] of examples) {
    test(`${shape}: independent example, four same-unit cases and cubic conversion`,()=>{
        for(const unit of ['cm','m','in','ft']) near(calc(shape,values,unit).value,expected);
        near(calculate(shape,values,Object.fromEntries(Object.keys(values).map(k=>[k,'m'])),'cm').value,expected*1e6);
    });
    test(`${shape}: each field rejects empty, zero, negative and nonfinite input`,()=>{
        for(const key of Object.keys(values)) for(const bad of ['', ' ',0,-1,'abc','12abc',Infinity,NaN]) assert.throws(()=>calc(shape,{...values,[key]:bad}));
    });
}
test('Mixed units convert lengths before multiplication, including inch/foot equivalence',()=>{
    near(calculate('rectangular',{l:1,w:100,h:100},{l:'m',w:'cm',h:'cm'},'m').value,1);
    near(calculate('rectangular',{l:12,w:1,h:30.48},{l:'in',w:'ft',h:'cm'},'ft').value,1);
    near(calculate('cube',{a:1},{a:'in'},'cm').value,16.387064);
});
test('Geometric boundary checks and identities',()=>{
    assert.throws(()=>calc('cap',{R:3,h:6.01}),/twice/);
    near(calc('cap',{R:3,h:6}).value,calc('sphere',{r:3}).value);
    near(calc('cap',{R:3,h:3}).value,calc('sphere',{r:3}).value/2);
    assert.throws(()=>calc('tube',{R:2,r:2,h:1}),/smaller/);
    assert.throws(()=>calc('tube',{R:2,r:3,h:1}),/smaller/);
    near(calc('frustum',{r:2,R:2,h:3}).value,calc('cylinder',{r:2,h:3}).value);
    near(calc('ellipsoid',{a:2,b:2,c:2}).value,calc('sphere',{r:2}).value);
});
test('Scientific display, extreme inputs and invalid units are safe',()=>{
    assert.equal(calc('cube',{a:.01}).text,'1e-6 cm³');
    assert.equal(calc('cube',{a:1000}).text,'1,000,000,000.00 cm³');
    for(const shape of shapes) for(const value of [1e150,1e-200]) {
        const values=Object.fromEntries(shape.fields.map(([k])=>[k,value]));
        assert.throws(()=>calc(shape.id,values));
    }
    assert.throws(()=>calculate('cube',{a:2},{a:'yards'},'cm'));
    assert.throws(()=>calculate('cube',{a:2},{a:'cm'},'__proto__'));
});
test('SEO, schema, integrations and links remain preserved with the consolidated guide',()=>{
    const before=fs.readFileSync('tests/fixtures/volume-production-base.html','utf8').replace(/\r\n/g,'\n');
    const after=fs.readFileSync('volume-calculator/index.html','utf8').replace(/\r\n/g,'\n');
    for(const pattern of [/<title>[\s\S]*?<\/title>/g,/<meta\b[^>]*>/g,/<link rel="canonical"[^>]*>/g,/<h1>[\s\S]*?<\/h1>/g,/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,/<script[^>]*src=[^>]*>/g]) assert.deepEqual(after.match(pattern),before.match(pattern));
    const inline = [...before.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[0]);
    inline.forEach(block=>assert(after.includes(block),'Existing integration/script changed'));
    for(const [,href]of before.matchAll(/href="([^"]*)"/g)) assert(after.includes(`href="${href}"`),href);
    assert.equal((after.match(/class="volume-shape-form /g)||[]).length,9);
    assert(after.includes('id="volume-education"'));
    const rendered=require('../scripts/render-volume-page').render(before).replace(/\r\n/g,'\n').replace(/[ \t]+$/gm,'').trimEnd()+'\n';
    assert.equal(after,rendered,'Generated page must match source renderer');
});
