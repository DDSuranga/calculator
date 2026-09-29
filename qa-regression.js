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
check('calculateAge',{birthDateInput:'2000-01-01'},'ageDisplay','year(s)');
const dynamicCases=[['savings',{currentBalance:100,monthlyDeposit:10,annualRate:0,years:1},'220.00'],['salary',{payAmount:100,payType:'hourly',hoursPerWeek:40,weeksPerYear:52},'208,000.00'],['salesTax',{price:100,taxRate:10},'110.00'],['bmr',{gender:'male',weight:70,height:175,age:30},'1,649'],['waterIntake',{weight:70,activityMinutes:30},'2.80'],['calorie',{gender:'male',weight:70,height:175,age:30,activity:1.2},'1,979'],['gpa',{grade1:4,credits1:3,grade2:3,credits2:3},'3.50'],['percentageGrade',{marksScored:45,totalMarks:50},'90.00%'],['countdown',{targetDate:'2030-01-01',targetTime:'12:00'},'days'],['timeZoneDifference',{fromOffset:5.5,toOffset:0},'5h 30m behind'],['jsonFormatter',{jsonInput:'{"a":1}'},'Valid JSON']];
for(const [tool,values,expected]of dynamicCases){context.values=values;assert.ok(run(`dynamicToolDefinitions.${tool}.calculate(values).display`).includes(expected),tool);checks++;}
context.values={length:16,lowercase:true,uppercase:true,numbers:true,symbols:true};assert.equal(run('dynamicToolDefinitions.passwordGenerator.calculate(values).display').length,16);checks++;
assert.match(run('dynamicToolDefinitions.uuidGenerator.calculate().display'),/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);checks++;
const data=run('calculatorData');assert.equal(data.length,37);
for(const c of data){const html=fs.readFileSync(c.slug+'/index.html','utf8');assert.ok(html.includes('<base href="/">'));assert.ok(html.includes(`rel="canonical" href="https://onlinecalmaster.com/${c.slug}/"`));assert.ok(html.includes('src="script.js"'));assert.ok(fs.readFileSync('sitemap.xml','utf8').includes(`/${c.slug}/</loc>`));}
console.log(`${checks} calculation/control checks passed; all 37 generated routes and sitemap entries verified.`);
(async()=>{
 for(const [fn,expected] of [['copyLoanEmiResult','Monthly EMI'],['copyMortgageResult','Monthly Payment'],['copyCompoundInterestResult','Future Value'],['copyBmiResult','BMI'],['copyDiscountResult','Final Price'],['copyVolumeResult','Volume'],['copyAreaResult','Area']]){copied='';context[fn]();await Promise.resolve();assert.ok(copied.includes(expected),fn);}
 context.clearLoanEmi();assert.equal(el('loanAmountInput').value,'');
 context.clearDisplay();assert.equal(el('displayScientific').value,'');
 console.log('Seven result-copy handlers and clear controls passed.');
})();
