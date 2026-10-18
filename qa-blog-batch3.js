// Batch 3 examples: independent arithmetic plus existing calculator outputs; no network/email writes.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const articles=require('./content/articles.json');assert.equal(articles.length,15);
const bodies=articles.slice(10).map(a=>fs.readFileSync(`content/articles/${a.slug}.html`,'utf8'));
const els={};const el=id=>els[id]||={value:'',innerHTML:'',innerText:'',style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){}};
const ctx={console,Date,document:{getElementById:el,querySelectorAll:()=>[],addEventListener(){}},window:{addEventListener(){}},localStorage:{getItem(){return null;}},setTimeout(){}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('script.js','utf8'),ctx);
const defs=vm.runInContext('dynamicToolDefinitions',ctx);
const close=(a,b)=>assert(Math.abs(a-b)<1e-6,`${a} != ${b}`);
const has=(i,s)=>assert(bodies[i].includes(s),'Article missing verified figure: '+s);
const money=n=>n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const set=o=>Object.entries(o).forEach(([k,v])=>el(k).value=String(v));let checks=0;
// Independent bisection over a 360-month balance recurrence.
const balance=payment=>{let b=240000;for(let k=0;k<360;k++)b=b*1.005-payment;return b;};
let low=0,high=240000;for(let k=0;k<100;k++){const mid=(low+high)/2;if(balance(mid)>0)low=mid;else high=mid;}const payment=(low+high)/2;close(balance(payment),0);
for(const tax of [3600,4800]){set({homePriceInput:300000,downPaymentInput:60000,mortgageInterestInput:6,mortgageTermInput:30,propertyTaxInput:tax,homeInsuranceInput:1200});ctx.calculateMortgage();assert(el('mortgageDisplay').value.includes(money(payment+tax/12+100)));has(0,money(payment+tax/12+100));checks++;}
for(const value of [payment,payment-1200,payment*360,payment*360-240000,payment*360+4800*30,payment*360+4800*30+60000])has(0,money(value));
for(const rate of [0,6,12]){let b=0;for(let k=0;k<12;k++)b=b*(1+rate/1200)+5000;const input={sipMonthly:'5000',sipAnnualRate:String(rate),sipYears:'1'};const result=ctx.calculateSip(input);close(result.futureValue,b);close(result.invested,60000);close(result.returns,b-60000);has(1,money(b));has(1,money(b-60000));has(1,defs.sip.calculate(input).display);checks++;}
let due=0;for(let k=0;k<12;k++)due=(due+5000)*1.01;has(1,money(due));has(1,money(due-due/1.01));has(1,((1.01**12-1)*100).toFixed(4)+'%');
const fraction=ctx.calculateSip({sipMonthly:'5000',sipAnnualRate:'12',sipYears:'1.04'});close(fraction.months,12.48);close(fraction.invested,62400);has(1,'₹62,400');checks++;
const input=(amount,rate='18',mode='add',type='intra')=>({gstAmount:String(amount),gstRate:rate,gstMode:mode,gstTaxType:type});
for(const [value,rate,mode,base,tax,total]of [[1000,'18','add',1000,180,1180],[1180,'18','remove',1000,180,1180],[1000,'5','add',1000,50,1050],[2000,'18','add',2000,360,2360],[999,'18','remove',99900/118,999*18/118,999],[5000,'18','add',5000,900,5900],[5900,'18','remove',5000,900,5900]]){
 for(const type of ['intra','inter']){const v=input(value,rate,mode,type),r=ctx.calculateGst(v);close(r.base,base);close(r.gst,tax);close(r.total,total);const rows=defs.gst.calculate(v).rows;const labels=rows.map(r=>r[0]).join(' ');assert.equal(labels.includes('IGST'),type==='inter');assert.equal(labels.includes('SGST'),type==='intra');if(base===5000&&type==='intra')assert(rows.filter(r=>/CGST|SGST/.test(r[0])).every(r=>r[1].includes('450')));checks++;}
}
for(const s of ['₹212.40','₹967.60','₹410','₹3,410','₹846.61','₹152.39'])has(2,s);
close(1180*.18,212.4);close(1180-212.4,967.6);assert.equal(1000*.05+2000*.18,410);assert.equal(3000+410,3410);
for(const s of ['₹450','₹900','₹5,900','authorised operations','UTGST'])has(3,s);
for(const [weight,result]of [[70,'22.9'],[76.5,'25.0']]){set({bmiWeightInput:weight,bmiWeightUnit:'kg',bmiHeightInput:175,bmiHeightUnit:'cm'});ctx.calculateBmi();assert.equal(el('bmiDisplay').value,result);has(4,result);checks++;}
assert(el('bmiResult').innerHTML.includes('Normal'),'Unrounded BMI category must remain below 25');
for(const [gender,expected]of [['male',1648.75],['female',1482.75]]){const result=defs.bmr.calculate({weight:'70',height:'175',age:'30',gender});assert(result.display.includes(Math.round(expected).toLocaleString('en-US')));has(4,money(expected));checks++;}
const calories=defs.calorie.calculate({weight:'70',height:'175',age:'30',gender:'male',activity:'1.55'});assert(calories.display.includes('2,556'));has(4,'2,555.5625');close(1648.75*1.55,2555.5625);checks++;
for(const target of ['mortgage','sip','gst','bmi','bmr','calorie']){const c=vm.runInContext(`calculatorData.find(c=>c.target===${JSON.stringify(target)})`,ctx);const guide=ctx.getCalculatorGuideHtml(c);assert(guide.includes('/blog/'),'Missing dynamic/static guide link: '+target);checks++;}
for(const [i,pattern]of [[0,/consumerfinance\.gov/],[1,/investor\.sebi\.gov\.in/],[2,/cbic-gst\.gov\.in/],[3,/indiacode\.nic\.in/],[4,/cdc\.gov/]])assert(pattern.test(bodies[i]));
console.log(`Batch 3 PASS: ${checks} calculator/example/link scenarios; independent mortgage repayment, SIP recurrence, GST reversal/splits, BMI boundaries and resting-energy arithmetic.`);
