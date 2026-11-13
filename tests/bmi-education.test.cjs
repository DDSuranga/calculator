const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {calculate}=require('../templates/bmi-model');
const {updateEducation}=require('../scripts/render-bmi-page');
const article=fs.readFileSync('templates/bmi-education.html','utf8').trim();
const page=fs.readFileSync('bmi-calculator/index.html','utf8');
test('BMI article examples agree with independent arithmetic and calculator results',()=>{
 const metric=70/(1.75*1.75),imperial=(160*0.45359237)/((69*0.0254)**2);
 assert.equal(metric.toFixed(2),'22.86');assert.equal(imperial.toFixed(2),'23.63');
 assert.equal(calculate({age:35,height:175,weight:70}).bmi.toFixed(2),'22.86');
 assert.equal(calculate({age:35,height:69,heightUnit:'in',weight:160,weightUnit:'lb'}).bmi.toFixed(2),'23.63');
 assert.equal((70/1.75**3).toFixed(2),'13.06');
 assert.equal((18.5*1.75**2).toFixed(2),'56.66');assert.equal((25*1.75**2).toFixed(2),'76.56');
 for(const text of ['22.86 kg/m²','23.63 kg/m²','13.06 kg/m³','56.66–&lt;76.56 kg'])assert(article.includes(text));
});
test('BMI has one persistent article, five FAQs, no legacy explanations and one H1',()=>{
 assert(page.includes(article));assert.equal((page.match(/id="bmi-education"/g)||[]).length,1);
 assert.equal((page.match(/<h1[\s>]/g)||[]).length,1);
 assert.equal((article.match(/<section aria-label="BMI frequently asked questions">([\s\S]*?)<\/section>/)[1].match(/<h3>/g)||[]).length,5);
 assert(!page.includes('shown as 22.9'));assert(!page.includes('id="calculatorGuide"'));
 assert(!page.includes('aria-label="BMI Calculator help"'));assert.equal(updateEducation(page),page);
});
test('BMI source updater rejects an unexpected page instead of editing it',()=>{
 assert.throws(()=>updateEducation('<html>Unexpected page</html>'),/missing/);
});
