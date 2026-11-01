const test = require('node:test');
const assert = require('node:assert/strict');
const harness = require('./roof-pitch-harness.cjs');
const h = harness();
const defaults = Object.fromEntries(h.run('dynamicToolDefinitions.etsyFee.fields').map(f => [f.id, f.type === 'checkbox' ? false : (f.value || '')]));
const example = {...defaults, etsyPrice:'30',etsyQuantity:'2',etsyUnitCost:'10',etsyShipping:'5',etsyShippingCost:'4',etsyWrap:'3',etsyWrapCost:'1',etsyTax:'5.44'};
const calc = changes => h.dynamic('etsyFee',{...example,...changes});

test('independent worked example: revenue, taxable payment, individually rounded fees and profit', () => {
    // Hand calculation: 30*2+5+3=68; 68+5.44=73.44.
    // .20+.20 +68*.065 +round(73.44*.03+.25,2)=7.27. Costs=10*2+4+1=25.
    assert.deepEqual(JSON.parse(JSON.stringify(calc().cents)), {revenue:6800,payment:7344,tax:544,originalListing:20,additionalListing:20,renewal:0,transaction:442,processing:245,offsite:0,conversion:0,fees:727,costs:2500,profit:3573});
    assert.equal(calc().rows[4][1],'52.54%');assert.equal(calc().rows[5][1],'10.69%');
});
test('listing allocation, multiple quantities, renewal, and exclusions never double original fee', () => {
    assert.equal(calc({etsyQuantity:'1'}).cents.additionalListing,0);
    assert.equal(calc({etsyQuantity:'10'}).cents.additionalListing,180);
    const r=calc({etsyListingMode:'incremental',etsyRenew:true}).cents;
    assert.equal(r.originalListing,0);assert.equal(r.additionalListing,20);assert.equal(r.renewal,20);
    assert.equal(calc({etsyListingMode:'none'}).cents.fees,687);
    assert.throws(()=>calc({etsyListingMode:'none',etsyRenew:true}),/renewal/);
});
test('Offsite Ads tiers and exact $100 per-order cap', () => {
    assert.equal(calc({etsyOffsite:'15'}).cents.offsite,1020);
    assert.equal(calc({etsyOffsite:'15'}).cents.profit,2553);
    assert.equal(calc({etsyOffsite:'12'}).cents.offsite,816);
    for(const etsyOffsite of ['12','15'])assert.equal(calc({etsyPrice:'2000',etsyOffsite}).cents.offsite,10000);
    assert.equal(calc({etsyOffsite:'15',etsyOffsite15:'0'}).cents.offsite,0);
});
test('tax is never revenue; affects processing only; conversion optional on revenue', () => {
    const a=calc().cents,b=calc({etsyTax:'105.44'}).cents;
    assert.equal(a.revenue,b.revenue);assert.equal(b.processing-a.processing,300);
    assert.equal(a.transaction,b.transaction);assert.equal(a.profit-b.profit,300);
    assert.equal(calc({etsyConversion:true}).cents.conversion,170);
    assert.equal(calc({etsyConversion:true,etsyTax:'1000'}).cents.conversion,170);
});
test('half-cent rounding, decimal prices and editable zero fees', () => {
    const small={...defaults,etsyPrice:'0.50',etsyListingMode:'none',etsyProcessingFixed:'0',etsyProcessingRate:'0',etsyTransactionRate:'1'};
    assert.equal(h.dynamic('etsyFee',small).cents.transaction,1); // $0.005 => $0.01
    assert.equal(h.dynamic('etsyFee',{...small,etsyPrice:'0.29',etsyTransactionRate:'100'}).cents.transaction,29);
    assert.equal(h.dynamic('etsyFee',{...small,etsyTransactionRate:'0'}).cents.fees,0);
    assert.equal(calc({etsyPrice:'19.99',etsyQuantity:'3'}).cents.revenue,6797);
});
test('invalid, empty, excessive and fractional quantities/rates rejected', () => {
    for(const [field,values] of Object.entries({etsyPrice:['','-1','NaN','Infinity','1e20','0.001','1000000001'],etsyQuantity:['','0','-1','1.5','1000001'],etsyTransactionRate:['','-1','101','1.23456'],etsyListingMode:[''],etsyOffsite:['bad']}))
        for(const value of values)assert.throws(()=>calc({[field]:value}),field+': '+value);
    assert.throws(()=>calc({etsyPrice:'1000000000',etsyQuantity:'1000000'}),/trillion/);
    assert.throws(()=>calc({etsyListingRate:'1000000000',etsyQuantity:'1000000',etsyPrice:'0',etsyUnitCost:'0'}),/fees exceed/);
});
test('zero revenue, losses and realistic large orders produce no nonfinite output', () => {
    const zero={...defaults,etsyPrice:'0'};const r=h.dynamic('etsyFee',zero);
    assert.equal(r.cents.profit,-45);assert.equal(r.rows[4][1],'N/A — zero revenue');
    assert(!/Infinity|NaN/.test(r.copyText));
    assert(calc({etsyUnitCost:'100'}).cents.profit<0);
    assert(calc({etsyPrice:'1000000',etsyQuantity:'1000'}).cents.profit>0);
});
test('Copy gated until result; invalid result clears stale copy; Clear restores defaults', () => {
    h.run("activeDisplay='etsyFee';renderDynamicTool(getCalculatorByTarget('etsyFee'))");
    // Harness does not parse HTML attributes. Rendering must contain a disabled Copy control.
    assert.match(h.el('dynamicToolForm').innerHTML,/id="etsyFeeCopy" disabled/);
    h.context.result=calc();h.run('renderDynamicResult(result)');assert.equal(h.el('etsyFeeCopy').disabled,false);
    assert.match(h.run('latestDynamicToolCopyText'),/Estimated net profit: \$35.73/);
    h.run("showDynamicMessage('Check inputs',true)");assert.equal(h.el('etsyFeeCopy').disabled,true);assert.equal(h.run('latestDynamicToolCopyText'),'');
    h.run('clearDynamicTool()');assert.match(h.el('dynamicToolForm').innerHTML,/id="etsyFeeCopy" disabled/);
});
