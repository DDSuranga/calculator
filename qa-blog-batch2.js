// Verify article figures independently, then compare the existing calculator implementations.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const articles=require('./content/articles.json');
assert.equal(articles.length,15,'Only the approved 15 articles are allowed');
const bodies=articles.slice(5,10).map(a=>fs.readFileSync(`content/articles/${a.slug}.html`,'utf8'));
const els={};const el=id=>els[id]||={value:'',innerHTML:'',innerText:'',style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){}};
const context={console,Date,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},localStorage:{getItem(){return null;}},setTimeout(){}};
vm.createContext(context);vm.runInContext(fs.readFileSync('script.js','utf8'),context);
let checks=0;
const present=(i,text)=>assert(bodies[i].includes(text),'Missing article example: '+text);
const close=(a,b)=>assert(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const set=values=>Object.entries(values).forEach(([id,v])=>el(id).value=String(v));
const money=n=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
for(const [birth,today,years,months,days]of [
 ['2000-02-29','2024-02-28',23,11,30],['2000-02-29','2024-02-29',24,0,0],
 ['2000-02-29','2025-02-27',24,11,29],['2000-02-29','2025-02-28',25,0,0],['2000-02-29','2025-03-01',25,0,1],
 ['2025-01-31','2025-02-27',0,0,27],['2025-01-31','2025-02-28',0,1,0],['2025-01-31','2025-03-30',0,1,30],['2025-01-31','2025-03-31',0,2,0]
]){
 context.Date=class extends Date{constructor(...args){super(...(args.length?args:[today+'T12:00:00']));}};
 set({birthDateInput:birth});context.calculateAge();assert.equal(el('ageDisplay').value,`${years} year(s), ${months} month(s), ${days} day(s)`);
 present(0,`${years} years, ${months} month${months===1?'':'s'}, ${days} day${days===1?'':'s'}`);checks++;
}
context.Date=Date;
// Independent UTC day counts for the non-obvious remainders.
assert.equal((Date.UTC(2024,1,28)-Date.UTC(2024,0,29))/86400000,30);
assert.equal((Date.UTC(2025,2,30)-Date.UTC(2025,1,28))/86400000,30);
for(const [shape,r,h,expected]of [['cylinder',3,6,54*Math.PI],['sphere',3,0,36*Math.PI],['cone',3,6,18*Math.PI],['cone',3,18,54*Math.PI],['cylinder',3,4,36*Math.PI],['cone',3,12,36*Math.PI]]){
 set({volumeShapeInput:shape,volumeUnitInput:'cm',volumeDimensionOneInput:r,volumeDimensionTwoInput:h,volumeDimensionThreeInput:0});context.calculateVolume();assert(el('volumeDisplay').value.includes(money(expected)));checks++;
}
for(const v of [54*Math.PI,36*Math.PI,18*Math.PI])present(1,money(v)+' cm³');
close((54*Math.PI)/(18*Math.PI),3);close((36*Math.PI)/(18*Math.PI),2);
for(const cents of [4800,6250,12500])for(const rate of [15,18,20]){
 const tipCents=Math.round(cents*rate/100);set({billAmount:cents/100,tipPercent:rate});context.calculateTip();
 assert(el('tipDisplay').value.includes(money(tipCents/100)));assert(el('tipDisplay').value.includes(money((cents+tipCents)/100)));
 present(2,`$${money(tipCents/100)} / $${money((cents+tipCents)/100)}`);checks++;
}
assert.equal(3688*2+3687*2,14750);assert.equal(Math.round(4780*18/100),860);present(2,'$56.40');
// Independently find a payment using bisection on an amortization loop, not the production formula.
function amortize(payment,n){let balance=100000;for(let k=0;k<n;k++)balance=balance*1.01-payment;return balance;}
for(const n of [12,24]){
 let lo=0,hi=100000;for(let k=0;k<100;k++){const mid=(lo+hi)/2;if(amortize(mid,n)>0)lo=mid;else hi=mid;}
 const payment=(lo+hi)/2;close(amortize(payment,n),0);
 set({loanAmountInput:100000,loanInterestInput:12,loanTermInput:n,loanTermType:'months'});context.calculateLoanEmi();
 assert(el('loanEmiDisplay').value.includes(money(payment)));for(const v of [payment,payment*n,payment*n-100000])present(3,'₹'+money(v));
 assert(el('loanEmiResult').innerHTML.includes(money(payment*n-100000)));checks++;
 if(n===12){let b=100000;for(let k=0;k<2;k++){const interest=b*.01,principal=payment-interest;b-=principal;for(const v of [interest,principal,b])present(3,'₹'+money(v));}}
}
for(const n of [12,24]){
 let balance=1000;for(let k=0;k<n;k++)balance=balance*1.005+100;
 set({compoundPrincipalInput:1000,compoundRateInput:6,compoundTimeInput:n,compoundTimeType:'months',compoundFrequencyInput:12,compoundMonthlyContributionInput:100});context.calculateCompoundInterest();
 assert(el('compoundInterestDisplay').value.includes(money(balance)));present(4,money(balance));present(4,money(balance-1000-100*n));checks++;
}
let due=1000;for(let k=0;k<12;k++)due=(due+100)*1.005;present(4,money(due));
present(4,money(1000*1.005**12));present(4,((1.005**12-1)*100).toFixed(4)+'%');
assert.equal(Math.round(1.04*12),12);
set({compoundPrincipalInput:1000,compoundRateInput:0,compoundTimeInput:12,compoundTimeType:'months',compoundFrequencyInput:12,compoundMonthlyContributionInput:100});context.calculateCompoundInterest();assert(el('compoundInterestDisplay').value.includes('2,200.00'));checks++;
for(const i of [3,4])assert(/https:\/\/(www\.consumerfinance\.gov|www\.investor\.gov)\//.test(bodies[i]),'Missing primary financial source');
console.log(`Batch 2 PASS: ${checks} calculator/example scenarios; independent amortization, deposit loops, calendar boundaries, volume ratios, tip rounding and financial references.`);
