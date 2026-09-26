const fs = require('fs');
const vm = require('vm');

const elements = {};
function element(id) {
  if (!elements[id]) {
    elements[id] = {
      id,
      value: '',
      innerHTML: '',
      textContent: '',
      classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
      style: {},
      addEventListener() {}
    };
  }
  return elements[id];
}

const context = {
  console,
  Math,
  Number,
  parseFloat,
  parseInt,
  isNaN,
  document: {
    getElementById: element,
    querySelectorAll: () => [],
    querySelector: () => null,
    addEventListener() {},
    body: element('body'),
    documentElement: { classList: { contains: () => false } }
  },
  window: {
    addEventListener() {},
    matchMedia: () => ({ matches: false })
  },
  localStorage: {
    getItem: () => null,
    setItem() {}
  },
  navigator: {}
};

vm.createContext(context);
vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);

function setValues(values) {
  Object.entries(values).forEach(([id, value]) => {
    element(id).value = String(value);
  });
}

function assertContains(id, text) {
  const target = element(id).value + ' ' + element(id).innerHTML;
  if (!target.includes(text)) {
    throw new Error(`${id} did not contain expected text: ${text}`);
  }
}

const registrations = vm.runInContext(`[
  getCalculatorByTarget('fuelCost')?.category,
  getCalculatorByTarget('profitMargin')?.category,
  getCalculatorByTarget('breakEven')?.category,
  getCalculatorByTarget('roi')?.category,
  getCalculatorByTarget('simpleInterest')?.category
]`, context);

if (registrations.join('|') !== 'Finance|Business|Business|Finance|Finance') {
  throw new Error(`Unexpected category registration: ${registrations.join('|')}`);
}

setValues({ fuelDistanceInput: 300, fuelEfficiencyInput: 15, fuelPriceInput: 450 });
context.calculateFuelCost();
assertContains('fuelCostDisplay', 'Rs. 9,000.00');
assertContains('fuelCostResult', '20.00 liters');

setValues({ profitCostInput: 1000, profitSellingInput: 1500 });
context.calculateProfitMargin();
assertContains('profitMarginDisplay', '33.33%');
assertContains('profitMarginResult', 'Rs. 500.00');

setValues({ breakEvenFixedCostInput: 10000, breakEvenSellingPriceInput: 500, breakEvenVariableCostInput: 300 });
context.calculateBreakEven();
assertContains('breakEvenDisplay', '50 units');
assertContains('breakEvenResult', 'Rs. 25,000.00');

setValues({ roiInvestmentInput: 10000, roiFinalValueInput: 12500 });
context.calculateRoi();
assertContains('roiDisplay', '25.00%');
assertContains('roiResult', 'Rs. 2,500.00');

setValues({ simplePrincipalInput: 10000, simpleRateInput: 10, simpleTimeInput: 2 });
context.calculateSimpleInterest();
assertContains('simpleInterestDisplay', 'Rs. 12,000.00');
assertContains('simpleInterestResult', 'Rs. 2,000.00');

console.log('Step 3 calculator tests passed.');
