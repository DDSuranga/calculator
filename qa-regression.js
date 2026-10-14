// Repeatable arithmetic and route regression checks; no browser or project state is modified.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const elements={};const store={};let copied='';
function el(id){return elements[id] ||= {id,value:'',innerHTML:'',innerText:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},addEventListener(){}};}
const context={console,Math,Number,Date,parseFloat,parseInt,isNaN,setTimeout,clearTimeout,URLSearchParams,document:{getElementById:el,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:el('body')},window:{addEventListener(){},crypto:crypto.webcrypto,matchMedia:()=>({matches:false})},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},navigator:{clipboard:{writeText:async t=>{copied=t;}}}};
vm.createContext(context);vm.runInContext(fs.readFileSync('script.js','utf8'),context);
const run=code=>vm.runInContext(code,context);let checks=0;
function inputs(values){for(const [id,v]of Object.entries(values))el(id).value=String(v);}
function check(fn,values,id,expected){inputs(values);context[fn]();assert.ok((el(id).value+' '+el(id).innerHTML+' '+el(id).innerText).includes(expected),fn+': '+el(id).value);checks++;}
run("display=document.getElementById('display');displayScientific=document.getElementById('displayScientific')");
for(const [expr,expected]of [['7+8','15'],['2**3','8'],['Math.sqrt(9)','3'],['sqrt(16)','4']]){el('display').value=expr;context.calculate();assert.equal(String(el('display').value),expected);checks++;}
el('display').value='12';context.memoryAdd();el('display').value='2';context.memorySubtract();context.memoryRecall();assert.equal(el('display').value,'10');checks++;
run("activeDisplay='scientific'");el('displayScientific').value='Math.sin(0)+Math.cos(0)';context.calculate();assert.equal(el('displayScientific').value,1);checks++;
check('calculatePercentage',{percentValue:200,percentPercent:15},'percentageDisplay','30.00');
check('calculatePercentageChange',{oldValue:100,newValue:120},'percentageChangeDisplay','20.00%');
for(const [oldValue,newValue,expected] of [[100,80,'-20.00%'],[100,100,'0.00%'],[-100,-50,'-50.00%'],[0,100,'Old value must not be zero.'],[0,0,'Old value must not be zero.'],[-0,-100,'Old value must not be zero.']]){
 check('calculatePercentageChange',{oldValue,newValue},'percentageChangeDisplay',expected);
}
check('calculateTip',{billAmount:100,tipPercent:10},'tipDisplay','$110.00');
check('addVat',{vatValue:100,vatPercent:18},'vatDisplay','118.00');
check('removeVat',{vatValue:118,vatPercent:18},'vatDisplay','100.00');
check('calculateLoanEmi',{loanAmountInput:1200,loanInterestInput:0,loanTermInput:12,loanTermType:'months'},'loanEmiDisplay','100.00');
check('calculateMortgage',{homePriceInput:12000,downPaymentInput:0,mortgageInterestInput:0,mortgageTermInput:1,propertyTaxInput:120,homeInsuranceInput:120},'mortgageDisplay','1,020.00');
check('calculateCompoundInterest',{compoundPrincipalInput:1000,compoundRateInput:10,compoundTimeInput:2,compoundTimeType:'years',compoundFrequencyInput:1,compoundMonthlyContributionInput:0},'compoundInterestDisplay','1,210.00');
check('calculateBmi',{bmiWeightInput:70,bmiWeightUnit:'kg',bmiHeightInput:175,bmiHeightUnit:'cm'},'bmiDisplay','22.9');
check('calculateDiscount',{discountOriginalPriceInput:100,discountPercentInput:20,discountTaxInput:10},'discountDisplay','88.00');
check('calculateFuelCost',{fuelDistanceInput:300,fuelEfficiencyInput:15,fuelPriceInput:450},'fuelCostDisplay','9,000.00');
check('calculateProfitMargin',{profitCostInput:1000,profitSellingInput:1500},'profitMarginDisplay','33.33%');
check('calculateBreakEven',{breakEvenFixedCostInput:10000,breakEvenSellingPriceInput:500,breakEvenVariableCostInput:300},'breakEvenDisplay','50 units');
check('calculateRoi',{roiInvestmentInput:10000,roiFinalValueInput:12500},'roiDisplay','25.00%');
check('calculateSimpleInterest',{simplePrincipalInput:1000,simpleRateInput:10,simpleTimeInput:2},'simpleInterestDisplay','1,200.00');
check('calculateVolume',{volumeShapeInput:'cube',volumeUnitInput:'cm',volumeDimensionOneInput:3},'volumeDisplay','27.00');
check('calculateArea',{areaShapeInput:'triangle',areaUnitInput:'cm',areaDimensionOneInput:4,areaDimensionTwoInput:5},'areaDisplay','10.00');
check('convertUnit',{unitCategory:'temperature',unitFrom:'Celsius',unitTo:'Fahrenheit',unitInput:100},'unitDisplay','212.0000');
check('calculateDateDiff',{date1Input:'2026-01-01',date2Input:'2026-01-11'},'dateDiffDisplay','10 day');
for(const [date1Input,date2Input,expected] of [['','2026-01-01','Please select two valid dates.'],['2026-01-01','','Please select two valid dates.'],['','','Please select two valid dates.'],['not-a-date','2026-01-01','Please select two valid dates.'],['2026-01-01','invalid','Please select two valid dates.'],['2026-02-30','2026-03-01','Please select two valid dates.'],['2026-01-01','2026-13-01','Please select two valid dates.'],['2024-02-28','2024-03-01','2 day(s)'],['2026-01-11','2026-01-01','10 day(s)'],['2026-01-01','2026-01-01','0 day(s)']]){
 check('calculateDateDiff',{date1Input,date2Input},'dateDiffDisplay',expected);
}
check('calculateTimeDiff',{time1Input:'2026-01-01T10:00',time2Input:'2026-01-01T12:30'},'timeDiffFull','02 : 30 : 00');
// Time validation must clear previous totals as well as prevent NaN results.
for(const [time1Input,time2Input] of [
 ['', ''], ['', '2026-10-09T12:30'], ['2026-10-09T10:00', ''],
 ['invalid', '2026-10-09T12:30'], ['2026-10-09T10:00', 'invalid'],
 ['2026-02-30T10:00', '2026-03-01T10:00'], ['2026-13-01T10:00', '2026-10-09T12:30'],
 ['2026-10-09T24:00', '2026-10-10T01:00'], ['2026-10-09T10:60', '2026-10-09T12:30'],
 ['2026-10-09T10:00:60', '2026-10-09T12:30'], ['2026-10-00T10:00', '2026-10-09T12:30'],
 ['2026-02-29T10:00', '2026-03-01T10:00']
]) {
 el('timeDiffMinutes').innerText='old result';el('timeDiffSeconds').innerText='old result';
 check('calculateTimeDiff',{time1Input,time2Input},'timeDiffFull','Please enter two valid dates and times.');
 assert.equal(el('timeDiffMinutes').innerText,'');assert.equal(el('timeDiffSeconds').innerText,'');
}
for(const [time1Input,time2Input,hms,minutes,seconds] of [
 ['2026-10-09T22:45','2026-10-10T01:15','02 : 30 : 00',150,9000],
 ['2026-10-10T01:15','2026-10-09T22:45','02 : 30 : 00',150,9000],
 ['2026-10-09T10:00','2026-10-09T10:00','00 : 00 : 00',0,0],
 ['2026-10-09T10:00','2026-10-11T12:30','50 : 30 : 00',3030,181800],
 ['2026-10-09T10:00:15','2026-10-09T10:01:20','00 : 01 : 05',1,65],
 ['2024-02-29T10:00','2024-02-29T12:30','02 : 30 : 00',150,9000]
]) {
 check('calculateTimeDiff',{time1Input,time2Input},'timeDiffFull',hms);
 assert.equal(el('timeDiffMinutes').innerText,'Total Minutes: '+minutes);
 assert.equal(el('timeDiffSeconds').innerText,'Total Seconds: '+seconds);
}
// Confirm priority calculator validation remains intact.
check('calculateArea',{areaShapeInput:'rectangle',areaUnitInput:'cm',areaDimensionOneInput:-1,areaDimensionTwoInput:5},'areaDisplay','Check inputs');
check('calculateVolume',{volumeShapeInput:'cube',volumeUnitInput:'cm',volumeDimensionOneInput:''},'volumeDisplay','Check inputs');
for(const values of [{targetDate:''},{targetDate:'not-a-date'},{targetDate:'2000-01-01',targetTime:'00:00'}]) {
 context.values=values;assert.throws(()=>run('dynamicToolDefinitions.countdown.calculate(values)'));checks++;
}
for(const target of ['time','date','area','volume','countdown']) {
 context.target=target;
 const calculator=run('getCalculatorByTarget(target)');
 assert.ok(calculator.seoTitle);assert.ok(calculator.metaDescription);
 const related=run('getRelatedCalculators(getCalculatorByTarget(target))');
 assert.equal(related.length,5);assert.equal(new Set(related.map(c=>c.target)).size,5);
 assert.ok(!related.some(c=>['gpa','percentageGrade'].includes(c.target)));
}

