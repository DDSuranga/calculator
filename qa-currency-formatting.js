// Repeatable arithmetic and route regression checks; no browser or project state is modified.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),crypto=require('crypto');
const elements={};const store={};let copied='';
function el(id){return elements[id] ||= {id,value:'',innerHTML:'',innerText:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},addEventListener(){}};}
const context={console,Math,Number,Date,parseFloat,parseInt,isNaN,setTimeout,clearTimeout,URLSearchParams,document:{getElementById:el,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:el('body')},window:{addEventListener(){},crypto:crypto.webcrypto,matchMedia:()=>({matches:false})},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},navigator:{clipboard:{writeText:async t=>{copied=t;}}}};
vm.createContext(context);vm.runInContext(fs.readFileSync('script.js','utf8'),context);
const run=code=>vm.runInContext(code,context);let checks=0;
function inputs(values){for(const [id,v]of Object.entries(values))el(id).value=String(v);}
function check(fn,values,id,expected){inputs(values);context[fn]();assert.ok((el(id).value+' '+el(id).innerHTML+' '+el(id).innerText).includes(expected),fn+': '+el(id).value);checks++;}

const neutral=value=>assert.doesNotMatch(String(value),/Rs\.|LKR|INR|[₹$£€]/);
for(const [value,expected] of [[0,'0.00'],[0.125,'0.13'],[4500,'4,500.00'],[5062.5,'5,062.50'],[1234567890.12,'1,234,567,890.12']]){assert.equal(context.formatLoanCurrency(value),expected);checks++;}
for(const [bill,rate,expected] of [[4500,12.5,'Tip: 562.50 | Total: 5,062.50'],[0,0,'Tip: 0.00 | Total: 0.00'],[1.25,20,'Tip: 0.25 | Total: 1.50'],[1000000,10,'Tip: 100,000.00 | Total: 1,100,000.00']]){inputs({billAmount:bill,tipPercent:rate});context.calculateTip();assert.equal(el('tipDisplay').value,expected);neutral(el('tipDisplay').value);checks++;}
for(const [price,rate,expected] of [[4500,12.5,'5,062.50'],[100,0,'100.00'],[1.25,20,'1.50'],[1000000000,10,'1,100,000,000.00']]){const result=run('dynamicToolDefinitions.salesTax.calculate('+JSON.stringify({price,taxRate:rate})+')');assert.ok(JSON.stringify(result).includes(expected));neutral(JSON.stringify(result));checks++;}
assert.throws(()=>run('dynamicToolDefinitions.salesTax.calculate({price:0,taxRate:10})'));
for(const [fn,values,copy] of [
 ['calculateLoanEmi',{loanAmountInput:1200,loanInterestInput:0,loanTermInput:12,loanTermType:'months'},'copyLoanEmiResult'],
 ['calculateMortgage',{homePriceInput:12000,downPaymentInput:0,mortgageInterestInput:0,mortgageTermInput:1,propertyTaxInput:120,homeInsuranceInput:120},'copyMortgageResult'],
 ['calculateCompoundInterest',{compoundPrincipalInput:1000,compoundRateInput:10,compoundTimeInput:2,compoundTimeType:'years',compoundFrequencyInput:1,compoundMonthlyContributionInput:0},'copyCompoundInterestResult'],
 ['calculateDiscount',{discountOriginalPriceInput:100,discountPercentInput:20,discountTaxInput:10},'copyDiscountResult']]){inputs(values);context[fn]();context[copy]();assert.ok(copied.length);neutral(copied);checks++;}
assert.match(context.formatSipCurrency(1000),/₹/);
assert.match(context.formatHomeLoanCurrency(1000,'USD'),/\$/);
assert.match(context.formatHomeLoanCurrency(1000,'INR'),/₹/);
console.log('PASS currency formatting: '+checks+' numeric/display/copy cases; country and selected currencies preserved');
