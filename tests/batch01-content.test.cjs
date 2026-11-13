const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {guides,apply}=require('../scripts/render-batch01-guides');
const harness=require('./roof-pitch-harness.cjs');
test('Exactly ten guides follow navigation order, with one H1, five FAQs, valid schema and links',()=>{
 const home=fs.readFileSync('index.html','utf8');
 const nav=[...home.matchAll(/class="calculator-nav-link" href="[^"]+" data-target="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(nav).size,42);assert.deepEqual(Object.keys(guides),[...new Set(nav)].filter(t=>!['bmi','volume'].includes(t)).slice(0,10));
 const titles=new Set(),descriptions=new Set();
 for(const [target,g]of Object.entries(guides)){
  const html=fs.readFileSync(g.slug+'/index.html','utf8');
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,g.slug);assert.equal((html.match(/id="batch01-guide"/g)||[]).length,1);assert(!html.includes('id="calculatorGuide"'));
  assert(html.includes('https://onlinecalmaster.com/'+g.slug+'/'));
  titles.add(html.match(/<title>(.*?)<\/title>/)[1]);descriptions.add(html.match(/<meta name="description" content="([^"]+)"/)[1]);
  const faq=g.html.match(/<section aria-label="[^"]+ FAQs">([\s\S]*?)<\/section>/)[1];assert.equal((faq.match(/<h3>/g)||[]).length,5);
  for(const [,link]of g.html.matchAll(/href="(\/[^"#]+)"/g))assert(fs.existsSync('.'+link+'index.html'),link);
  for(const [,json]of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))JSON.parse(json);
  assert.equal(apply(html,target),html,'Idempotent source generation');
 }
 assert.equal(titles.size,10);assert.equal(descriptions.size,10);
});
test('All ten calculator examples are checked against the actual implementation',()=>{
 const h=harness(),{context:c,el,inputs,run,dynamic}=h;
 run("display=document.getElementById('display'); displayScientific=document.getElementById('displayScientific')");
 for(const [expr,expected]of [['12+8*2',28],['(12+8)*2',40],['45/5',9],['3**4',81],['Math.sqrt(144)',12],['Math.log10(100)',2],['Math.log10(.01)',-2],['Math.sin(Math.PI/6)',.5]]){el('display').value=expr;c.calculate();assert(Math.abs(Number(el('display').value)-expected)<1e-12,expr)}
 el('display').value='9/0';c.calculate();assert.match(el('display').value,/Undefined/);
 assert.equal(dynamic('gpa',{grade1:4,credits1:3,grade2:3,credits2:4,grade3:2,credits3:2}).display,'3.11');assert.equal(dynamic('gpa',{grade1:0,credits1:3,grade2:4,credits2:3}).display,'2.00');assert.throws(()=>dynamic('gpa',{grade1:'',credits1:3}));
 for(const [marks,expected,grade]of [[45,'90','A'],[39,'78','C'],[0,'0','F']]){const r=dynamic('percentageGrade',{marksScored:marks,totalMarks:50});assert(r.display.startsWith(expected));assert(r.rows.some(row=>row[1]===grade))}assert.throws(()=>dynamic('percentageGrade',{marksScored:51,totalMarks:50}));
 for(const [shape,a,b,d,expected]of [['rectangle',4,3,0,'12.00'],['square',3,0,0,'9.00'],['triangle',6,4,0,'12.00'],['circle',2,0,0,'12.57'],['parallelogram',6,4,0,'24.00'],['trapezoid',3,5,4,'16.00'],['ellipse',3,2,0,'18.85']]){inputs({areaShapeInput:shape,areaUnitInput:'cm',areaDimensionOneInput:a,areaDimensionTwoInput:b,areaDimensionThreeInput:d});c.calculateArea();assert(el('areaDisplay').value.includes(expected),shape)}
 for(const [x,mean,sd,z]of [[85,75,10,1],[65,75,10,-1],[-2,-5,1.5,2]])assert.equal(c.calculateZScoreValues({zRaw:x,zMean:mean,zSD:sd}).z,z);assert.throws(()=>c.calculateZScoreValues({zRaw:1,zMean:0,zSD:0}));
 const roof=c.calculateRoofPitchValues({roofRise:6,roofRun:12,roofUnit:'in'});assert.equal(roof.pitch,6);assert.equal(roof.angle.toFixed(2),'26.57');assert.equal(roof.rafter.toFixed(2),'13.42');assert.throws(()=>c.calculateRoofPitchValues({roofRise:1,roofRun:0,roofUnit:'in'}));
 for(const [value,percent,expected]of [[80,15,'12.00'],[240,7.5,'18.00'],[80,125,'100.00'],[0,20,'0.00']]){inputs({percentValue:value,percentPercent:percent});c.calculatePercentage();assert(el('percentageDisplay').value.includes(expected))}
 inputs({loanAmountInput:500000,loanInterestInput:10,loanTermInput:5,loanTermType:'years'});c.calculateLoanEmi();assert(el('loanEmiDisplay').value.includes('10,623.52'));assert(el('loanEmiResult').innerHTML.includes('137,411.34'));
 inputs({loanAmountInput:12000,loanInterestInput:0,loanTermInput:12,loanTermType:'months'});c.calculateLoanEmi();assert(el('loanEmiDisplay').value.includes('1,000.00'));
 inputs({homePriceInput:300000,downPaymentInput:60000,mortgageInterestInput:6,mortgageTermInput:30,propertyTaxInput:3600,homeInsuranceInput:1200});c.calculateMortgage();assert(el('mortgageDisplay').value.includes('1,838.92'));assert(el('mortgageResult').innerHTML.includes('662,011.65'));
});