// Civil-calendar boundaries, including short months and device-local dates.
const ageCases = [
 ['2000-01-31','2025-03-01','25 year(s), 1 month(s), 1 day(s)'],
 ['2000-01-31','2025-02-28','25 year(s), 1 month(s), 0 day(s)'],
 ['2024-01-31','2024-02-29','0 year(s), 1 month(s), 0 day(s)'],
 ['2000-02-29','2025-02-28','25 year(s), 0 month(s), 0 day(s)'],
 ['2000-02-29','2024-02-28','23 year(s), 11 month(s), 30 day(s)'],
 ['2000-02-29','2024-02-29','24 year(s), 0 month(s), 0 day(s)'],
 ['2025-12-31','2026-01-01','0 year(s), 0 month(s), 1 day(s)'],
 ['2025-04-30','2025-05-31','0 year(s), 1 month(s), 1 day(s)'],
 ['2000-06-15','2025-06-15','25 year(s), 0 month(s), 0 day(s)'],
 ['2026-10-14','2026-10-14','0 year(s), 0 month(s), 0 day(s)'],
 ['2024-03-09','2024-03-11','0 year(s), 0 month(s), 2 day(s)'],
 ['2024-11-02','2024-11-04','0 year(s), 0 month(s), 2 day(s)'],
 ['0099-01-01','0100-01-01','1 year(s), 0 month(s), 0 day(s)']
];
for (const [birth, reference, expected] of ageCases) {
 const [y,m,d] = reference.split('-').map(Number);
 const today = new Date(0); today.setFullYear(y,m-1,d); today.setHours(12,0,0,0);
 context.Date = class extends Date { constructor(...args) { super(...(args.length ? args : [today.getTime()])); } };
 check('calculateAge',{birthDateInput:birth},'ageDisplay',expected);
 assert.ok(!el('ageDisplay').value.includes('NaN'));
 if (birth.slice(5) === reference.slice(5) || (birth.endsWith('02-29') && reference === '2025-02-28')) assert.equal(el('nextBirthdayDisplay').innerText,'Next birthday in 0 days');
}
for (const birth of ['', 'invalid', '2025-02-29', '2024-02-30', '0000-01-01', '2025-13-01']) {
 check('calculateAge',{birthDateInput:birth},'ageDisplay','Please select a valid date.');
 assert.equal(el('nextBirthdayDisplay').innerText,'');
}
check('calculateAge',{birthDateInput:'0100-01-02'},'ageDisplay','Future dates not allowed');
assert.equal(el('nextBirthdayDisplay').innerText,'');
context.Date = Date;

// Restore successful results before the existing copy-result checks.
check('calculateVolume',{volumeShapeInput:'cube',volumeUnitInput:'cm',volumeDimensionOneInput:3},'volumeDisplay','27.00');
check('calculateArea',{areaShapeInput:'triangle',areaUnitInput:'cm',areaDimensionOneInput:4,areaDimensionTwoInput:5},'areaDisplay','10.00');
check('calculateAge',{birthDateInput:'2000-01-01'},'ageDisplay','year(s)');
const dynamicCases=[['savings',{currentBalance:100,monthlyDeposit:10,annualRate:0,years:1},'220.00'],['salary',{payAmount:100,payType:'hourly',hoursPerWeek:40,weeksPerYear:52},'208,000.00'],['salesTax',{price:100,taxRate:10},'110.00'],['bmr',{gender:'male',weight:70,height:175,age:30},'1,649'],['waterIntake',{weight:70,activityMinutes:30},'2.80'],['calorie',{gender:'male',weight:70,height:175,age:30,activity:1.2},'1,979'],['gpa',{grade1:4,credits1:3,grade2:3,credits2:3},'3.50'],['percentageGrade',{marksScored:45,totalMarks:50},'90.00%'],['countdown',{targetDate:'2030-01-01',targetTime:'12:00'},'days'],['timeZoneDifference',{fromOffset:5.5,toOffset:0},'5h 30m behind'],['jsonFormatter',{jsonInput:'{"a":1}'},'Valid JSON']];
for(const [tool,values,expected]of dynamicCases){context.values=values;assert.ok(run(`dynamicToolDefinitions.${tool}.calculate(values).display`).includes(expected),tool);checks++;}
context.values={length:16,lowercase:true,uppercase:true,numbers:true,symbols:true};assert.equal(run('dynamicToolDefinitions.passwordGenerator.calculate(values).display').length,16);checks++;
assert.match(run('dynamicToolDefinitions.uuidGenerator.calculate().display'),/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);checks++;
const data=run('calculatorData');assert.equal(data.length,38);
for(const c of data){const html=fs.readFileSync(c.slug+'/index.html','utf8');assert.ok(html.includes('<base href="/">'));assert.ok(html.includes(`rel="canonical" href="https://onlinecalmaster.com/${c.slug}/"`));assert.ok(html.includes('src="script.js"'));assert.ok(fs.readFileSync('sitemap.xml','utf8').includes(`/${c.slug}/</loc>`));}
console.log(`${checks} calculation/control checks passed; all 38 generated routes and sitemap entries verified.`);
(async()=>{
 for(const [fn,expected] of [['copyLoanEmiResult','Monthly EMI'],['copyMortgageResult','Monthly Payment'],['copyCompoundInterestResult','Future Value'],['copyBmiResult','BMI'],['copyDiscountResult','Final Price'],['copyVolumeResult','Volume'],['copyAreaResult','Area']]){copied='';context[fn]();await Promise.resolve();assert.ok(copied.includes(expected),fn);}
 context.clearLoanEmi();assert.equal(el('loanAmountInput').value,'');
 context.clearDisplay();assert.equal(el('displayScientific').value,'');
 console.log('Seven result-copy handlers and clear controls passed.');
})();
