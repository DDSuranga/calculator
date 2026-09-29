// Memory and Theme State
let memory = 0;
let activeDisplay = 'basic';
let display, displayScientific;
let appInitialized = false;
let lastTrackedPath = '';
let latestShareStatusTimer;
const HOME_TITLE = 'Free Online Calculators & Tools | OnlineCalMaster';
const HOME_DESCRIPTION = 'Use OnlineCalMaster for fast, free, and mobile-friendly online calculators including finance, business, education, health, date, time, and developer tools.';
const SITE_ORIGIN = 'https://onlinecalmaster.com';
const SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/Logo.png`;
const homepageFaqJson = document.getElementById('homepageFaqSchema')?.textContent;
const GA_MEASUREMENT_ID = 'G-2F25VNZYGT';
const CATEGORY_ANCHORS = {
    'Finance': 'finance-calculators',
    'Business': 'business-calculators',
    'Education': 'education-calculators',
    'Health': 'health-calculators',
    'Daily Tools': 'daily-tools',
    'Date & Time': 'date-time-calculators',
    'Unit Conversion': 'unit-conversion-calculators',
    'Developer Tools': 'developer-tools'
};
const RECENT_CALCULATORS_KEY = 'onlineCalMasterRecentCalculators';
const RELATED_OVERRIDES = {
    sip: ['compoundInterest', 'percentage', 'gst', 'salary', 'loanEmi'],
    compoundInterest: ['sip', 'savings', 'simpleInterest', 'percentage', 'loanEmi'],
    savings: ['sip', 'compoundInterest', 'simpleInterest', 'salary', 'percentage'],
    gst: ['percentage', 'vat', 'profitMargin', 'salary', 'loanEmi'],
    vat: ['gst', 'percentage', 'percentageChange', 'tip', 'profitMargin'],
    salesTax: ['gst', 'percentage', 'discount', 'salary', 'profitMargin'],
    loanEmi: ['mortgage', 'roi', 'compoundInterest', 'simpleInterest'],
    mortgage: ['loanEmi', 'roi', 'compoundInterest', 'savings'],
    bmi: ['bmr', 'calorie', 'waterIntake'],
    passwordGenerator: ['uuidGenerator', 'jsonFormatter'],
    jsonFormatter: ['passwordGenerator', 'uuidGenerator'],
    countdown: ['timeZoneDifference', 'date', 'time']
};

const calculatorData = [
    { name: 'Basic Calculator', category: 'Education', target: 'basic', slug: 'basic-calculator', elementId: 'basicCalculator', metaDescription: 'Use the free Basic Calculator by OnlineCalMaster for quick addition, subtraction, multiplication, division, memory, and square root calculations.' },
    { name: 'Scientific Calculator', category: 'Education', target: 'scientific', slug: 'scientific-calculator', elementId: 'scientificCalculator', metaDescription: 'Use the free Scientific Calculator by OnlineCalMaster for trigonometry, logarithms, powers, constants, and advanced math calculations.' },
    { name: 'Unit Converter', category: 'Unit Conversion', target: 'unit', slug: 'unit-converter', elementId: 'unitConverter', heightClass: 'tall', metaDescription: 'Convert common measurement units instantly with the free Unit Converter by OnlineCalMaster.' },
    { name: 'Age Calculator', category: 'Date & Time', target: 'age', slug: 'age-calculator', elementId: 'ageCalculator', heightClass: 'extra-tall', metaDescription: 'Calculate age in years, months, and days using the free Age Calculator by OnlineCalMaster.' },
    { name: 'Date Diff', category: 'Date & Time', target: 'date', slug: 'date-difference-calculator', elementId: 'dateDifferenceCalculator', title: 'Date Difference Calculator', heightClass: 'extra-tall', metaDescription: 'Find the exact difference between two dates using the free Date Difference Calculator by OnlineCalMaster.' },
    { name: 'Time Diff', category: 'Date & Time', target: 'time', slug: 'time-difference-calculator', elementId: 'timeDifferenceCalculator', title: 'Time Difference Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate hours and minutes between two times using the free Time Difference Calculator by OnlineCalMaster.' },
    { name: 'Percentage', category: 'Finance', target: 'percentage', slug: 'percentage-calculator', elementId: 'percentageCalculator', title: 'Percentage Calculator', metaDescription: 'Calculate percentages quickly using the free Percentage Calculator by OnlineCalMaster.' },
    { name: 'Percentage Change', category: 'Business', target: 'percentageChange', slug: 'percentage-change-calculator', elementId: 'percentageChangeCalculator', title: 'Percentage Change Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate percentage increase or decrease between two values with the free Percentage Change Calculator by OnlineCalMaster.' },
    { name: 'Tip', category: 'Business', target: 'tip', slug: 'tip-calculator', elementId: 'tipCalculator', title: 'Tip Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate tips and total bill amounts instantly using the free Tip Calculator by OnlineCalMaster.' },
    { name: 'VAT', category: 'Business', target: 'vat', slug: 'vat-calculator', elementId: 'vatCalculator', title: 'VAT / Discount Calculator', heightClass: 'extra-tall', metaDescription: 'Add or remove VAT from prices instantly using the free VAT Calculator by OnlineCalMaster.' },
    { name: 'Loan EMI', category: 'Finance', target: 'loanEmi', slug: 'loan-emi-calculator', elementId: 'loanEmiCalculator', title: 'Loan EMI Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate monthly EMI payments instantly using the free Loan EMI Calculator by OnlineCalMaster.' },
    { name: 'Mortgage', category: 'Finance', target: 'mortgage', slug: 'mortgage-calculator', elementId: 'mortgageCalculator', title: 'Mortgage Calculator', heightClass: 'extra-tall', metaDescription: 'Estimate monthly mortgage payments and total interest using the free Mortgage Calculator by OnlineCalMaster.' },
    { name: 'Compound Interest', category: 'Finance', target: 'compoundInterest', slug: 'compound-interest-calculator', elementId: 'compoundInterestCalculator', title: 'Compound Interest Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate compound growth, total amount, and interest earned using the free Compound Interest Calculator by OnlineCalMaster.' },
    { name: 'BMI', category: 'Health', target: 'bmi', slug: 'bmi-calculator', elementId: 'bmiCalculator', title: 'BMI Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate body mass index and BMI category using the free BMI Calculator by OnlineCalMaster.' },
    { name: 'Discount', category: 'Finance', target: 'discount', slug: 'discount-calculator', elementId: 'discountCalculator', title: 'Discount Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate sale discounts, tax, final price, and savings using the free Discount Calculator by OnlineCalMaster.' },
    { name: 'Savings', category: 'Finance', target: 'savings', slug: 'savings-calculator', elementId: 'dynamicToolCalculator', title: 'Savings Calculator', heightClass: 'extra-tall', dynamicTool: 'savings', metaDescription: 'Estimate future savings from deposits, interest rate, and time using the free Savings Calculator by OnlineCalMaster.' },
    { name: 'Salary', category: 'Finance', target: 'salary', slug: 'salary-calculator', elementId: 'dynamicToolCalculator', title: 'Salary Calculator', heightClass: 'extra-tall', dynamicTool: 'salary', metaDescription: 'Convert salary amounts between hourly, monthly, and yearly pay using the free Salary Calculator by OnlineCalMaster.' },
    { name: 'Sales Tax', category: 'Finance', target: 'salesTax', slug: 'sales-tax-calculator', elementId: 'dynamicToolCalculator', title: 'Sales Tax Calculator', heightClass: 'extra-tall', dynamicTool: 'salesTax', metaDescription: 'Calculate sales tax amount and final price using the free Sales Tax Calculator by OnlineCalMaster.' },
    { name: 'Fuel Cost', category: 'Finance', target: 'fuelCost', slug: 'fuel-cost-calculator', elementId: 'fuelCostCalculator', title: 'Fuel Cost Calculator', heightClass: 'extra-tall', metaDescription: 'Estimate trip fuel usage and total fuel cost using the free Fuel Cost Calculator by OnlineCalMaster.' },
    { name: 'Profit Margin', category: 'Business', target: 'profitMargin', slug: 'profit-margin-calculator', elementId: 'profitMarginCalculator', title: 'Profit Margin Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate profit amount, profit margin, and markup using the free Profit Margin Calculator by OnlineCalMaster.' },
    { name: 'Break-Even', category: 'Business', target: 'breakEven', slug: 'break-even-calculator', elementId: 'breakEvenCalculator', title: 'Break-Even Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate break-even units and sales value using the free Break-Even Calculator by OnlineCalMaster.' },
    { name: 'ROI', category: 'Finance', target: 'roi', slug: 'roi-calculator', elementId: 'roiCalculator', title: 'ROI Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate net profit and return on investment percentage using the free ROI Calculator by OnlineCalMaster.' },
    { name: 'Simple Interest', category: 'Finance', target: 'simpleInterest', slug: 'simple-interest-calculator', elementId: 'simpleInterestCalculator', title: 'Simple Interest Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate simple interest and total amount using the free Simple Interest Calculator by OnlineCalMaster.' },
    { name: 'BMR', category: 'Health', target: 'bmr', slug: 'bmr-calculator', elementId: 'dynamicToolCalculator', title: 'BMR Calculator', heightClass: 'extra-tall', dynamicTool: 'bmr', metaDescription: 'Estimate basal metabolic rate using age, gender, height, and weight with the free BMR Calculator by OnlineCalMaster.' },
    { name: 'Daily Water Intake', category: 'Health', target: 'waterIntake', slug: 'daily-water-intake-calculator', elementId: 'dynamicToolCalculator', title: 'Daily Water Intake Calculator', heightClass: 'extra-tall', dynamicTool: 'waterIntake', metaDescription: 'Estimate daily water intake based on body weight and activity using the free Daily Water Intake Calculator by OnlineCalMaster.' },
    { name: 'Calorie', category: 'Health', target: 'calorie', slug: 'calorie-calculator', elementId: 'dynamicToolCalculator', title: 'Calorie Calculator', heightClass: 'extra-tall', dynamicTool: 'calorie', metaDescription: 'Estimate daily calorie needs from BMR and activity level using the free Calorie Calculator by OnlineCalMaster.' },
    { name: 'GPA', category: 'Education', target: 'gpa', slug: 'gpa-calculator', elementId: 'dynamicToolCalculator', title: 'GPA Calculator', heightClass: 'extra-tall', dynamicTool: 'gpa', metaDescription: 'Calculate GPA from course grades and credits using the free GPA Calculator by OnlineCalMaster.' },
    { name: 'Percentage Grade', category: 'Education', target: 'percentageGrade', slug: 'percentage-grade-calculator', elementId: 'dynamicToolCalculator', title: 'Percentage Grade Calculator', heightClass: 'extra-tall', dynamicTool: 'percentageGrade', metaDescription: 'Convert marks to percentage grade using the free Percentage Grade Calculator by OnlineCalMaster.' },
    { name: 'Countdown', category: 'Daily Tools', target: 'countdown', slug: 'countdown-calculator', elementId: 'dynamicToolCalculator', title: 'Countdown Calculator', heightClass: 'extra-tall', dynamicTool: 'countdown', metaDescription: 'Calculate days and time remaining until a date using the free Countdown Calculator by OnlineCalMaster.' },
    { name: 'Time Zone Difference', category: 'Daily Tools', target: 'timeZoneDifference', slug: 'time-zone-difference-calculator', elementId: 'dynamicToolCalculator', title: 'Time Zone Difference Calculator', heightClass: 'extra-tall', dynamicTool: 'timeZoneDifference', metaDescription: 'Find the time difference between two UTC offsets using the free Time Zone Difference Calculator by OnlineCalMaster.' },
    { name: 'Password Generator', category: 'Developer Tools', target: 'passwordGenerator', slug: 'password-generator', elementId: 'dynamicToolCalculator', title: 'Password Generator', heightClass: 'extra-tall', dynamicTool: 'passwordGenerator', metaDescription: 'Generate strong passwords with length and character options using the free Password Generator by OnlineCalMaster.' },
    { name: 'UUID Generator', category: 'Developer Tools', target: 'uuidGenerator', slug: 'uuid-generator', elementId: 'dynamicToolCalculator', title: 'UUID Generator', heightClass: 'extra-tall', dynamicTool: 'uuidGenerator', metaDescription: 'Generate UUID v4 identifiers instantly using the free UUID Generator by OnlineCalMaster.' },
    { name: 'JSON Formatter', category: 'Developer Tools', target: 'jsonFormatter', slug: 'json-formatter', elementId: 'dynamicToolCalculator', title: 'JSON Formatter', heightClass: 'extra-tall', dynamicTool: 'jsonFormatter', metaDescription: 'Format, prettify, and validate JSON using the free JSON Formatter by OnlineCalMaster.' },
    { name: 'Volume', category: 'Education', target: 'volume', slug: 'volume-calculator', elementId: 'volumeCalculator', title: 'Volume Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate volume for common 3D shapes using the free Volume Calculator by OnlineCalMaster.' },
    { name: 'GST Calculator India', category: 'Business', target: 'gst', slug: 'gst-calculator', elementId: 'dynamicToolCalculator', title: 'GST Calculator India', seoTitle: 'GST Calculator India – Calculate GST, CGST, SGST & IGST | OnlineCalMaster', heightClass: 'extra-tall', dynamicTool: 'gst', metaDescription: 'Add GST to a price or remove GST from an inclusive amount. Calculate Indian rupee totals with CGST and SGST or IGST breakdowns using preset or custom rates.' },
    { name: 'SIP Calculator India', category: 'Finance', target: 'sip', slug: 'sip-calculator', elementId: 'dynamicToolCalculator', title: 'SIP Calculator India', seoTitle: 'SIP Calculator India – Calculate SIP Returns & Future Value | OnlineCalMaster', heightClass: 'extra-tall', dynamicTool: 'sip', metaDescription: 'Estimate monthly SIP future value, total invested and potential returns in Indian rupees using your return rate and period, with end-of-month contributions.' },
    { name: 'Area', category: 'Education', target: 'area', slug: 'area-calculator', elementId: 'areaCalculator', title: 'Area Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate area for common 2D shapes using the free Area Calculator by OnlineCalMaster.' }
];

function getCalculatorByTarget(type) {
    return calculatorData.find(calculator => calculator.target === type);
}

const dynamicToolDefinitions = {
    sip: {
        description: 'Estimate SIP future value and returns with monthly investments made at the end of each month.',
        fields: [
            { id: 'sipMonthly', label: 'Monthly Investment (₹)', type: 'number', value: '5000', min: 0, max: 1000000000, step: 'any' },
            { id: 'sipAnnualRate', label: 'Expected Annual Return (%)', type: 'number', value: '12', min: 0, max: 100, step: 'any' },
            { id: 'sipYears', label: 'Investment Period (Years)', type: 'number', value: '10', min: 0.08333333333333333, max: 100, step: 'any' }
        ],
        copy: true,
        help: {
            what: 'A SIP (Systematic Investment Plan) is a method of investing a fixed amount periodically, commonly in mutual funds. This monthly SIP calculator estimates growth using a constant return rate and contributions at the <strong>end of each month</strong>. Results depend on the rate you enter. Mutual fund returns are market-linked, are not guaranteed, and actual returns can differ. Past performance does not guarantee future performance. This is an educational planning tool, not investment advice. See <a href="https://www.amfiindia.com/investor/knowledge-center-info?zoneName=riskInMutualFunds">AMFI guidance on mutual fund risks</a>.',
            how: 'Enter a monthly investment, your assumed annual return and the investment period. Select Calculate to view total invested, estimated returns and estimated future value. The 12% default is an illustration, not a promised or typical return.',
            formula: 'Let P be the monthly investment, i = annual return / 12 / 100 and n = years × 12. With end-of-month contributions, FV = P × ((1 + i)^n − 1) / i. At 0%, FV = P × n. Total invested = P × n; estimated returns = FV − total invested. The calculation does not multiply by (1 + i). The annual percentage is divided by 12, not converted from an effective annual rate.',
            get example() {
                const result = calculateSip({ sipMonthly: '5000', sipAnnualRate: '12', sipYears: '10' });
                return `For ${formatSipCurrency(5000)} invested at the end of each month for 10 years, an illustrative 12% annual rate gives i = 0.01 and n = 120. Total invested: ${formatSipCurrency(result.invested)}. Estimated returns: ${formatSipCurrency(result.returns)}. Estimated future value: ${formatSipCurrency(result.futureValue)}. Figures are rounded to the nearest rupee; the calculation retains precision internally.`;
            },
            faqs: [
                ['SIP vs lump sum: how do they differ?', 'A SIP spreads contributions across time. A lump sum is invested upfront, so the entire amount is exposed to market movements from the start. This tool models equal monthly contributions only; it does not compare funds or recommend a method.'],
                ['How does the investment period affect SIP growth?', 'A longer period adds more contributions. At a positive assumed return, earlier contributions also have more time to compound. Market returns fluctuate, so this smooth projection is not a forecast of actual fund performance.'],
                ['When are monthly contributions invested?', 'At the end of each month. The final contribution earns no return before the end of the modeled period. A beginning-of-month convention would produce a different estimate and is not used here.'],
                ['Can I use a decimal return or investment period?', 'Yes. For example, 10.5% is supported and 1.5 years equals 18 months. Decimal years are multiplied by 12 without rounding. A fractional-month result is a mathematical approximation, not an exact contribution schedule. The minimum period is one month.'],
                ['What happens at 0% return or zero investment?', 'At 0%, estimated future value equals the total invested and estimated returns are zero. A zero monthly investment produces zero for all three results.'],
                ['Does this include fees, taxes, inflation or market losses?', 'No. It uses a constant non-negative return assumption without separately modeling fees, taxes, inflation, step-up contributions or withdrawals. Actual investments can lose value. Adjusting an assumption is not a substitute for reviewing a fund’s risks and costs.'],
                ['What are the input and display limits?', 'For numerical reliability, monthly investment is limited to ₹1,00,00,00,000, annual return to 0–100%, and the period to one month–100 years. Estimates above ₹1,00,00,00,00,00,00,000 are rejected. These are calculator limits, not guidance about suitable investments or achievable returns. Results are displayed to the nearest rupee.']
            ]
        },
        calculate(values) {
            const result = calculateSip(values);
            return dynamicResult(formatSipCurrency(result.futureValue), [
                ['Total Invested', formatSipCurrency(result.invested)],
                ['Estimated Returns', formatSipCurrency(result.returns)],
                ['Estimated Future Value', formatSipCurrency(result.futureValue), true]
            ]);
        }
    },
    gst: {
        description: 'Calculate GST-inclusive and GST-exclusive amounts with CGST, SGST and IGST breakdowns.',
        fields: [
            { id: 'gstAmount', label: 'Amount (₹)', type: 'number', placeholder: 'Enter amount', min: 0, max: 1000000000000, step: 'any' },
            { id: 'gstRate', label: 'GST Rate', type: 'select', value: '18', options: [['0', '0%'], ['0.25', '0.25%'], ['3', '3%'], ['5', '5%'], ['12', '12%'], ['18', '18%'], ['28', '28%'], ['custom', 'Custom %']] },
            { id: 'gstCustomRate', label: 'Custom rate (%) — used only for Custom %', type: 'number', placeholder: 'Enter custom rate', min: 0, max: 100, step: 'any' },
            { id: 'gstTaxType', label: 'Tax Type', type: 'select', options: [['intra', 'Intra-State (CGST + SGST)'], ['inter', 'Inter-State (IGST)']] },
            { id: 'gstMode', label: 'Calculation Mode', type: 'radio', value: 'add', options: [['add', 'Add GST (GST Exclusive)'], ['remove', 'Remove GST (GST Inclusive)']] }
        ],
        copy: true,
        help: {
            what: 'GST (Goods and Services Tax) is an indirect tax on supplies in India. This tool calculates a single GST percentage on the amount you enter; it does not determine tax classification, input tax credits, cess or invoice eligibility. <strong>GST rates can vary by goods, services and classification.</strong> Select the rate applicable to your transaction and verify current rates with <a href="https://www.gstcouncil.gov.in/">official Indian GST guidance</a> when necessary. Presets are calculation choices, not a list of rates currently applicable to every transaction. This tool does not provide professional tax advice.',
            how: 'Enter your amount in rupees, choose the applicable GST rate (or Custom % and a custom rate), select Intra-State or Inter-State, and choose Add GST or Remove GST. Press Calculate to see the breakdown. Zero is allowed. Amounts up to ₹10,00,00,00,00,000 and rates from 0% to 100% are supported.',
            formula: '<strong>Add GST to an amount:</strong> GST = base amount × rate / 100; total = base + GST. <strong>Remove GST from an inclusive price:</strong> base = inclusive amount / (1 + rate / 100); GST component = inclusive amount − base. Do not multiply an inclusive price directly by the rate to extract its GST.',
            example: 'At an illustrative 18%, ₹1,000 before GST gives ₹180 GST and a ₹1,180 total. Removing 18% GST from ₹1,180 returns a ₹1,000 base and ₹180 GST. Intra-State splits this into ₹90 CGST and ₹90 SGST; Inter-State shows ₹180 IGST instead. At 5%, ₹1,000 becomes ₹1,050, and reversing that price returns ₹1,000.',
            faqs: [
                ['CGST vs SGST vs IGST: what does the breakdown mean?', 'For the Intra-State option, this calculator divides the selected GST rate and tax equally between CGST and SGST. For the Inter-State option, it shows the full rate and amount as IGST. Applicable Union Territory transactions may use UTGST instead of SGST. Verify the nature and place of supply under the relevant rules.'],
                ['How do I remove GST from an amount?', 'Divide the GST-inclusive price by 1 plus the GST rate divided by 100. At 18%, divide by 1.18. Subtract the resulting base from the inclusive price to find the GST component.'],
                ['Which GST rate should I select?', 'Choose the rate applicable to your transaction. This calculator cannot identify a product or service classification or establish an exemption. Check official GST/CBIC guidance rather than assuming that a preset applies.'],
                ['Can I calculate zero GST or use a custom rate?', 'Yes. At 0%, GST is zero and the base equals the total. Select Custom % to enter another rate from 0% to 100%.'],
                ['How are paise and large amounts handled?', 'Calculations use unrounded values internally, and rupee results are displayed with two decimal places using Indian digit grouping. Components are rounded independently, so their displayed sum can differ by one paisa. Values above the stated amount limit are rejected to keep results readable and numerically reliable.']
            ]
        },
        calculate(values) {
            const result = calculateGst(values);
            const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
            const removing = values.gstMode === 'remove';
            const rows = removing
                ? [['GST Inclusive Amount', money(result.total)], ['GST Rate', `${result.rate}%`], ['Original/Base Amount', money(result.base), true]]
                : [['Original Amount', money(result.base)], ['GST Rate', `${result.rate}%`]];
            if (values.gstTaxType === 'inter') rows.push([`IGST (${result.rate}%)`, money(result.gst)]);
            else rows.push([removing ? 'GST Component' : 'GST Amount', money(result.gst)], [`CGST (${result.rate / 2}%)`, money(result.gst / 2)], [`SGST (${result.rate / 2}%)`, money(result.gst / 2)]);
            if (!removing) rows.push(['Total Amount', money(result.total), true]);
            return dynamicResult(money(removing ? result.base : result.total), rows);
        }
    },
    savings: {
        description: 'Project future savings from current balance, monthly deposits, annual interest, and time.',
        fields: [
            { id: 'currentBalance', label: 'Current Savings', type: 'number', placeholder: 'Current amount', min: 0, step: '0.01' },
            { id: 'monthlyDeposit', label: 'Monthly Deposit', type: 'number', placeholder: 'Monthly deposit', min: 0, step: '0.01' },
            { id: 'annualRate', label: 'Annual Interest Rate (%)', type: 'number', placeholder: 'Interest rate', min: 0, step: '0.01' },
            { id: 'years', label: 'Time Period (Years)', type: 'number', placeholder: 'Years', min: 0, step: '0.01' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Savings Calculator estimates how your savings can grow over time with regular monthly deposits and interest.',
            how: 'Enter your current savings, planned monthly deposit, annual interest rate, and savings period.',
            formula: 'Future value is calculated by compounding the starting balance monthly and adding each monthly deposit.',
            example: 'Rs. 100,000 saved now plus Rs. 10,000 per month for 5 years at 6 percent grows to an estimated future balance.',
            faqs: [
                ['Does this compound monthly?', 'Yes. The estimate uses monthly compounding.'],
                ['Can monthly deposit be zero?', 'Yes. Enter 0 if you only want to grow the starting balance.'],
                ['Is this guaranteed?', 'No. It is an estimate based on the rate you enter.']
            ]
        },
        calculate(values) {
            const current = readPositiveOrZero(values.currentBalance, 'Current savings cannot be negative.');
            const deposit = readPositiveOrZero(values.monthlyDeposit, 'Monthly deposit cannot be negative.');
            const rate = readPositiveOrZero(values.annualRate, 'Interest rate cannot be negative.');
            const years = readGreaterThanZero(values.years, 'Time period must be greater than 0.');
            const months = Math.round(years * 12);
            const monthlyRate = rate / 12 / 100;
            let balance = current;
            for (let month = 0; month < months; month += 1) {
                balance = balance * (1 + monthlyRate) + deposit;
            }
            const totalDeposits = current + deposit * months;
            return dynamicResult(formatLoanCurrency(balance), [
                ['Future Savings', formatLoanCurrency(balance), true],
                ['Total Deposits', formatLoanCurrency(totalDeposits)],
                ['Interest Earned', formatLoanCurrency(balance - totalDeposits)],
                ['Time Period', `${formatNumber(years)} years`]
            ]);
        }
    },
    salary: {
        description: 'Convert hourly, monthly, and yearly pay with simple work schedule assumptions.',
        fields: [
            { id: 'payAmount', label: 'Pay Amount', type: 'number', placeholder: 'Amount', min: 0, step: '0.01' },
            { id: 'payType', label: 'Pay Type', type: 'select', options: [['hourly', 'Hourly'], ['monthly', 'Monthly'], ['yearly', 'Yearly']] },
            { id: 'hoursPerWeek', label: 'Hours Per Week', type: 'number', placeholder: '40', min: 0, step: '0.01', value: '40' },
            { id: 'weeksPerYear', label: 'Weeks Per Year', type: 'number', placeholder: '52', min: 0, step: '0.01', value: '52' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Salary Calculator converts pay between hourly, monthly, and yearly values.',
            how: 'Enter the pay amount, pay type, weekly hours, and working weeks per year.',
            formula: 'Yearly pay = Hourly rate x Hours per week x Weeks per year. Monthly pay = Yearly pay / 12.',
            example: 'Rs. 1,000 per hour at 40 hours per week and 52 weeks equals Rs. 2,080,000 per year.',
            faqs: [
                ['Does this include tax?', 'No. It is a gross salary conversion only.'],
                ['Can I change work hours?', 'Yes. Adjust hours per week and weeks per year.'],
                ['Is monthly salary exact?', 'It uses yearly salary divided by 12.']
            ]
        },
        calculate(values) {
            const amount = readGreaterThanZero(values.payAmount, 'Pay amount must be greater than 0.');
            const hours = readGreaterThanZero(values.hoursPerWeek, 'Hours per week must be greater than 0.');
            const weeks = readGreaterThanZero(values.weeksPerYear, 'Weeks per year must be greater than 0.');
            let yearly;
            if (values.payType === 'hourly') yearly = amount * hours * weeks;
            if (values.payType === 'monthly') yearly = amount * 12;
            if (values.payType === 'yearly') yearly = amount;
            const monthly = yearly / 12;
            const hourly = yearly / weeks / hours;
            return dynamicResult(formatLoanCurrency(yearly), [
                ['Yearly Salary', formatLoanCurrency(yearly), true],
                ['Monthly Salary', formatLoanCurrency(monthly)],
                ['Hourly Rate', formatLoanCurrency(hourly)],
                ['Work Schedule', `${formatNumber(hours)} hrs/week, ${formatNumber(weeks)} weeks/year`]
            ]);
        }
    },
    salesTax: {
        description: 'Calculate sales tax amount and final price from a pre-tax price and tax rate.',
        fields: [
            { id: 'price', label: 'Price Before Tax', type: 'number', placeholder: 'Price', min: 0, step: '0.01' },
            { id: 'taxRate', label: 'Sales Tax Rate (%)', type: 'number', placeholder: 'Tax rate', min: 0, step: '0.01' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Sales Tax Calculator finds the tax amount and total price after tax.',
            how: 'Enter the item price before tax and the sales tax percentage.',
            formula: 'Sales tax = Price x Tax rate / 100. Total price = Price + Sales tax.',
            example: 'A Rs. 10,000 item with 8 percent tax has Rs. 800 tax and Rs. 10,800 total price.',
            faqs: [
                ['Is this the same as VAT?', 'It works for any percentage-based sales tax.'],
                ['Can tax rate be zero?', 'Yes. A zero tax rate returns the original price.'],
                ['Does it handle multiple items?', 'Enter the combined pre-tax total.']
            ]
        },
        calculate(values) {
            const price = readGreaterThanZero(values.price, 'Price must be greater than 0.');
            const rate = readPositiveOrZero(values.taxRate, 'Tax rate cannot be negative.');
            const tax = price * rate / 100;
            return dynamicResult(formatLoanCurrency(price + tax), [
                ['Final Price', formatLoanCurrency(price + tax), true],
                ['Sales Tax', formatLoanCurrency(tax)],
                ['Price Before Tax', formatLoanCurrency(price)],
                ['Tax Rate', `${formatNumber(rate)}%`]
            ]);
        }
    },
    bmr: {
        description: 'Estimate basal metabolic rate using the Mifflin-St Jeor equation.',
        fields: [
            { id: 'gender', label: 'Gender', type: 'select', options: [['male', 'Male'], ['female', 'Female']] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Weight', min: 0, step: '0.01' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Height', min: 0, step: '0.01' },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Age', min: 0, step: '1' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The BMR Calculator estimates calories your body uses at rest.',
            how: 'Enter gender, weight, height, and age.',
            formula: 'Mifflin-St Jeor: Men = 10W + 6.25H - 5A + 5. Women = 10W + 6.25H - 5A - 161.',
            example: 'A 30-year-old male, 70 kg and 175 cm, has an estimated BMR near 1,649 calories/day.',
            faqs: [
                ['Is BMR the same as daily calories?', 'No. BMR is resting energy only. Activity increases daily needs.'],
                ['Which units are used?', 'Weight in kilograms and height in centimeters.'],
                ['Is this medical advice?', 'No. It is an estimate for general planning.']
            ]
        },
        calculate(values) {
            const weight = readGreaterThanZero(values.weight, 'Weight must be greater than 0.');
            const height = readGreaterThanZero(values.height, 'Height must be greater than 0.');
            const age = readGreaterThanZero(values.age, 'Age must be greater than 0.');
            const bmr = 10 * weight + 6.25 * height - 5 * age + (values.gender === 'male' ? 5 : -161);
            return dynamicResult(`${formatNumber(bmr, 0)} calories/day`, [
                ['Estimated BMR', `${formatNumber(bmr, 0)} calories/day`, true],
                ['Formula', 'Mifflin-St Jeor'],
                ['Weight', `${formatNumber(weight)} kg`],
                ['Height', `${formatNumber(height)} cm`]
            ]);
        }
    },
    waterIntake: {
        description: 'Estimate daily water intake based on body weight and activity time.',
        fields: [
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Weight', min: 0, step: '0.01' },
            { id: 'activityMinutes', label: 'Activity Minutes', type: 'number', placeholder: 'Daily activity minutes', min: 0, step: '1' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Daily Water Intake Calculator estimates a practical daily hydration target.',
            how: 'Enter your weight and average daily activity minutes.',
            formula: 'Base water = Weight x 35 ml. Activity adds about 350 ml per 30 minutes.',
            example: 'A 70 kg person with 30 minutes of activity needs about 2.8 liters per day.',
            faqs: [
                ['Is this exact?', 'No. Weather, diet, health, and activity affect water needs.'],
                ['Can activity be zero?', 'Yes. Enter 0 for a base estimate.'],
                ['Should I ask a doctor?', 'Yes, especially for medical conditions or fluid restrictions.']
            ]
        },
        calculate(values) {
            const weight = readGreaterThanZero(values.weight, 'Weight must be greater than 0.');
            const activity = readPositiveOrZero(values.activityMinutes, 'Activity minutes cannot be negative.');
            const liters = (weight * 35 + activity / 30 * 350) / 1000;
            return dynamicResult(`${formatNumber(liters)} liters/day`, [
                ['Daily Water Intake', `${formatNumber(liters)} liters/day`, true],
                ['Base Intake', `${formatNumber(weight * 35 / 1000)} liters`],
                ['Activity Add-on', `${formatNumber(activity / 30 * 0.35)} liters`],
                ['Activity', `${formatNumber(activity, 0)} minutes`]
            ]);
        }
    },
    calorie: {
        description: 'Estimate daily calorie needs from BMR and activity level.',
        fields: [
            { id: 'gender', label: 'Gender', type: 'select', options: [['male', 'Male'], ['female', 'Female']] },
            { id: 'weight', label: 'Weight (kg)', type: 'number', placeholder: 'Weight', min: 0, step: '0.01' },
            { id: 'height', label: 'Height (cm)', type: 'number', placeholder: 'Height', min: 0, step: '0.01' },
            { id: 'age', label: 'Age', type: 'number', placeholder: 'Age', min: 0, step: '1' },
            { id: 'activity', label: 'Activity Level', type: 'select', options: [['1.2', 'Sedentary'], ['1.375', 'Light'], ['1.55', 'Moderate'], ['1.725', 'Active'], ['1.9', 'Very Active']] }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Calorie Calculator estimates calories needed to maintain current weight.',
            how: 'Enter body details and select the activity level that best matches your routine.',
            formula: 'Daily calories = BMR x activity factor.',
            example: 'If BMR is 1,650 and activity factor is 1.55, maintenance calories are about 2,558/day.',
            faqs: [
                ['Can this help with weight loss?', 'It gives a maintenance estimate; weight loss usually requires a calorie deficit.'],
                ['Which BMR formula is used?', 'It uses the Mifflin-St Jeor equation.'],
                ['Is it exact?', 'No. It is a planning estimate.']
            ]
        },
        calculate(values) {
            const weight = readGreaterThanZero(values.weight, 'Weight must be greater than 0.');
            const height = readGreaterThanZero(values.height, 'Height must be greater than 0.');
            const age = readGreaterThanZero(values.age, 'Age must be greater than 0.');
            const factor = parseFloat(values.activity);
            const bmr = 10 * weight + 6.25 * height - 5 * age + (values.gender === 'male' ? 5 : -161);
            const calories = bmr * factor;
            return dynamicResult(`${formatNumber(calories, 0)} calories/day`, [
                ['Maintenance Calories', `${formatNumber(calories, 0)} calories/day`, true],
                ['BMR', `${formatNumber(bmr, 0)} calories/day`],
                ['Activity Factor', factor.toFixed(3)],
                ['Weight', `${formatNumber(weight)} kg`]
            ]);
        }
    },
    gpa: {
        description: 'Calculate GPA from up to five courses using grade points and credits.',
        fields: [
            { id: 'grade1', label: 'Course 1 Grade Point', type: 'number', placeholder: '0 - 4', min: 0, step: '0.01' },
            { id: 'credits1', label: 'Course 1 Credits', type: 'number', placeholder: 'Credits', min: 0, step: '0.01' },
            { id: 'grade2', label: 'Course 2 Grade Point', type: 'number', placeholder: '0 - 4', min: 0, step: '0.01' },
            { id: 'credits2', label: 'Course 2 Credits', type: 'number', placeholder: 'Credits', min: 0, step: '0.01' },
            { id: 'grade3', label: 'Course 3 Grade Point', type: 'number', placeholder: 'Optional', min: 0, step: '0.01' },
            { id: 'credits3', label: 'Course 3 Credits', type: 'number', placeholder: 'Optional', min: 0, step: '0.01' },
            { id: 'grade4', label: 'Course 4 Grade Point', type: 'number', placeholder: 'Optional', min: 0, step: '0.01' },
            { id: 'credits4', label: 'Course 4 Credits', type: 'number', placeholder: 'Optional', min: 0, step: '0.01' },
            { id: 'grade5', label: 'Course 5 Grade Point', type: 'number', placeholder: 'Optional', min: 0, step: '0.01' },
            { id: 'credits5', label: 'Course 5 Credits', type: 'number', placeholder: 'Optional', min: 0, step: '0.01' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The GPA Calculator computes weighted GPA from course grade points and credits.',
            how: 'Enter grade points and credits for each course. Leave unused rows blank.',
            formula: 'GPA = Sum of grade point x credits / Sum of credits.',
            example: 'Grades 4.0 and 3.0 with equal credits give a GPA of 3.5.',
            faqs: [
                ['Can I use a 5-point scale?', 'Yes, if all entered grade points use the same scale.'],
                ['Are blank rows allowed?', 'Yes. Blank course rows are ignored.'],
                ['Do credits matter?', 'Yes. Higher-credit courses affect GPA more.']
            ]
        },
        calculate(values) {
            let totalPoints = 0;
            let totalCredits = 0;
            for (let index = 1; index <= 5; index += 1) {
                const gradeRaw = values[`grade${index}`];
                const creditsRaw = values[`credits${index}`];
                if (!gradeRaw && !creditsRaw) continue;
                const grade = readPositiveOrZero(gradeRaw, `Course ${index} grade cannot be negative.`);
                const credits = readGreaterThanZero(creditsRaw, `Course ${index} credits must be greater than 0.`);
                totalPoints += grade * credits;
                totalCredits += credits;
            }
            if (totalCredits <= 0) throw new Error('Enter at least one course with grade and credits.');
            const gpa = totalPoints / totalCredits;
            return dynamicResult(gpa.toFixed(2), [
                ['GPA', gpa.toFixed(2), true],
                ['Total Credits', formatNumber(totalCredits)],
                ['Quality Points', formatNumber(totalPoints)]
            ]);
        }
    },
    percentageGrade: {
        description: 'Convert scored marks and total marks into a percentage and grade label.',
        fields: [
            { id: 'marksScored', label: 'Marks Scored', type: 'number', placeholder: 'Scored marks', min: 0, step: '0.01' },
            { id: 'totalMarks', label: 'Total Marks', type: 'number', placeholder: 'Total marks', min: 0, step: '0.01' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Percentage Grade Calculator converts marks into a percentage and grade band.',
            how: 'Enter marks scored and total possible marks.',
            formula: 'Percentage = Marks scored / Total marks x 100.',
            example: '45 out of 50 equals 90 percent, commonly an A grade.',
            faqs: [
                ['Can marks include decimals?', 'Yes. Decimal marks are supported.'],
                ['Can scored marks exceed total?', 'No. Scored marks should not be greater than total marks.'],
                ['Are grades universal?', 'No. Grade bands can vary by school or exam board.']
            ]
        },
        calculate(values) {
            const scored = readPositiveOrZero(values.marksScored, 'Marks scored cannot be negative.');
            const total = readGreaterThanZero(values.totalMarks, 'Total marks must be greater than 0.');
            if (scored > total) throw new Error('Marks scored cannot be greater than total marks.');
            const percentage = scored / total * 100;
            const grade = percentage >= 90 ? 'A' : percentage >= 80 ? 'B' : percentage >= 70 ? 'C' : percentage >= 60 ? 'D' : 'F';
            return dynamicResult(`${formatNumber(percentage)}%`, [
                ['Percentage', `${formatNumber(percentage)}%`, true],
                ['Grade', grade],
                ['Marks Scored', formatNumber(scored)],
                ['Total Marks', formatNumber(total)]
            ]);
        }
    },
    countdown: {
        description: 'Calculate remaining days and time until a future date.',
        fields: [
            { id: 'targetDate', label: 'Target Date', type: 'date' },
            { id: 'targetTime', label: 'Target Time', type: 'time' }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Countdown Calculator shows how much time remains until a selected date and time.',
            how: 'Choose a target date and optional time, then calculate the remaining duration.',
            formula: 'Countdown = Target date and time - Current date and time.',
            example: 'If an event is 10 days away, the result shows the remaining days, hours, and minutes.',
            faqs: [
                ['Can I leave time blank?', 'Yes. It will use midnight at the start of the selected date.'],
                ['Can I choose a past date?', 'No. Choose a future date for a countdown.'],
                ['Does it use my local time?', 'Yes. It uses your browser local time.']
            ]
        },
        calculate(values) {
            if (!values.targetDate) throw new Error('Please choose a target date.');
            const target = new Date(`${values.targetDate}T${values.targetTime || '00:00'}`);
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            if (!Number.isFinite(diff) || diff <= 0) throw new Error('Target date and time must be in the future.');
            const totalMinutes = Math.floor(diff / 60000);
            const days = Math.floor(totalMinutes / 1440);
            const hours = Math.floor(totalMinutes % 1440 / 60);
            const minutes = totalMinutes % 60;
            return dynamicResult(`${days} days`, [
                ['Time Remaining', `${days} days, ${hours} hours, ${minutes} minutes`, true],
                ['Target', target.toLocaleString()],
                ['Total Hours', formatNumber(diff / 3600000)],
                ['Total Minutes', totalMinutes.toLocaleString('en-US')]
            ]);
        }
    },
    timeZoneDifference: {
        description: 'Find the hour difference between two UTC time zone offsets.',
        fields: [
            { id: 'fromOffset', label: 'From UTC Offset', type: 'select', options: buildUtcOffsetOptions() },
            { id: 'toOffset', label: 'To UTC Offset', type: 'select', options: buildUtcOffsetOptions() }
        ],
        primaryAction: 'Calculate',
        help: {
            what: 'The Time Zone Difference Calculator compares two UTC offsets.',
            how: 'Select the starting UTC offset and the destination UTC offset.',
            formula: 'Difference = To UTC offset - From UTC offset.',
            example: 'UTC+05:30 to UTC+00:00 is 5 hours 30 minutes behind.',
            faqs: [
                ['Does this handle daylight saving?', 'No. It compares fixed UTC offsets only.'],
                ['Can I compare half-hour zones?', 'Yes. Half-hour offsets are included.'],
                ['Is this a meeting planner?', 'It shows offset difference, not calendar availability.']
            ]
        },
        calculate(values) {
            const from = parseFloat(values.fromOffset);
            const to = parseFloat(values.toOffset);
            const diff = to - from;
            const abs = Math.abs(diff);
            const hours = Math.floor(abs);
            const minutes = Math.round((abs - hours) * 60);
            const direction = diff === 0 ? 'same time' : diff > 0 ? 'ahead' : 'behind';
            return dynamicResult(diff === 0 ? 'Same time' : `${hours}h ${minutes}m ${direction}`, [
                ['Difference', diff === 0 ? 'Same time' : `${hours} hours ${minutes} minutes ${direction}`, true],
                ['From Offset', formatUtcOffset(from)],
                ['To Offset', formatUtcOffset(to)]
            ]);
        }
    },
    passwordGenerator: {
        description: 'Generate strong passwords with configurable length and character sets.',
        fields: [
            { id: 'length', label: 'Password Length', type: 'number', placeholder: 'Length', min: 4, max: 64, step: '1', value: '16' },
            { id: 'lowercase', label: 'Include Lowercase', type: 'checkbox', checked: true },
            { id: 'uppercase', label: 'Include Uppercase', type: 'checkbox', checked: true },
            { id: 'numbers', label: 'Include Numbers', type: 'checkbox', checked: true },
            { id: 'symbols', label: 'Include Symbols', type: 'checkbox', checked: true }
        ],
        primaryAction: 'Generate',
        copy: true,
        help: {
            what: 'The Password Generator creates random passwords from selected character groups.',
            how: 'Choose length and character options, then generate and copy the result.',
            formula: 'Passwords are built by randomly selecting characters from the enabled sets.',
            example: 'A 16-character password with letters, numbers, and symbols is stronger than a short word password.',
            faqs: [
                ['What length is recommended?', 'At least 12 to 16 characters is a good general target.'],
                ['Should I include symbols?', 'Symbols improve complexity when the website supports them.'],
                ['Is the password stored?', 'No. It is generated in your browser only.']
            ]
        },
        calculate(values) {
            const length = readGreaterThanZero(values.length, 'Password length must be greater than 0.');
            if (length < 4 || length > 64) throw new Error('Password length must be between 4 and 64.');
            const sets = [];
            if (values.lowercase) sets.push('abcdefghijklmnopqrstuvwxyz');
            if (values.uppercase) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            if (values.numbers) sets.push('0123456789');
            if (values.symbols) sets.push('!@#$%^&*()-_=+[]{};:,.?');
            if (!sets.length) throw new Error('Select at least one character option.');
            const all = sets.join('');
            let password = sets.map(set => set[randomIndex(set.length)]).join('');
            while (password.length < length) password += all[randomIndex(all.length)];
            password = shuffleString(password).slice(0, length);
            return dynamicResult(password, [
                ['Generated Password', password, true],
                ['Length', length],
                ['Character Sets', sets.length]
            ], password);
        }
    },
    uuidGenerator: {
        description: 'Generate UUID v4 style identifiers for development and testing.',
        fields: [],
        primaryAction: 'Generate UUID',
        copy: true,
        help: {
            what: 'The UUID Generator creates random UUID v4 style IDs.',
            how: 'Click Generate UUID, then copy the generated identifier.',
            formula: 'UUID v4 uses random hexadecimal values with version and variant bits.',
            example: 'A UUID looks like 550e8400-e29b-41d4-a716-446655440000.',
            faqs: [
                ['What is UUID v4?', 'It is a randomly generated unique identifier format.'],
                ['Can I generate many IDs?', 'Yes. Click Generate UUID again for a new value.'],
                ['Is it for security tokens?', 'No. Use a security-specific token generator for sensitive secrets.']
            ]
        },
        calculate() {
            const uuid = generateUuidV4();
            return dynamicResult(uuid, [['UUID v4', uuid, true]], uuid);
        }
    },
    jsonFormatter: {
        description: 'Format, prettify, and validate JSON text.',
        fields: [
            { id: 'jsonInput', label: 'JSON Input', type: 'textarea', placeholder: '{"name":"OnlineCalMaster"}' }
        ],
        primaryAction: 'Format JSON',
        copy: true,
        help: {
            what: 'The JSON Formatter validates JSON and converts it into readable indented formatting.',
            how: 'Paste JSON text, press Format JSON, and copy the formatted result.',
            formula: 'The tool parses JSON, then serializes it with two-space indentation.',
            example: '{"name":"OnlineCalMaster"} becomes a neatly formatted JSON object.',
            faqs: [
                ['Does it fix invalid JSON?', 'No. It reports invalid JSON so you can correct it.'],
                ['Is my JSON uploaded?', 'No. Formatting happens in your browser.'],
                ['Can I copy the result?', 'Yes. Use the Copy button after formatting.']
            ]
        },
        calculate(values) {
            if (!values.jsonInput.trim()) throw new Error('Please paste JSON before formatting.');
            let parsed;
            try {
                parsed = JSON.parse(values.jsonInput);
            } catch (error) {
                throw new Error(`Invalid JSON: ${error.message}`);
            }
            const formatted = JSON.stringify(parsed, null, 2);
            return dynamicResult('Valid JSON', [
                ['Status', 'Valid JSON', true],
                ['Characters', formatted.length.toLocaleString('en-US')]
            ], formatted);
        }
    }
};

function calculateSip(values) {
    const numeric = (raw, label, maximum) => {
        const text = String(raw ?? '').trim();
        if (!text || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) throw new Error(`Enter a valid non-negative ${label}.`);
        const value = Number(text);
        if (!Number.isFinite(value) || value > maximum) throw new Error(`Enter a ${label} within the calculator limits shown below.`);
        return value;
    };
    const monthly = numeric(values.sipMonthly, 'monthly investment', 1000000000);
    const annualRate = numeric(values.sipAnnualRate, 'annual return', 100);
    const years = numeric(values.sipYears, 'investment period', 100);
    const months = years * 12;
    if (months < 1) throw new Error('Enter an investment period of at least one month (1/12 year).');
    const invested = monthly * months;
    const monthlyRate = annualRate / 12 / 100;
    // Stable evaluation of ((1 + i)^n - 1) / i, including very small positive rates.
    const futureValue = monthlyRate === 0 ? invested : monthly * Math.expm1(months * Math.log1p(monthlyRate)) / monthlyRate;
    if (!Number.isFinite(futureValue) || futureValue > 1000000000000000) throw new Error('Estimate is too large to display reliably. Reduce the investment, return rate or period.');
    // Non-negative assumptions cannot produce a loss; clamp floating-point round-off only.
    return { invested, returns: Math.max(0, futureValue - invested), futureValue: Math.max(invested, futureValue), months };
}

function formatSipCurrency(value) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
}

function calculateGst(values) {
    const numeric = (raw, label, maximum) => {
        const text = String(raw ?? '').trim();
        if (!text || !/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) throw new Error(`Enter a valid non-negative ${label}.`);
        const value = Number(text);
        if (!Number.isFinite(value) || value > maximum) throw new Error(`${label === 'amount' ? 'Amount must be at most ₹10,00,00,00,00,000' : 'GST rate must be between 0% and 100%'}.`);
        return value;
    };
    const amount = numeric(values.gstAmount, 'amount', 1000000000000);
    if (!['0', '0.25', '3', '5', '12', '18', '28', 'custom'].includes(values.gstRate)) throw new Error('Select a GST rate.');
    const rate = numeric(values.gstRate === 'custom' ? values.gstCustomRate : values.gstRate, 'GST rate', 100);
    if (!['add', 'remove'].includes(values.gstMode) || !['intra', 'inter'].includes(values.gstTaxType)) throw new Error('Select a calculation mode and tax type.');
    const base = values.gstMode === 'remove' ? amount / (1 + rate / 100) : amount;
    const gst = values.gstMode === 'remove' ? amount - base : base * rate / 100;
    const total = values.gstMode === 'remove' ? amount : base + gst;
    return { base, gst, total, rate };
}

function readNumber(value, message) {
    const number = parseFloat(value);
    if (Number.isNaN(number)) throw new Error(message);
    return number;
}

function readGreaterThanZero(value, message) {
    const number = readNumber(value, message);
    if (number <= 0) throw new Error(message);
    return number;
}

function readPositiveOrZero(value, message) {
    const number = readNumber(value === '' || value === undefined ? '0' : value, message);
    if (number < 0) throw new Error(message);
    return number;
}

function dynamicResult(display, rows, copyText = '') {
    return { display, rows, copyText: copyText || rows.map(([label, value]) => `${label}: ${value}`).join('\n') };
}

function buildUtcOffsetOptions() {
    const options = [];
    for (let offset = -12; offset <= 14; offset += 0.5) {
        options.push([String(offset), formatUtcOffset(offset)]);
    }
    return options;
}

function formatUtcOffset(offset) {
    const sign = offset >= 0 ? '+' : '-';
    const abs = Math.abs(offset);
    const hours = String(Math.floor(abs)).padStart(2, '0');
    const minutes = String(Math.round((abs % 1) * 60)).padStart(2, '0');
    return `UTC${sign}${hours}:${minutes}`;
}

function randomIndex(length) {
    if (window.crypto && window.crypto.getRandomValues) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] % length;
    }
    return Math.floor(Math.random() * length);
}

function shuffleString(value) {
    const chars = value.split('');
    for (let index = chars.length - 1; index > 0; index -= 1) {
        const swapIndex = randomIndex(index + 1);
        [chars[index], chars[swapIndex]] = [chars[swapIndex], chars[index]];
    }
    return chars.join('');
}

function generateUuidV4() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
        const random = randomIndex(16);
        const value = char === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    });
}

function renderDynamicField(field) {
    if (field.type === 'radio') {
        return `<fieldset class="gst-mode dynamic-wide"><legend>${field.label}</legend>${field.options.map(([value, label]) => `<label><input type="radio" name="dynamic-${field.id}" value="${value}" ${value === field.value ? 'checked' : ''}> ${label}</label>`).join('')}</fieldset>`;
    }
    if (field.type === 'checkbox') {
        return `<label class="field-group dynamic-check">
            <input type="checkbox" id="dynamic-${field.id}" ${field.checked ? 'checked' : ''}>
            <span>${field.label}</span>
        </label>`;
    }

    if (field.type === 'select') {
        return `<label class="field-group">
            <span>${field.label}</span>
            <select id="dynamic-${field.id}" class="unit-select">
                ${field.options.map(([value, label]) => `<option value="${value}"${value === field.value ? ' selected' : ''}>${label}</option>`).join('')}
            </select>
        </label>`;
    }

    if (field.type === 'textarea') {
        return `<label class="field-group dynamic-wide">
            <span>${field.label}</span>
            <textarea id="dynamic-${field.id}" class="unit-input dynamic-textarea" placeholder="${field.placeholder || ''}">${field.value || ''}</textarea>
        </label>`;
    }

    return `<label class="field-group">
        <span>${field.label}</span>
        <input type="${field.type || 'number'}" id="dynamic-${field.id}" class="unit-input" placeholder="${field.placeholder || ''}" ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''} ${field.step ? `step="${field.step}"` : ''} value="${field.value || ''}">
    </label>`;
}

function renderHelpContent(definition, calculator) {
    return `
        <h3>About the ${getCalculatorTitle(calculator)}</h3>
        <p>${definition.help.what}</p>
        <h4>How to use it</h4>
        <p>${definition.help.how}</p>
        <h4>Formula / Explanation</h4>
        <p>${definition.help.formula}</p>
        <h4>Example</h4>
        <p>${definition.help.example}</p>
        <div class="calculator-faq">
            ${definition.help.faqs.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join('')}
        </div>
    `;
}

function renderDynamicTool(calculator) {
    const definition = dynamicToolDefinitions[calculator.dynamicTool];
    if (!definition) return;

    document.getElementById('dynamicToolTitle').textContent = getCalculatorTitle(calculator);
    document.getElementById('dynamicToolDescription').textContent = definition.description;
    document.getElementById('dynamicToolDisplay').value = '';
    document.getElementById('dynamicToolHelp').innerHTML = renderHelpContent(definition, calculator);
    document.getElementById('dynamicToolForm').innerHTML = `
        ${definition.fields.map(renderDynamicField).join('')}
        <button class="button operator" onclick="calculateDynamicTool()">${definition.primaryAction || 'Calculate'}</button>
        <button class="button operator" onclick="clearDynamicTool()">Clear</button>
        ${definition.copy ? '<button class="button operator copy-button" onclick="copyDynamicToolResult()">Copy</button>' : ''}
        <div class="finance-result dynamic-wide" id="dynamicToolResult" aria-live="polite">
            <p class="finance-message" id="dynamicToolMessage">Enter values and calculate the result.</p>
        </div>
    `;
}

function getDynamicToolValues(definition) {
    return definition.fields.reduce((values, field) => {
        if (field.type === 'radio') {
            values[field.id] = document.querySelector(`input[name="dynamic-${field.id}"]:checked`)?.value || '';
            return values;
        }
        const input = document.getElementById(`dynamic-${field.id}`);
        values[field.id] = field.type === 'checkbox' ? input.checked : input.value;
        return values;
    }, {});
}

function showDynamicMessage(message, isError = false) {
    const display = document.getElementById('dynamicToolDisplay');
    const result = document.getElementById('dynamicToolResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (result) {
        result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}" id="dynamicToolMessage">${message}</p>`;
    }
    latestDynamicToolCopyText = '';
}

function renderDynamicResult(result) {
    const display = document.getElementById('dynamicToolDisplay');
    const resultBox = document.getElementById('dynamicToolResult');
    if (display) display.value = result.display;
    if (resultBox) {
        resultBox.innerHTML = `<dl>
            ${result.rows.map(([label, value, highlight]) => `<div class="${highlight ? 'highlight' : ''}"><dt>${label}</dt><dd>${value}</dd></div>`).join('')}
        </dl>${result.copyText ? '<p class="finance-copy-status" id="dynamicToolCopyStatus"></p>' : ''}`;
    }
    latestDynamicToolCopyText = result.copyText || '';
}

let latestDynamicToolCopyText = '';

function calculateDynamicTool() {
    const calculator = getCalculatorByTarget(activeDisplay);
    const definition = calculator ? dynamicToolDefinitions[calculator.dynamicTool] : null;
    if (!definition) return;
    try {
        renderDynamicResult(definition.calculate(getDynamicToolValues(definition)));
    } catch (error) {
        showDynamicMessage(error.message || 'Please check your inputs and try again.', true);
    }
}

function clearDynamicTool() {
    const calculator = getCalculatorByTarget(activeDisplay);
    if (calculator) renderDynamicTool(calculator);
}

function setDynamicCopyStatus(message, isError = false) {
    const status = document.getElementById('dynamicToolCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function copyDynamicToolResult() {
    if (!latestDynamicToolCopyText) {
        showDynamicMessage('Please generate or calculate a result before copying.', true);
        return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestDynamicToolCopyText)
            .then(() => setDynamicCopyStatus('Result copied to clipboard.'))
            .catch(() => setDynamicCopyStatus('Copy failed. Please try again.', true));
        return;
    }
    const textArea = document.createElement('textarea');
    textArea.value = latestDynamicToolCopyText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setDynamicCopyStatus('Result copied to clipboard.');
}

function getCalculatorBySlug(slug) {
    return calculatorData.find(calculator => calculator.slug === slug);
}

function getCalculatorTitle(calculator) {
    return calculator.title || calculator.name;
}

function getCleanSlugFromPath() {
    const path = window.location.pathname.replace(/\/index\.html$/, '').replace(/^\/+|\/+$/g, '').toLowerCase();
    if (!path || path === 'index.html') return '';
    return path.split('/').pop();
}

function getSlugFromHash() {
    return window.location.hash.replace(/^#\/?/, '').trim().toLowerCase();
}

function getInitialCalculatorFromUrl() {
    const pathSlug = getCleanSlugFromPath();
    if (pathSlug) return getCalculatorBySlug(pathSlug);

    const hashSlug = getSlugFromHash();
    if (hashSlug) {
        return getCalculatorBySlug(hashSlug) || calculatorData.find(calculator => calculator.elementId === hashSlug);
    }

    return null;
}

function isUnknownCleanRoute() {
    const pathSlug = getCleanSlugFromPath();
    return Boolean(pathSlug && !getCalculatorBySlug(pathSlug));
}

function canUseCleanUrls() {
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}

function getCalculatorUrl(calculator) {
    if (!calculator?.slug) return '/';
    return canUseCleanUrls() ? `/${calculator.slug}/` : `#${calculator.slug}`;
}

function getAbsoluteCalculatorUrl(calculator) {
    return calculator?.slug ? `${SITE_ORIGIN}/${calculator.slug}/` : `${SITE_ORIGIN}/`;
}

function getCanonicalUrl(calculator) {
    return getAbsoluteCalculatorUrl(calculator);
}

function updateMetaContent(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute('content', value);
}

function ensureMetaContent(attribute, key, value) {
    let element = document.querySelector(`meta[${attribute}="${key}"]`);
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }
    element.setAttribute('content', value);
}

function setRobotsIndexing(shouldIndex = true) {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
    }
    robots.setAttribute('content', shouldIndex ? 'index,follow' : 'noindex,follow');
}

function updateCanonical(calculator) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = getCanonicalUrl(calculator);
}

function updateBreadcrumbSchema(calculator) {
    const schemaId = 'calculatorBreadcrumbSchema';
    let schema = document.getElementById(schemaId);

    if (!calculator) {
        if (schema) schema.remove();
        return;
    }

    if (!schema) {
        schema = document.createElement('script');
        schema.type = 'application/ld+json';
        schema.id = schemaId;
        document.head.appendChild(schema);
    }

    const title = getCalculatorTitle(calculator);
    schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${SITE_ORIGIN}/`
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: calculator.category,
                item: `${SITE_ORIGIN}/#${CATEGORY_ANCHORS[calculator.category] || 'calculator-categories'}`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: title,
                item: getCanonicalUrl(calculator)
            }
        ]
    });
}

function updateSeoMeta(calculator) {
    const calculatorTitle = calculator ? getCalculatorTitle(calculator) : '';
    const title = calculator?.seoTitle || (calculatorTitle ? `${calculatorTitle} | OnlineCalMaster` : HOME_TITLE);
    const description = calculator?.metaDescription || (calculatorTitle ? `Use the free ${calculatorTitle} by OnlineCalMaster for fast, accurate, mobile-friendly calculations.` : HOME_DESCRIPTION);
    const canonicalUrl = getCanonicalUrl(calculator);

    document.title = title;
    setRobotsIndexing(true);
    ensureMetaContent('name', 'description', description);
    ensureMetaContent('property', 'og:title', title);
    ensureMetaContent('property', 'og:description', description);
    ensureMetaContent('property', 'og:url', canonicalUrl);
    ensureMetaContent('property', 'og:image', SOCIAL_IMAGE_URL);
    ensureMetaContent('property', 'og:type', 'website');
    ensureMetaContent('property', 'og:site_name', 'OnlineCalMaster');
    ensureMetaContent('name', 'twitter:card', 'summary');
    ensureMetaContent('name', 'twitter:title', title);
    ensureMetaContent('name', 'twitter:description', description);
    ensureMetaContent('name', 'twitter:image', SOCIAL_IMAGE_URL);
    updateCanonical(calculator);
    updateBreadcrumbSchema(calculator);
    const heroHeading = document.querySelector('.compact-hero h1');
    if (heroHeading) heroHeading.textContent = calculator ? calculatorTitle : 'Free Online Calculators & Smart Tools';
    const heroIntro = document.querySelector('.hero-subtitle');
    if (heroIntro) heroIntro.textContent = calculator ? getCalculatorIntroduction(calculator) : 'Fast, accurate, and easy-to-use online calculators for finance, business, education, health, dates, time, and daily calculations.';
    const homepageInformation = document.querySelector('.homepage-seo');
    if (homepageInformation) homepageInformation.hidden = Boolean(calculator);
    if (calculator) document.getElementById('homepageFaqSchema')?.remove();
    else if (homepageFaqJson && !document.getElementById('homepageFaqSchema')) {
        const faq = document.createElement('script');
        faq.type = 'application/ld+json';
        faq.id = 'homepageFaqSchema';
        faq.textContent = homepageFaqJson;
        document.head.appendChild(faq);
    }
    const applicationSchema = document.getElementById('calculatorApplicationSchema');
    if (applicationSchema) applicationSchema.textContent = JSON.stringify(getCalculatorApplicationSchema(calculator));
}

function trackPageView(calculator) {
    const path = calculator?.slug ? `/${calculator.slug}/` : '/';
    if (path === lastTrackedPath) return;
    lastTrackedPath = path;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
        window.gtag = function gtag() {
            window.dataLayer.push(arguments);
        };
    }

    window.gtag('config', GA_MEASUREMENT_ID, {
        page_title: document.title,
        page_location: getCanonicalUrl(calculator),
        page_path: path,
        send_page_view: true
    });
}

function runSeoDiagnostics(calculator) {
    const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
    if (!isLocal) return;

    const warnings = [];
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!description) warnings.push('Missing meta description.');
    if (!canonical) warnings.push('Missing canonical URL.');
    if (calculator?.slug && !slugPattern.test(calculator.slug)) warnings.push(`Invalid calculator slug: ${calculator.slug}`);
    if (canonical && !canonical.startsWith(SITE_ORIGIN)) warnings.push(`Canonical does not use production origin: ${canonical}`);

    if (warnings.length) {
        console.warn('[OnlineCalMaster SEO diagnostics]', warnings.join(' '));
    }
}

function updateBrowserUrl(calculator, replace = false) {
    if (!window.history || !calculator) return;
    const nextUrl = getCalculatorUrl(calculator);
    const currentPath = `${window.location.pathname}${window.location.hash}`;
    if (currentPath === nextUrl) return;

    const state = { calculator: calculator.target };
    if (replace) {
        window.history.replaceState(state, '', nextUrl);
    } else {
        window.history.pushState(state, '', nextUrl);
    }
}

function getFilteredCalculators() {
    const searchInput = document.getElementById('calculatorSearch');
    const categorySelect = document.getElementById('calculatorCategory');
    const searchTerm = (searchInput?.value || '').trim().toLowerCase();
    const selectedCategory = categorySelect?.value || 'All Calculators';

    return calculatorData.filter(calculator => {
        const matchesSearch = `${getCalculatorTitle(calculator)} ${calculator.category}`.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'All Calculators' || calculator.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
}

function createCalculatorLink(calculator, className = 'calculator-chip') {
    const link = document.createElement('a');
    link.className = className;
    link.href = getCalculatorUrl(calculator);
    link.textContent = getCalculatorTitle(calculator);
    link.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        showCalculator(calculator.target);
        scrollCalculatorIntoView();
    });
    return link;
}

function getRelatedCalculators(calculator) {
    if (!calculator) return [];
    const overrideTargets = RELATED_OVERRIDES[calculator.target] || [];
    const related = overrideTargets
        .map(target => getCalculatorByTarget(target))
        .filter(Boolean);

    const sameCategory = calculatorData.filter(item =>
        item.target !== calculator.target &&
        item.category === calculator.category &&
        !related.some(existing => existing.target === item.target)
    );

    const otherUseful = calculatorData.filter(item =>
        item.target !== calculator.target &&
        !related.some(existing => existing.target === item.target) &&
        !sameCategory.some(existing => existing.target === item.target)
    );

    return [...related, ...sameCategory, ...otherUseful].slice(0, 5);
}

function getRecentCalculatorTargets() {
    try {
        const parsed = JSON.parse(localStorage.getItem(RECENT_CALCULATORS_KEY) || '[]');
        return Array.isArray(parsed) ? parsed.filter(target => getCalculatorByTarget(target)).slice(0, 5) : [];
    } catch {
        return [];
    }
}

function rememberCalculator(target) {
    const recent = [target, ...getRecentCalculatorTargets().filter(item => item !== target)].slice(0, 5);
    localStorage.setItem(RECENT_CALCULATORS_KEY, JSON.stringify(recent));
}

function renderBreadcrumb(calculator) {
    const breadcrumb = document.getElementById('calculatorBreadcrumb');
    if (!breadcrumb || !calculator) return;
    const home = document.createElement('a');
    home.href = '/';
    home.textContent = 'Home';

    const category = document.createElement('a');
    category.href = `/#${CATEGORY_ANCHORS[calculator.category] || 'calculator-categories'}`;
    category.textContent = calculator.category;

    const current = document.createElement('span');
    current.textContent = getCalculatorTitle(calculator);
    current.setAttribute('aria-current', 'page');

    breadcrumb.replaceChildren(home, category, current);
}

function renderRelatedCalculators(calculator) {
    const relatedElement = document.getElementById('relatedCalculators');
    if (!relatedElement) return;
    const related = getRelatedCalculators(calculator);
    relatedElement.replaceChildren(...related.map(item => createCalculatorLink(item)));
}

function renderRecentCalculators(activeTarget) {
    const recentElement = document.getElementById('recentCalculators');
    if (!recentElement) return;
    const recent = getRecentCalculatorTargets()
        .filter(target => target !== activeTarget)
        .map(target => getCalculatorByTarget(target))
        .filter(Boolean)
        .slice(0, 5);

    if (!recent.length) {
        const empty = document.createElement('span');
        empty.className = 'calculator-chip is-muted';
        empty.textContent = 'No recent calculators yet';
        recentElement.replaceChildren(empty);
        return;
    }

    recentElement.replaceChildren(...recent.map(item => createCalculatorLink(item)));
}

function renderCalculatorNavigation(calculator) {
    renderBreadcrumb(calculator);
    renderRelatedCalculators(calculator);
    renderRecentCalculators(calculator.target);
}

function scrollCalculatorIntoView() {
    const container = document.querySelector('.calculator-container');
    if (container && window.matchMedia && window.matchMedia('(max-width: 900px)').matches) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function setShareStatus(message, isError = false) {
    const status = document.getElementById('calculatorShareStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
    clearTimeout(latestShareStatusTimer);
    latestShareStatusTimer = setTimeout(() => {
        status.textContent = '';
        status.classList.remove('is-error');
    }, 3500);
}

function getCurrentCalculatorShareUrl() {
    return getAbsoluteCalculatorUrl(getCalculatorByTarget(activeDisplay));
}

function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    return Promise.resolve();
}

function copyCurrentCalculatorUrl() {
    copyTextToClipboard(getCurrentCalculatorShareUrl())
        .then(() => setShareStatus('Calculator URL copied.'))
        .catch(() => setShareStatus('Copy failed. Please try again.', true));
}

function shareCurrentCalculatorUrl() {
    const calculator = getCalculatorByTarget(activeDisplay);
    const shareData = {
        title: calculator ? `${getCalculatorTitle(calculator)} | OnlineCalMaster` : HOME_TITLE,
        text: calculator?.metaDescription || HOME_DESCRIPTION,
        url: getCurrentCalculatorShareUrl()
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => setShareStatus('Share dialog opened.'))
            .catch(() => copyCurrentCalculatorUrl());
        return;
    }

    copyCurrentCalculatorUrl();
}

function updateCalculatorCount(count) {
    const countElement = document.getElementById('calculatorCount');
    if (!countElement) return;
    countElement.textContent = `Showing ${count} ${count === 1 ? 'calculator' : 'calculators'}`;
}

const NAV_GROUPS = [['Education','Basic & Math / Education'],['Finance','Finance'],['Business','Business'],['Health','Health'],['Date & Time','Date & Time'],['Daily Tools','Daily Tools'],['Unit Conversion','Conversion'],['Developer Tools','Developer Tools']];
function resetCalculatorFilters() {
 document.getElementById('calculatorSearch').value = '';
 document.getElementById('calculatorCategory').value = 'All Calculators';
 renderCalculatorList();
}
function renderCalculatorList() {
 const list = document.getElementById('calculatorList');
 if (!list) return;
 const filtered = getFilteredCalculators();
 updateCalculatorCount(filtered.length);
 list.replaceChildren();
 if (!filtered.length) { const p=document.createElement('p'); p.className='calculator-empty'; p.textContent='No calculators found. Try another search.'; list.append(p); }
 NAV_GROUPS.forEach(([category,label]) => {
  const items=filtered.filter(c=>c.category===category); if(!items.length) return;
  const group=document.createElement('section'); group.className='navigation-group';
  const heading=document.createElement('h2'); heading.textContent=label; group.append(heading);
  items.forEach(c=>{const link=createCalculatorLink(c,'calculator-nav-link'); link.dataset.target=c.target; link.classList.toggle('is-active',c.target===activeDisplay); if(c.target===activeDisplay) link.setAttribute('aria-current','page'); group.append(link);});
  list.append(group);
 });
}

function initializeCalculatorPanel() {
    const searchInput = document.getElementById('calculatorSearch');
    const categorySelect = document.getElementById('calculatorCategory');
    if (searchInput) searchInput.addEventListener('input', renderCalculatorList);
    if (categorySelect) categorySelect.addEventListener('change', renderCalculatorList);
    renderCalculatorList();
}

function initializeApp() {
    if (appInitialized) return;
    appInitialized = true;
    const panels = document.getElementById('calculatorPanels');
    if (panels) {
        panels.before(panels.content.cloneNode(true));
        panels.remove();
    }

    display = document.getElementById('display');
    displayScientific = document.getElementById('displayScientific');

    initializeCalculatorPanel();
    const initialCalculator = getInitialCalculatorFromUrl();
    if (initialCalculator) {
        showCalculator(initialCalculator.target, { replace: true });
    } else {
        showCalculator('basic', { updateUrl: false, updateMeta: false, track: false });
        updateSeoMeta(null);
        if (isUnknownCleanRoute()) setRobotsIndexing(false);
        trackPageView(null);
        if (getCleanSlugFromPath() && window.history) {
            window.history.replaceState({}, '', canUseCleanUrls() ? '/' : window.location.pathname);
        }
    }
    if (document.getElementById('unitCategory')) updateUnits();

    // Apply saved theme
    applySavedTheme();

    document.body.classList.remove('app-loading');
}

// Initialize as soon as DOM is ready so external web scripts do not delay the calculator.
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('load', initializeApp);

// === DARK MODE TOGGLE === //
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    updateDarkModeButtonText(body.classList.contains('dark-mode'));
}

function updateDarkModeButtonText(isDark) {
    const toggleLink = document.getElementById('darkModeToggle');
    if (!toggleLink) return;
    toggleLink.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

function applySavedTheme() {
 const saved=localStorage.getItem('theme');
 const isDark=saved==='dark' || (saved!=='light' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
 document.body.classList.toggle('dark-mode', Boolean(isDark));
 updateDarkModeButtonText(Boolean(isDark));
}
// ======================= //

// Show selected calculator and hide others
function showCalculator(type, options = {}) {
    document.querySelectorAll('.calculator').forEach(calculator => {
        calculator.style.display = 'none';
        calculator.classList.remove('tall', 'extra-tall');
    });

    const calculator = getCalculatorByTarget(type);
    if (!calculator) {
        showCalculator('basic', { replace: true });
        return;
    }

    const selectedCalculator = document.getElementById(calculator.elementId);
    if (!selectedCalculator) return;

    if (calculator.dynamicTool) {
        renderDynamicTool(calculator);
    }

    selectedCalculator.style.display = 'block';

    if (calculator.heightClass) {
        selectedCalculator.classList.add(calculator.heightClass);
    }

    const titleElement = selectedCalculator.querySelector('.calculator-title');
    if (titleElement) {
        titleElement.textContent = calculator.title || calculator.name;
    }

    activeDisplay = type;
    rememberCalculator(type);
    if (options.updateMeta !== false) {
        updateSeoMeta(calculator);
    }
    if (options.updateUrl !== false) {
        updateBrowserUrl(calculator, options.replace === true);
    }
    if (options.track !== false) trackPageView(calculator);
    runSeoDiagnostics(calculator);
    renderCalculatorNavigation(calculator);
    renderCalculatorContext(calculator);
    renderCalculatorList();
    closeCalculatorNavigation();
}

window.addEventListener('popstate', () => {
    const calculator = getInitialCalculatorFromUrl();
    if (calculator) {
        showCalculator(calculator.target, { updateUrl: false });
    } else {
        showCalculator('basic', { updateUrl: false, updateMeta: false, track: false });
        updateSeoMeta(null);
        trackPageView(null);
        runSeoDiagnostics(null);
    }
});

// Get current input display
function getCurrentDisplay() {
    return activeDisplay === 'scientific' ? displayScientific : display;
}

// Append to display
function appendToDisplay(value) {
    const input = getCurrentDisplay();
    const lastFuncPattern = /Math\.\w+$/;
    if (lastFuncPattern.test(input.value)) {
        input.value = input.value.replace(lastFuncPattern, value);
    } else {
        input.value += value;
    }
}

// Clear current display
function clearDisplay() {
    getCurrentDisplay().value = '';
}

// Delete last character
function deleteLast() {
    const input = getCurrentDisplay();
    input.value = input.value.slice(0, -1);
}

// Evaluate expression safely
function calculate() {
    try {
        let expression = getCurrentDisplay().value
            .replace(/(?<![.\w])sqrt/g, 'Math.sqrt');

        // Balance parentheses
        let openParens = (expression.match(/\(/g) || []).length;
        let closeParens = (expression.match(/\)/g) || []).length;
        while (closeParens < openParens) {
            expression += ')';
            closeParens++;
        }

        const result = safeEval(expression);
        if (result !== undefined) {
            getCurrentDisplay().value = result;
            addToHistory(expression, result);
        } else {
            getCurrentDisplay().value = 'Error';
        }
    } catch (error) {
        console.error("Calculation error:", error.message);
        getCurrentDisplay().value = 'Error';
    }
}

// Safe evaluator without eval()
function safeEval(expr) {
    // You can integrate a math parser library like math.js for production
    try {
        return Function('"use strict";return (' + expr + ')')();
    } catch (e) {
        throw new Error('Invalid expression');
    }
}

// Add calculation to history
function addToHistory(input, output) {
    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history.push({ input, output });
    localStorage.setItem('calcHistory', JSON.stringify(history));
}

// Memory Functions
function memoryAdd() {
    try {
        const result = safeEval(getCurrentDisplay().value);
        memory += isNaN(result) ? 0 : result;
    } catch {}
}

function memorySubtract() {
    try {
        const result = safeEval(getCurrentDisplay().value);
        memory -= isNaN(result) ? 0 : result;
    } catch {}
}

function memoryRecall() {
    getCurrentDisplay().value = memory.toString();
}

// Copy result to clipboard
function copyResult() {
    const result = getCurrentDisplay().value;
    navigator.clipboard.writeText(result).then(() => {
        alert("Copied to clipboard!");
    }).catch(err => {
        console.error("Copy failed:", err);
    });
}

// Show keyboard shortcuts modal
function showKeyboardShortcutsModal() {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '20px';
    modal.style.right = '20px';
    modal.style.background = '#fff';
    modal.style.borderRadius = '10px';
    modal.style.padding = '15px';
    modal.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    modal.style.zIndex = '9999';
    modal.style.fontFamily = 'Tahoma';
    modal.style.maxWidth = '300px';
    modal.style.animation = 'fadeIn 0.3s ease-in-out';

    modal.innerHTML = `
        <h3 style="margin-top: 0; font-size: 16px;">ðŸ’¡ Keyboard Shortcuts</h3>
        <ul style="list-style: none; padding-left: 0;">
            <li><strong>Enter</strong>: Calculate</li>
            <li><strong>Backspace</strong>: Delete last character</li>
            <li><strong>C</strong>: Clear display</li>
            <li><strong>M</strong>: Recall memory</li>
            <li><strong>^</strong>: Exponentiation</li>
            <li><strong>+</strong>, <strong>-</strong>, <strong>*</strong>, <strong>/</strong>: Operators</li>
        </ul>
        <button onclick="this.parentNode.remove()" style="background:#3867d6;color:#fff;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">Close</button>
    `;

    document.body.appendChild(modal);

    // Fade-in animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);
}

// UNIT CONVERTER LOGIC
const units = {
    length: {
        'Meter': 1,
        'Kilometer': 0.001,
        'Centimeter': 100,
        'Millimeter': 1000,
        'Mile': 0.000621371,
        'Yard': 1.09361,
        'Foot': 3.28084,
        'Inch': 39.3701
    },
    weight: {
        'Kilogram': 1,
        'Gram': 1000,
        'Milligram': 1000000,
        'Pound': 2.20462,
        'Ounce': 35.274
    },
    temperature: {
        'Celsius': 'C',
        'Fahrenheit': 'F',
        'Kelvin': 'K'
    }
};

function updateUnits() {
    const category = document.getElementById('unitCategory').value;
    const fromSelect = document.getElementById('unitFrom');
    const toSelect = document.getElementById('unitTo');
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    Object.keys(units[category]).forEach(unit => {
        const symbolMap = {
            length: 'm',
            weight: 'kg',
            temperature: 'deg'
        };
        const symbol = symbolMap[category] || '';
        const optionFrom = document.createElement('option');
        optionFrom.value = unit;
        optionFrom.text = `${unit} (${symbol})`;
        fromSelect.appendChild(optionFrom);
        const optionTo = document.createElement('option');
        optionTo.value = unit;
        optionTo.text = `${unit} (${symbol})`;
        toSelect.appendChild(optionTo);
    });
}

function convertUnit() {
    const input = parseFloat(document.getElementById('unitInput').value);
    const from = document.getElementById('unitFrom').value;
    const to = document.getElementById('unitTo').value;
    const category = document.getElementById('unitCategory').value;

    if (isNaN(input)) {
        document.getElementById('unitDisplay').value = "Invalid input";
        return;
    }

    let result;
    if (category === 'temperature') {
        if (from === to) {
            result = input;
        } else if (from === 'Celsius') {
            result = to === 'Fahrenheit' ? (input * 9 / 5) + 32 : input + 273.15;
        } else if (from === 'Fahrenheit') {
            result = to === 'Celsius' ? (input - 32) * 5 / 9 : (input - 32) * 5 / 9 + 273.15;
        } else if (from === 'Kelvin') {
            result = to === 'Celsius' ? input - 273.15 : (input - 273.15) * 9 / 5 + 32;
        }
    } else {
        const baseValue = input / units[category][from];
        result = baseValue * units[category][to];
    }

    document.getElementById('unitDisplay').value = `${input} ${from} = ${result.toFixed(4)} ${to}`;
}

function clearUnit() {
    document.getElementById('unitInput').value = '';
    document.getElementById('unitDisplay').value = '';
}

// AGE CALCULATOR
function calculateAge() {
    const birthDateInput = document.getElementById('birthDateInput').value;
    const display = document.getElementById('ageDisplay');
    if (!birthDateInput) {
        display.value = "Please select a date.";
        return;
    }
    const birthDate = new Date(birthDateInput);
    const today = new Date();
    if (birthDate > today) {
        display.value = "Future dates not allowed";
        return;
    }
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += prevMonth;
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    display.value = `${years} year(s), ${months} month(s), ${days} day(s)`;
    calculateNextBirthday(birthDate);
}

function calculateNextBirthday(birthDate) {
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const diff = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    const display = document.getElementById('nextBirthdayDisplay');
    display.innerText = `ðŸŽ‰ Next birthday in ${diff} day${diff !== 1 ? 's' : ''}`;
}

function clearAge() {
    document.getElementById('birthDateInput').value = '';
    document.getElementById('ageDisplay').value = '';
    document.getElementById('nextBirthdayDisplay').innerText = '';
}

// DATE DIFFERENCE
function calculateDateDiff() {
    const value1 = document.getElementById('date1Input').value;
    const value2 = document.getElementById('date2Input').value;
    const date1 = new Date(value1);
    const date2 = new Date(value2);
    const display = document.getElementById('dateDiffDisplay');
    // Reject missing, malformed and rolled-over dates (for example February 30).
    const isValidDate = (value, date) => {
        const parts = /^(\d{4,})-(\d{2})-(\d{2})$/.exec(value);
        return parts && Number(parts[1]) > 0 && Number.isFinite(date.getTime()) &&
            date.getUTCFullYear() === Number(parts[1]) &&
            date.getUTCMonth() + 1 === Number(parts[2]) &&
            date.getUTCDate() === Number(parts[3]);
    };
    if (!isValidDate(value1, date1) || !isValidDate(value2, date2)) {
        display.value = "Please select two valid dates.";
        return;
    }
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    display.value = `${diffDays} day(s)`;
}

function clearDateDiff() {
    document.getElementById('date1Input').value = '';
    document.getElementById('date2Input').value = '';
    document.getElementById('dateDiffDisplay').value = '';
}

// TIME DIFFERENCE
function calculateTimeDiff() {
    const time1 = new Date(document.getElementById('time1Input').value);
    const time2 = new Date(document.getElementById('time2Input').value);
    const displayFull = document.getElementById('timeDiffFull');
    const displayMinutes = document.getElementById('timeDiffMinutes');
    const displaySeconds = document.getElementById('timeDiffSeconds');
    if (!time1 || !time2) {
        displayFull.innerText = 'Please select both times';
        displayMinutes.innerText = '';
        displaySeconds.innerText = '';
        return;
    }
    const diffMs = Math.abs(time2 - time1);
    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;
    displayFull.innerText = `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
    displayMinutes.innerText = `Total Minutes: ${totalMinutes}`;
    displaySeconds.innerText = `Total Seconds: ${totalSeconds}`;
}

function clearTimeDiff() {
    document.getElementById('time1Input').value = '';
    document.getElementById('time2Input').value = '';
    document.getElementById('timeDiffFull').innerText = '';
    document.getElementById('timeDiffMinutes').innerText = '';
    document.getElementById('timeDiffSeconds').innerText = '';
}

// PERCENTAGE CALCULATOR
function calculatePercentage() {
    const value = parseFloat(document.getElementById('percentValue').value);
    const percent = parseFloat(document.getElementById('percentPercent').value);
    const display = document.getElementById('percentageDisplay');
    if (isNaN(value) || isNaN(percent)) {
        display.value = "Invalid input";
        return;
    }
    display.value = `${(value * percent / 100).toFixed(2)} (${percent}% of ${value})`;
}

function clearPercentage() {
    document.getElementById('percentValue').value = '';
    document.getElementById('percentPercent').value = '';
    document.getElementById('percentageDisplay').value = '';
}

// PERCENTAGE CHANGE
function calculatePercentageChange() {
    const oldVal = parseFloat(document.getElementById('oldValue').value);
    const newVal = parseFloat(document.getElementById('newValue').value);
    const display = document.getElementById('percentageChangeDisplay');
    if (isNaN(oldVal) || isNaN(newVal)) {
        display.value = "Invalid input";
        return;
    }
    if (oldVal === 0) {
        display.value = "Old value must not be zero.";
        return;
    }
    const change = ((newVal - oldVal) / oldVal) * 100;
    display.value = `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
}

function clearPercentageChange() {
    document.getElementById('oldValue').value = '';
    document.getElementById('newValue').value = '';
    document.getElementById('percentageChangeDisplay').value = '';
}

// TIP CALCULATOR
function calculateTip() {
    const bill = parseFloat(document.getElementById('billAmount').value);
    const tip = parseFloat(document.getElementById('tipPercent').value);
    const display = document.getElementById('tipDisplay');
    if (isNaN(bill) || isNaN(tip)) {
        display.value = "Invalid input";
        return;
    }
    const tipAmount = bill * (tip / 100);
    display.value = `Tip: $${tipAmount.toFixed(2)} | Total: $${(bill + tipAmount).toFixed(2)}`;
}

function clearTip() {
    document.getElementById('billAmount').value = '';
    document.getElementById('tipPercent').value = '';
    document.getElementById('tipDisplay').value = '';
}

// VAT / DISCOUNT
function addVat() {
    const value = parseFloat(document.getElementById('vatValue').value);
    const rate = parseFloat(document.getElementById('vatPercent').value);
    const display = document.getElementById('vatDisplay');
    if (isNaN(value) || isNaN(rate)) {
        display.value = "Invalid input";
        return;
    }
    const total = value * (1 + rate / 100);
    display.value = `${value} + ${rate}% = ${total.toFixed(2)}`;
}

function removeVat() {
    const value = parseFloat(document.getElementById('vatValue').value);
    const rate = parseFloat(document.getElementById('vatPercent').value);
    const display = document.getElementById('vatDisplay');
    if (isNaN(value) || isNaN(rate)) {
        display.value = "Invalid input";
        return;
    }
    const original = value / (1 + rate / 100);
    display.value = `${value} - ${rate}% = ${original.toFixed(2)}`;
}

// LOAN EMI CALCULATOR
let latestLoanEmiResultText = '';

function formatLoanCurrency(value) {
    return `Rs. ${Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function setLoanEmiMessage(message, isError = false) {
    const display = document.getElementById('loanEmiDisplay');
    const result = document.getElementById('loanEmiResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="loan-emi-message${isError ? ' is-error' : ''}" id="loanEmiMessage">${message}</p>`;
    latestLoanEmiResultText = '';
}

function setLoanEmiCopyStatus(message, isError = false) {
    const status = document.getElementById('loanEmiCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function calculateLoanEmi() {
    const loanAmount = parseFloat(document.getElementById('loanAmountInput').value);
    const annualInterestRate = parseFloat(document.getElementById('loanInterestInput').value);
    const loanTerm = parseFloat(document.getElementById('loanTermInput').value);
    const termType = document.getElementById('loanTermType').value;
    const display = document.getElementById('loanEmiDisplay');
    const result = document.getElementById('loanEmiResult');

    if (isNaN(loanAmount) || loanAmount <= 0) {
        setLoanEmiMessage('Loan Amount must be greater than 0.', true);
        return;
    }

    if (isNaN(annualInterestRate) || annualInterestRate < 0) {
        setLoanEmiMessage('Interest Rate cannot be negative.', true);
        return;
    }

    if (isNaN(loanTerm) || loanTerm <= 0) {
        setLoanEmiMessage('Loan Term must be greater than 0.', true);
        return;
    }

    const numberOfMonths = termType === 'years' ? loanTerm * 12 : loanTerm;
    const monthlyRate = annualInterestRate / 12 / 100;
    const monthlyEmi = monthlyRate === 0
        ? loanAmount / numberOfMonths
        : loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) /
            (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    const totalPayment = monthlyEmi * numberOfMonths;
    const totalInterest = totalPayment - loanAmount;
    const formattedTerm = `${loanTerm} ${termType === 'years' ? (loanTerm === 1 ? 'Year' : 'Years') : (loanTerm === 1 ? 'Month' : 'Months')}`;

    display.value = formatLoanCurrency(monthlyEmi);

    const rows = [
        ['Monthly EMI', formatLoanCurrency(monthlyEmi), true],
        ['Total Payment', formatLoanCurrency(totalPayment)],
        ['Total Interest', formatLoanCurrency(totalInterest)],
        ['Loan Amount', formatLoanCurrency(loanAmount)],
        ['Interest Rate', `${annualInterestRate.toFixed(2)}%`],
        ['Loan Term', `${formattedTerm} (${numberOfMonths.toLocaleString('en-US')} months)`]
    ];

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
        <p class="loan-emi-copy-status" id="loanEmiCopyStatus"></p>
    `;

    latestLoanEmiResultText = rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

function clearLoanEmi() {
    document.getElementById('loanAmountInput').value = '';
    document.getElementById('loanInterestInput').value = '';
    document.getElementById('loanTermInput').value = '';
    document.getElementById('loanTermType').value = 'years';
    document.getElementById('loanEmiDisplay').value = '';
    setLoanEmiMessage('Enter loan details and calculate your monthly EMI.');
}

function copyLoanEmiResult() {
    if (!latestLoanEmiResultText) {
        setLoanEmiMessage('Please calculate EMI before copying the result.', true);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestLoanEmiResultText)
            .then(() => setLoanEmiCopyStatus('Loan EMI result copied to clipboard.'))
            .catch(() => setLoanEmiCopyStatus('Copy failed. Please try again.', true));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = latestLoanEmiResultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setLoanEmiCopyStatus('Loan EMI result copied to clipboard.');
}

// MORTGAGE CALCULATOR
let latestMortgageResultText = '';

function setMortgageMessage(message, isError = false) {
    const display = document.getElementById('mortgageDisplay');
    const result = document.getElementById('mortgageResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}" id="mortgageMessage">${message}</p>`;
    latestMortgageResultText = '';
}

function setMortgageCopyStatus(message, isError = false) {
    const status = document.getElementById('mortgageCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function calculateMortgage() {
    const homePrice = parseFloat(document.getElementById('homePriceInput').value);
    const downPayment = parseFloat(document.getElementById('downPaymentInput').value || '0');
    const annualInterestRate = parseFloat(document.getElementById('mortgageInterestInput').value);
    const loanTermYears = parseFloat(document.getElementById('mortgageTermInput').value);
    const annualPropertyTax = parseFloat(document.getElementById('propertyTaxInput').value || '0');
    const annualHomeInsurance = parseFloat(document.getElementById('homeInsuranceInput').value || '0');
    const display = document.getElementById('mortgageDisplay');
    const result = document.getElementById('mortgageResult');

    if (isNaN(homePrice) || homePrice <= 0) {
        setMortgageMessage('Home Price must be greater than 0.', true);
        return;
    }

    if (isNaN(downPayment) || downPayment < 0) {
        setMortgageMessage('Down Payment cannot be negative.', true);
        return;
    }

    if (downPayment >= homePrice) {
        setMortgageMessage('Down Payment must be less than the Home Price.', true);
        return;
    }

    if (isNaN(annualInterestRate) || annualInterestRate < 0) {
        setMortgageMessage('Interest Rate cannot be negative.', true);
        return;
    }

    if (isNaN(loanTermYears) || loanTermYears <= 0) {
        setMortgageMessage('Loan Term must be greater than 0.', true);
        return;
    }

    if (isNaN(annualPropertyTax) || annualPropertyTax < 0) {
        setMortgageMessage('Annual Property Tax cannot be negative.', true);
        return;
    }

    if (isNaN(annualHomeInsurance) || annualHomeInsurance < 0) {
        setMortgageMessage('Annual Home Insurance cannot be negative.', true);
        return;
    }

    const principal = homePrice - downPayment;
    const numberOfMonths = loanTermYears * 12;
    const monthlyRate = annualInterestRate / 12 / 100;
    const principalAndInterest = monthlyRate === 0
        ? principal / numberOfMonths
        : principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths) /
            (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
    const monthlyTax = annualPropertyTax / 12;
    const monthlyInsurance = annualHomeInsurance / 12;
    const totalMonthlyPayment = principalAndInterest + monthlyTax + monthlyInsurance;
    const totalPrincipalAndInterest = principalAndInterest * numberOfMonths;
    const totalInterest = totalPrincipalAndInterest - principal;
    const totalPayment = totalPrincipalAndInterest + annualPropertyTax * loanTermYears + annualHomeInsurance * loanTermYears;

    display.value = formatLoanCurrency(totalMonthlyPayment);

    const rows = [
        ['Monthly Payment', formatLoanCurrency(totalMonthlyPayment), true],
        ['Principal & Interest', formatLoanCurrency(principalAndInterest)],
        ['Monthly Property Tax', formatLoanCurrency(monthlyTax)],
        ['Monthly Insurance', formatLoanCurrency(monthlyInsurance)],
        ['Loan Amount', formatLoanCurrency(principal)],
        ['Down Payment', formatLoanCurrency(downPayment)],
        ['Total Interest', formatLoanCurrency(totalInterest)],
        ['Total Payment', formatLoanCurrency(totalPayment)],
        ['Interest Rate', `${annualInterestRate.toFixed(2)}%`],
        ['Loan Term', `${loanTermYears} ${loanTermYears === 1 ? 'Year' : 'Years'} (${numberOfMonths.toLocaleString('en-US')} months)`]
    ];

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
        <p class="finance-copy-status" id="mortgageCopyStatus"></p>
    `;

    latestMortgageResultText = rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

function clearMortgage() {
    document.getElementById('homePriceInput').value = '';
    document.getElementById('downPaymentInput').value = '';
    document.getElementById('mortgageInterestInput').value = '';
    document.getElementById('mortgageTermInput').value = '';
    document.getElementById('propertyTaxInput').value = '';
    document.getElementById('homeInsuranceInput').value = '';
    document.getElementById('mortgageDisplay').value = '';
    setMortgageMessage('Enter home loan details and calculate your monthly mortgage payment.');
}

function copyMortgageResult() {
    if (!latestMortgageResultText) {
        setMortgageMessage('Please calculate the mortgage payment before copying the result.', true);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestMortgageResultText)
            .then(() => setMortgageCopyStatus('Mortgage result copied to clipboard.'))
            .catch(() => setMortgageCopyStatus('Copy failed. Please try again.', true));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = latestMortgageResultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setMortgageCopyStatus('Mortgage result copied to clipboard.');
}

// COMPOUND INTEREST CALCULATOR
let latestCompoundInterestResultText = '';

function setCompoundInterestMessage(message, isError = false) {
    const display = document.getElementById('compoundInterestDisplay');
    const result = document.getElementById('compoundInterestResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}" id="compoundInterestMessage">${message}</p>`;
    latestCompoundInterestResultText = '';
}

function setCompoundInterestCopyStatus(message, isError = false) {
    const status = document.getElementById('compoundInterestCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function getCompoundingFrequencyLabel(frequency) {
    const labels = {
        1: 'Yearly',
        2: 'Half-Yearly',
        4: 'Quarterly',
        12: 'Monthly',
        365: 'Daily'
    };
    return labels[frequency] || `${frequency} times per year`;
}

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('compoundPrincipalInput').value);
    const annualInterestRate = parseFloat(document.getElementById('compoundRateInput').value);
    const timePeriod = parseFloat(document.getElementById('compoundTimeInput').value);
    const timeType = document.getElementById('compoundTimeType').value;
    const frequency = parseInt(document.getElementById('compoundFrequencyInput').value, 10);
    const monthlyContribution = parseFloat(document.getElementById('compoundMonthlyContributionInput').value || '0');
    const display = document.getElementById('compoundInterestDisplay');
    const result = document.getElementById('compoundInterestResult');

    if (isNaN(principal) || principal < 0) {
        setCompoundInterestMessage('Principal Amount cannot be negative.', true);
        return;
    }

    if (isNaN(annualInterestRate) || annualInterestRate < 0) {
        setCompoundInterestMessage('Interest Rate cannot be negative.', true);
        return;
    }

    if (isNaN(timePeriod) || timePeriod <= 0) {
        setCompoundInterestMessage('Time Period must be greater than 0.', true);
        return;
    }

    if (isNaN(frequency) || frequency <= 0) {
        setCompoundInterestMessage('Please select a valid compounding frequency.', true);
        return;
    }

    if (isNaN(monthlyContribution) || monthlyContribution < 0) {
        setCompoundInterestMessage('Monthly Contribution cannot be negative.', true);
        return;
    }

    if (principal === 0 && monthlyContribution === 0) {
        setCompoundInterestMessage('Enter a principal amount or a monthly contribution.', true);
        return;
    }

    const years = timeType === 'years' ? timePeriod : timePeriod / 12;
    const totalMonths = Math.round(years * 12);
    const annualRate = annualInterestRate / 100;
    const compoundFactor = Math.pow(1 + annualRate / frequency, frequency * years);
    const principalFutureValue = principal * compoundFactor;
    const monthlyGrowthRate = annualInterestRate === 0 ? 0 : Math.pow(1 + annualRate / frequency, frequency / 12) - 1;
    const contributionFutureValue = monthlyContribution === 0
        ? 0
        : monthlyGrowthRate === 0
            ? monthlyContribution * totalMonths
            : monthlyContribution * ((Math.pow(1 + monthlyGrowthRate, totalMonths) - 1) / monthlyGrowthRate);
    const futureValue = principalFutureValue + contributionFutureValue;
    const totalContributions = principal + monthlyContribution * totalMonths;
    const totalInterest = futureValue - totalContributions;
    const timeLabel = `${timePeriod} ${timeType === 'years' ? (timePeriod === 1 ? 'Year' : 'Years') : (timePeriod === 1 ? 'Month' : 'Months')}`;

    display.value = formatLoanCurrency(futureValue);

    const rows = [
        ['Future Value', formatLoanCurrency(futureValue), true],
        ['Total Interest', formatLoanCurrency(totalInterest)],
        ['Total Contributions', formatLoanCurrency(totalContributions)],
        ['Principal Amount', formatLoanCurrency(principal)],
        ['Monthly Contribution', formatLoanCurrency(monthlyContribution)],
        ['Interest Rate', `${annualInterestRate.toFixed(2)}%`],
        ['Time Period', `${timeLabel} (${totalMonths.toLocaleString('en-US')} months)`],
        ['Compounding', getCompoundingFrequencyLabel(frequency)]
    ];

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
        <p class="finance-copy-status" id="compoundInterestCopyStatus"></p>
    `;

    latestCompoundInterestResultText = rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

function clearCompoundInterest() {
    document.getElementById('compoundPrincipalInput').value = '';
    document.getElementById('compoundRateInput').value = '';
    document.getElementById('compoundTimeInput').value = '';
    document.getElementById('compoundTimeType').value = 'years';
    document.getElementById('compoundFrequencyInput').value = '12';
    document.getElementById('compoundMonthlyContributionInput').value = '';
    document.getElementById('compoundInterestDisplay').value = '';
    setCompoundInterestMessage('Enter investment details and calculate compound growth.');
}

function copyCompoundInterestResult() {
    if (!latestCompoundInterestResultText) {
        setCompoundInterestMessage('Please calculate compound interest before copying the result.', true);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestCompoundInterestResultText)
            .then(() => setCompoundInterestCopyStatus('Compound interest result copied to clipboard.'))
            .catch(() => setCompoundInterestCopyStatus('Copy failed. Please try again.', true));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = latestCompoundInterestResultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setCompoundInterestCopyStatus('Compound interest result copied to clipboard.');
}

// BMI CALCULATOR
let latestBmiResultText = '';

function setBmiMessage(message, isError = false) {
    const display = document.getElementById('bmiDisplay');
    const result = document.getElementById('bmiResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}" id="bmiMessage">${message}</p>`;
    latestBmiResultText = '';
}

function setBmiCopyStatus(message, isError = false) {
    const status = document.getElementById('bmiCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function getBmiCategory(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
}

function convertBmiWeightToKg(weight, unit) {
    return unit === 'lb' ? weight * 0.45359237 : weight;
}

function convertBmiHeightToMeters(height, unit) {
    if (unit === 'cm') return height / 100;
    if (unit === 'ft') return height * 0.3048;
    if (unit === 'in') return height * 0.0254;
    return height;
}

function formatBmiMeasurement(value, unit) {
    return `${Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 })} ${unit}`;
}

function formatBmiHealthyRange(minKg, maxKg, weightUnit) {
    const factor = weightUnit === 'lb' ? 2.2046226218 : 1;
    const unit = weightUnit === 'lb' ? 'lb' : 'kg';
    return `${formatBmiMeasurement(minKg * factor, unit)} - ${formatBmiMeasurement(maxKg * factor, unit)}`;
}

function calculateBmi() {
    const weight = parseFloat(document.getElementById('bmiWeightInput').value);
    const weightUnit = document.getElementById('bmiWeightUnit').value;
    const height = parseFloat(document.getElementById('bmiHeightInput').value);
    const heightUnit = document.getElementById('bmiHeightUnit').value;
    const display = document.getElementById('bmiDisplay');
    const result = document.getElementById('bmiResult');

    if (isNaN(weight) || weight <= 0) {
        setBmiMessage('Weight must be greater than 0.', true);
        return;
    }

    if (isNaN(height) || height <= 0) {
        setBmiMessage('Height must be greater than 0.', true);
        return;
    }

    const weightKg = convertBmiWeightToKg(weight, weightUnit);
    const heightMeters = convertBmiHeightToMeters(height, heightUnit);

    if (heightMeters <= 0) {
        setBmiMessage('Please enter a valid height.', true);
        return;
    }

    const bmi = weightKg / (heightMeters * heightMeters);
    const category = getBmiCategory(bmi);
    const healthyMinKg = 18.5 * heightMeters * heightMeters;
    const healthyMaxKg = 24.9 * heightMeters * heightMeters;

    display.value = bmi.toFixed(1);

    const rows = [
        ['BMI', bmi.toFixed(1), true],
        ['Category', category],
        ['Healthy Weight Range', formatBmiHealthyRange(healthyMinKg, healthyMaxKg, weightUnit)],
        ['Weight', formatBmiMeasurement(weight, weightUnit)],
        ['Height', formatBmiMeasurement(height, heightUnit)]
    ];

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
        <p class="finance-copy-status" id="bmiCopyStatus"></p>
    `;

    latestBmiResultText = rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

function clearBmi() {
    document.getElementById('bmiWeightInput').value = '';
    document.getElementById('bmiWeightUnit').value = 'kg';
    document.getElementById('bmiHeightInput').value = '';
    document.getElementById('bmiHeightUnit').value = 'cm';
    document.getElementById('bmiDisplay').value = '';
    setBmiMessage('Enter weight and height to calculate BMI.');
}

function copyBmiResult() {
    if (!latestBmiResultText) {
        setBmiMessage('Please calculate BMI before copying the result.', true);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestBmiResultText)
            .then(() => setBmiCopyStatus('BMI result copied to clipboard.'))
            .catch(() => setBmiCopyStatus('Copy failed. Please try again.', true));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = latestBmiResultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setBmiCopyStatus('BMI result copied to clipboard.');
}

// DISCOUNT CALCULATOR
let latestDiscountResultText = '';

function setDiscountMessage(message, isError = false) {
    const display = document.getElementById('discountDisplay');
    const result = document.getElementById('discountResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}" id="discountMessage">${message}</p>`;
    latestDiscountResultText = '';
}

function setDiscountCopyStatus(message, isError = false) {
    const status = document.getElementById('discountCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function calculateDiscount() {
    const originalPrice = parseFloat(document.getElementById('discountOriginalPriceInput').value);
    const discountPercent = parseFloat(document.getElementById('discountPercentInput').value);
    const taxPercent = parseFloat(document.getElementById('discountTaxInput').value || '0');
    const display = document.getElementById('discountDisplay');
    const result = document.getElementById('discountResult');

    if (isNaN(originalPrice) || originalPrice <= 0) {
        setDiscountMessage('Original Price must be greater than 0.', true);
        return;
    }

    if (isNaN(discountPercent) || discountPercent < 0) {
        setDiscountMessage('Discount Percentage cannot be negative.', true);
        return;
    }

    if (discountPercent > 100) {
        setDiscountMessage('Discount Percentage cannot be greater than 100%.', true);
        return;
    }

    if (isNaN(taxPercent) || taxPercent < 0) {
        setDiscountMessage('Tax / VAT Percentage cannot be negative.', true);
        return;
    }

    const discountAmount = originalPrice * discountPercent / 100;
    const priceAfterDiscount = originalPrice - discountAmount;
    const taxAmount = priceAfterDiscount * taxPercent / 100;
    const finalPrice = priceAfterDiscount + taxAmount;
    const totalSavings = discountAmount;

    display.value = formatLoanCurrency(finalPrice);

    const rows = [
        ['Final Price', formatLoanCurrency(finalPrice), true],
        ['Discount Amount', formatLoanCurrency(discountAmount)],
        ['Price After Discount', formatLoanCurrency(priceAfterDiscount)],
        ['Tax / VAT Amount', formatLoanCurrency(taxAmount)],
        ['Total Savings', formatLoanCurrency(totalSavings)],
        ['Original Price', formatLoanCurrency(originalPrice)],
        ['Discount Rate', `${discountPercent.toFixed(2)}%`],
        ['Tax / VAT Rate', `${taxPercent.toFixed(2)}%`]
    ];

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
        <p class="finance-copy-status" id="discountCopyStatus"></p>
    `;

    latestDiscountResultText = rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

function clearDiscount() {
    document.getElementById('discountOriginalPriceInput').value = '';
    document.getElementById('discountPercentInput').value = '';
    document.getElementById('discountTaxInput').value = '';
    document.getElementById('discountDisplay').value = '';
    setDiscountMessage('Enter price and discount to calculate savings.');
}

function copyDiscountResult() {
    if (!latestDiscountResultText) {
        setDiscountMessage('Please calculate discount before copying the result.', true);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestDiscountResultText)
            .then(() => setDiscountCopyStatus('Discount result copied to clipboard.'))
            .catch(() => setDiscountCopyStatus('Copy failed. Please try again.', true));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = latestDiscountResultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setDiscountCopyStatus('Discount result copied to clipboard.');
}

// FINANCE & BUSINESS CALCULATORS
function setFinanceToolMessage(displayId, resultId, message, isError = false) {
    const display = document.getElementById(displayId);
    const result = document.getElementById(resultId);
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}">${message}</p>`;
}

function renderFinanceToolResult(displayId, resultId, displayValue, rows) {
    const display = document.getElementById(displayId);
    const result = document.getElementById(resultId);
    if (display) display.value = displayValue;
    if (!result) return;

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
    `;
}

function formatNumber(value, digits = 2) {
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
}

function calculateFuelCost() {
    const distance = parseFloat(document.getElementById('fuelDistanceInput').value);
    const efficiency = parseFloat(document.getElementById('fuelEfficiencyInput').value);
    const fuelPrice = parseFloat(document.getElementById('fuelPriceInput').value);

    if (isNaN(distance) || distance <= 0) {
        setFinanceToolMessage('fuelCostDisplay', 'fuelCostResult', 'Distance must be greater than 0.', true);
        return;
    }
    if (isNaN(efficiency) || efficiency <= 0) {
        setFinanceToolMessage('fuelCostDisplay', 'fuelCostResult', 'Fuel efficiency must be greater than 0.', true);
        return;
    }
    if (isNaN(fuelPrice) || fuelPrice < 0) {
        setFinanceToolMessage('fuelCostDisplay', 'fuelCostResult', 'Fuel price cannot be negative.', true);
        return;
    }

    const fuelNeeded = distance / efficiency;
    const totalCost = fuelNeeded * fuelPrice;
    renderFinanceToolResult('fuelCostDisplay', 'fuelCostResult', formatLoanCurrency(totalCost), [
        ['Total Fuel Cost', formatLoanCurrency(totalCost), true],
        ['Total Fuel Needed', `${formatNumber(fuelNeeded)} liters`],
        ['Distance', `${formatNumber(distance)} km`],
        ['Fuel Efficiency', `${formatNumber(efficiency)} km/l`],
        ['Fuel Price Per Liter', formatLoanCurrency(fuelPrice)]
    ]);
}

function clearFuelCost() {
    document.getElementById('fuelDistanceInput').value = '';
    document.getElementById('fuelEfficiencyInput').value = '';
    document.getElementById('fuelPriceInput').value = '';
    setFinanceToolMessage('fuelCostDisplay', 'fuelCostResult', 'Enter trip and fuel details to calculate total fuel cost.');
}

function calculateProfitMargin() {
    const costPrice = parseFloat(document.getElementById('profitCostInput').value);
    const sellingPrice = parseFloat(document.getElementById('profitSellingInput').value);

    if (isNaN(costPrice) || costPrice < 0) {
        setFinanceToolMessage('profitMarginDisplay', 'profitMarginResult', 'Cost price cannot be negative.', true);
        return;
    }
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
        setFinanceToolMessage('profitMarginDisplay', 'profitMarginResult', 'Selling price must be greater than 0.', true);
        return;
    }
    if (costPrice === 0) {
        setFinanceToolMessage('profitMarginDisplay', 'profitMarginResult', 'Cost price must be greater than 0 for markup calculation.', true);
        return;
    }

    const profit = sellingPrice - costPrice;
    const profitMargin = profit / sellingPrice * 100;
    const markup = profit / costPrice * 100;
    renderFinanceToolResult('profitMarginDisplay', 'profitMarginResult', `${formatNumber(profitMargin)}%`, [
        ['Profit Margin', `${formatNumber(profitMargin)}%`, true],
        ['Profit Amount', formatLoanCurrency(profit)],
        ['Markup Percentage', `${formatNumber(markup)}%`],
        ['Cost Price', formatLoanCurrency(costPrice)],
        ['Selling Price', formatLoanCurrency(sellingPrice)]
    ]);
}

function clearProfitMargin() {
    document.getElementById('profitCostInput').value = '';
    document.getElementById('profitSellingInput').value = '';
    setFinanceToolMessage('profitMarginDisplay', 'profitMarginResult', 'Enter cost and selling price to calculate profit margin.');
}

function calculateBreakEven() {
    const fixedCosts = parseFloat(document.getElementById('breakEvenFixedCostInput').value);
    const sellingPrice = parseFloat(document.getElementById('breakEvenSellingPriceInput').value);
    const variableCost = parseFloat(document.getElementById('breakEvenVariableCostInput').value);

    if (isNaN(fixedCosts) || fixedCosts < 0) {
        setFinanceToolMessage('breakEvenDisplay', 'breakEvenResult', 'Fixed costs cannot be negative.', true);
        return;
    }
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
        setFinanceToolMessage('breakEvenDisplay', 'breakEvenResult', 'Selling price per unit must be greater than 0.', true);
        return;
    }
    if (isNaN(variableCost) || variableCost < 0) {
        setFinanceToolMessage('breakEvenDisplay', 'breakEvenResult', 'Variable cost per unit cannot be negative.', true);
        return;
    }
    if (sellingPrice <= variableCost) {
        setFinanceToolMessage('breakEvenDisplay', 'breakEvenResult', 'Selling price must be greater than variable cost per unit.', true);
        return;
    }

    const contribution = sellingPrice - variableCost;
    const breakEvenUnits = fixedCosts / contribution;
    const breakEvenSales = breakEvenUnits * sellingPrice;
    renderFinanceToolResult('breakEvenDisplay', 'breakEvenResult', `${Math.ceil(breakEvenUnits).toLocaleString('en-US')} units`, [
        ['Break-even Units', `${Math.ceil(breakEvenUnits).toLocaleString('en-US')} units`, true],
        ['Break-even Sales Value', formatLoanCurrency(breakEvenSales)],
        ['Contribution Per Unit', formatLoanCurrency(contribution)],
        ['Fixed Costs', formatLoanCurrency(fixedCosts)],
        ['Selling Price Per Unit', formatLoanCurrency(sellingPrice)],
        ['Variable Cost Per Unit', formatLoanCurrency(variableCost)]
    ]);
}

function clearBreakEven() {
    document.getElementById('breakEvenFixedCostInput').value = '';
    document.getElementById('breakEvenSellingPriceInput').value = '';
    document.getElementById('breakEvenVariableCostInput').value = '';
    setFinanceToolMessage('breakEvenDisplay', 'breakEvenResult', 'Enter business cost details to calculate break-even point.');
}

function calculateRoi() {
    const investment = parseFloat(document.getElementById('roiInvestmentInput').value);
    const finalValue = parseFloat(document.getElementById('roiFinalValueInput').value);

    if (isNaN(investment) || investment <= 0) {
        setFinanceToolMessage('roiDisplay', 'roiResult', 'Investment amount must be greater than 0.', true);
        return;
    }
    if (isNaN(finalValue) || finalValue < 0) {
        setFinanceToolMessage('roiDisplay', 'roiResult', 'Final value / return amount cannot be negative.', true);
        return;
    }

    const netProfit = finalValue - investment;
    const roi = netProfit / investment * 100;
    renderFinanceToolResult('roiDisplay', 'roiResult', `${formatNumber(roi)}%`, [
        ['ROI Percentage', `${formatNumber(roi)}%`, true],
        ['Net Profit', formatLoanCurrency(netProfit)],
        ['Investment Amount', formatLoanCurrency(investment)],
        ['Final Value / Return Amount', formatLoanCurrency(finalValue)]
    ]);
}

function clearRoi() {
    document.getElementById('roiInvestmentInput').value = '';
    document.getElementById('roiFinalValueInput').value = '';
    setFinanceToolMessage('roiDisplay', 'roiResult', 'Enter investment and final value to calculate ROI.');
}

function calculateSimpleInterest() {
    const principal = parseFloat(document.getElementById('simplePrincipalInput').value);
    const rate = parseFloat(document.getElementById('simpleRateInput').value);
    const time = parseFloat(document.getElementById('simpleTimeInput').value);

    if (isNaN(principal) || principal <= 0) {
        setFinanceToolMessage('simpleInterestDisplay', 'simpleInterestResult', 'Principal amount must be greater than 0.', true);
        return;
    }
    if (isNaN(rate) || rate < 0) {
        setFinanceToolMessage('simpleInterestDisplay', 'simpleInterestResult', 'Annual interest rate cannot be negative.', true);
        return;
    }
    if (isNaN(time) || time <= 0) {
        setFinanceToolMessage('simpleInterestDisplay', 'simpleInterestResult', 'Time period must be greater than 0.', true);
        return;
    }

    const interest = principal * rate * time / 100;
    const totalAmount = principal + interest;
    renderFinanceToolResult('simpleInterestDisplay', 'simpleInterestResult', formatLoanCurrency(totalAmount), [
        ['Total Amount', formatLoanCurrency(totalAmount), true],
        ['Interest Amount', formatLoanCurrency(interest)],
        ['Principal Amount', formatLoanCurrency(principal)],
        ['Annual Interest Rate', `${formatNumber(rate)}%`],
        ['Time Period', `${formatNumber(time)} years`]
    ]);
}

function clearSimpleInterest() {
    document.getElementById('simplePrincipalInput').value = '';
    document.getElementById('simpleRateInput').value = '';
    document.getElementById('simpleTimeInput').value = '';
    setFinanceToolMessage('simpleInterestDisplay', 'simpleInterestResult', 'Enter principal, rate, and time to calculate simple interest.');
}

// VOLUME CALCULATOR
let latestVolumeResultText = '';

const volumeShapeFields = {
    rectangular: {
        title: 'Rectangular Prism',
        fields: [
            ['Length', 'Length'],
            ['Width', 'Width'],
            ['Height', 'Height']
        ]
    },
    cube: {
        title: 'Cube',
        fields: [
            ['Side Length', 'Side Length']
        ]
    },
    cylinder: {
        title: 'Cylinder',
        fields: [
            ['Radius', 'Radius'],
            ['Height', 'Height']
        ]
    },
    sphere: {
        title: 'Sphere',
        fields: [
            ['Radius', 'Radius']
        ]
    },
    cone: {
        title: 'Cone',
        fields: [
            ['Radius', 'Radius'],
            ['Height', 'Height']
        ]
    }
};

function setVolumeMessage(message, isError = false) {
    const display = document.getElementById('volumeDisplay');
    const result = document.getElementById('volumeResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}" id="volumeMessage">${message}</p>`;
    latestVolumeResultText = '';
}

function setVolumeCopyStatus(message, isError = false) {
    const status = document.getElementById('volumeCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function updateVolumeFields() {
    const shape = document.getElementById('volumeShapeInput')?.value || 'rectangular';
    const config = volumeShapeFields[shape] || volumeShapeFields.rectangular;
    const groups = [
        document.getElementById('volumeDimensionOneGroup'),
        document.getElementById('volumeDimensionTwoGroup'),
        document.getElementById('volumeDimensionThreeGroup')
    ];
    const labels = [
        document.getElementById('volumeDimensionOneLabel'),
        document.getElementById('volumeDimensionTwoLabel'),
        document.getElementById('volumeDimensionThreeLabel')
    ];
    const inputs = [
        document.getElementById('volumeDimensionOneInput'),
        document.getElementById('volumeDimensionTwoInput'),
        document.getElementById('volumeDimensionThreeInput')
    ];

    groups.forEach((group, index) => {
        const field = config.fields[index];
        if (!group || !labels[index] || !inputs[index]) return;
        group.style.display = field ? 'grid' : 'none';
        inputs[index].disabled = !field;
        if (field) {
            labels[index].textContent = field[0];
            inputs[index].placeholder = field[1];
        } else {
            inputs[index].value = '';
        }
    });
}

function getVolumeInputs() {
    return [
        parseFloat(document.getElementById('volumeDimensionOneInput').value),
        parseFloat(document.getElementById('volumeDimensionTwoInput').value),
        parseFloat(document.getElementById('volumeDimensionThreeInput').value)
    ];
}

function validateVolumeDimensions(dimensions, count) {
    for (let i = 0; i < count; i++) {
        if (isNaN(dimensions[i]) || dimensions[i] <= 0) {
            return false;
        }
    }
    return true;
}

function calculateVolume() {
    const shape = document.getElementById('volumeShapeInput').value;
    const unit = document.getElementById('volumeUnitInput').value;
    const display = document.getElementById('volumeDisplay');
    const result = document.getElementById('volumeResult');
    const dimensions = getVolumeInputs();
    const config = volumeShapeFields[shape] || volumeShapeFields.rectangular;
    const requiredCount = config.fields.length;

    if (!validateVolumeDimensions(dimensions, requiredCount)) {
        setVolumeMessage('All required dimensions must be greater than 0.', true);
        return;
    }

    let volume = 0;
    let formula = '';
    const [a, b, c] = dimensions;

    if (shape === 'cube') {
        volume = Math.pow(a, 3);
        formula = 'side x side x side';
    } else if (shape === 'cylinder') {
        volume = Math.PI * Math.pow(a, 2) * b;
        formula = 'pi x radius^2 x height';
    } else if (shape === 'sphere') {
        volume = 4 / 3 * Math.PI * Math.pow(a, 3);
        formula = '4/3 x pi x radius^3';
    } else if (shape === 'cone') {
        volume = Math.PI * Math.pow(a, 2) * b / 3;
        formula = 'pi x radius^2 x height / 3';
    } else {
        volume = a * b * c;
        formula = 'length x width x height';
    }

    const formattedVolume = `${Number(volume).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} ${unit}³`;

    display.value = formattedVolume;

    const rows = [
        ['Volume', formattedVolume, true],
        ['Shape', config.title],
        ['Formula', formula],
        ...config.fields.map((field, index) => [field[0], `${dimensions[index].toLocaleString('en-US')} ${unit}`])
    ];

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
        <p class="finance-copy-status" id="volumeCopyStatus"></p>
    `;

    latestVolumeResultText = rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

function clearVolume() {
    document.getElementById('volumeShapeInput').value = 'rectangular';
    document.getElementById('volumeDimensionOneInput').value = '';
    document.getElementById('volumeDimensionTwoInput').value = '';
    document.getElementById('volumeDimensionThreeInput').value = '';
    document.getElementById('volumeUnitInput').value = 'cm';
    document.getElementById('volumeDisplay').value = '';
    updateVolumeFields();
    setVolumeMessage('Select a shape and enter dimensions to calculate volume.');
}

function copyVolumeResult() {
    if (!latestVolumeResultText) {
        setVolumeMessage('Please calculate volume before copying the result.', true);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestVolumeResultText)
            .then(() => setVolumeCopyStatus('Volume result copied to clipboard.'))
            .catch(() => setVolumeCopyStatus('Copy failed. Please try again.', true));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = latestVolumeResultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setVolumeCopyStatus('Volume result copied to clipboard.');
}

// AREA CALCULATOR
let latestAreaResultText = '';

const areaShapeFields = {
    rectangle: {
        title: 'Rectangle',
        fields: [
            ['Length', 'Length'],
            ['Width', 'Width']
        ]
    },
    square: {
        title: 'Square',
        fields: [
            ['Side Length', 'Side Length']
        ]
    },
    triangle: {
        title: 'Triangle',
        fields: [
            ['Base', 'Base'],
            ['Height', 'Height']
        ]
    },
    circle: {
        title: 'Circle',
        fields: [
            ['Radius', 'Radius']
        ]
    },
    parallelogram: {
        title: 'Parallelogram',
        fields: [
            ['Base', 'Base'],
            ['Height', 'Height']
        ]
    },
    trapezoid: {
        title: 'Trapezoid',
        fields: [
            ['Base 1', 'Base 1'],
            ['Base 2', 'Base 2'],
            ['Height', 'Height']
        ]
    },
    ellipse: {
        title: 'Ellipse',
        fields: [
            ['Major Radius', 'Major Radius'],
            ['Minor Radius', 'Minor Radius']
        ]
    }
};

function setAreaMessage(message, isError = false) {
    const display = document.getElementById('areaDisplay');
    const result = document.getElementById('areaResult');
    if (display) display.value = isError ? 'Check inputs' : '';
    if (!result) return;

    result.innerHTML = `<p class="finance-message${isError ? ' is-error' : ''}" id="areaMessage">${message}</p>`;
    latestAreaResultText = '';
}

function setAreaCopyStatus(message, isError = false) {
    const status = document.getElementById('areaCopyStatus');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
}

function updateAreaFields() {
    const shape = document.getElementById('areaShapeInput')?.value || 'rectangle';
    const config = areaShapeFields[shape] || areaShapeFields.rectangle;
    const groups = [
        document.getElementById('areaDimensionOneGroup'),
        document.getElementById('areaDimensionTwoGroup'),
        document.getElementById('areaDimensionThreeGroup')
    ];
    const labels = [
        document.getElementById('areaDimensionOneLabel'),
        document.getElementById('areaDimensionTwoLabel'),
        document.getElementById('areaDimensionThreeLabel')
    ];
    const inputs = [
        document.getElementById('areaDimensionOneInput'),
        document.getElementById('areaDimensionTwoInput'),
        document.getElementById('areaDimensionThreeInput')
    ];

    groups.forEach((group, index) => {
        const field = config.fields[index];
        if (!group || !labels[index] || !inputs[index]) return;
        group.style.display = field ? 'grid' : 'none';
        inputs[index].disabled = !field;
        if (field) {
            labels[index].textContent = field[0];
            inputs[index].placeholder = field[1];
        } else {
            inputs[index].value = '';
        }
    });
}

function getAreaInputs() {
    return [
        parseFloat(document.getElementById('areaDimensionOneInput').value),
        parseFloat(document.getElementById('areaDimensionTwoInput').value),
        parseFloat(document.getElementById('areaDimensionThreeInput').value)
    ];
}

function validateAreaDimensions(dimensions, count) {
    for (let i = 0; i < count; i++) {
        if (isNaN(dimensions[i]) || dimensions[i] <= 0) {
            return false;
        }
    }
    return true;
}

function calculateArea() {
    const shape = document.getElementById('areaShapeInput').value;
    const unit = document.getElementById('areaUnitInput').value;
    const display = document.getElementById('areaDisplay');
    const result = document.getElementById('areaResult');
    const dimensions = getAreaInputs();
    const config = areaShapeFields[shape] || areaShapeFields.rectangle;
    const requiredCount = config.fields.length;

    if (!validateAreaDimensions(dimensions, requiredCount)) {
        setAreaMessage('All required dimensions must be greater than 0.', true);
        return;
    }

    let area = 0;
    let formula = '';
    const [a, b, c] = dimensions;

    if (shape === 'square') {
        area = Math.pow(a, 2);
        formula = 'side x side';
    } else if (shape === 'triangle') {
        area = a * b / 2;
        formula = 'base x height / 2';
    } else if (shape === 'circle') {
        area = Math.PI * Math.pow(a, 2);
        formula = 'pi x radius^2';
    } else if (shape === 'parallelogram') {
        area = a * b;
        formula = 'base x height';
    } else if (shape === 'trapezoid') {
        area = (a + b) * c / 2;
        formula = '(base 1 + base 2) x height / 2';
    } else if (shape === 'ellipse') {
        area = Math.PI * a * b;
        formula = 'pi x major radius x minor radius';
    } else {
        area = a * b;
        formula = 'length x width';
    }

    const formattedArea = `${Number(area).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} ${unit}^2`;

    display.value = formattedArea;

    const rows = [
        ['Area', formattedArea, true],
        ['Shape', config.title],
        ['Formula', formula],
        ...config.fields.map((field, index) => [field[0], `${dimensions[index].toLocaleString('en-US')} ${unit}`])
    ];

    result.innerHTML = `
        <dl>
            ${rows.map(([label, value, highlight]) => `
                <div class="${highlight ? 'highlight' : ''}">
                    <dt>${label}</dt>
                    <dd>${value}</dd>
                </div>
            `).join('')}
        </dl>
        <p class="finance-copy-status" id="areaCopyStatus"></p>
    `;

    latestAreaResultText = rows
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

function clearArea() {
    document.getElementById('areaShapeInput').value = 'rectangle';
    document.getElementById('areaDimensionOneInput').value = '';
    document.getElementById('areaDimensionTwoInput').value = '';
    document.getElementById('areaDimensionThreeInput').value = '';
    document.getElementById('areaUnitInput').value = 'cm';
    document.getElementById('areaDisplay').value = '';
    updateAreaFields();
    setAreaMessage('Select a shape and enter dimensions to calculate area.');
}

function copyAreaResult() {
    if (!latestAreaResultText) {
        setAreaMessage('Please calculate area before copying the result.', true);
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(latestAreaResultText)
            .then(() => setAreaCopyStatus('Area result copied to clipboard.'))
            .catch(() => setAreaCopyStatus('Copy failed. Please try again.', true));
        return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = latestAreaResultText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    textArea.remove();
    setAreaCopyStatus('Area result copied to clipboard.');
}

// KEYBOARD SUPPORT
document.addEventListener('keydown', function (e) {
    if (!['basic', 'scientific'].includes(activeDisplay)) return;
    if (['Enter', ' '].includes(e.key) && document.activeElement?.matches('button, a, summary')) return;
    if (document.activeElement?.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (!isNaN(e.key) || ['+', '-', '*', '/', '.', '(', ')'].includes(e.key)) {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (e.key.toLowerCase() === 'm') {
        memoryRecall();
    } else if (e.key === '^') {
        appendToDisplay('**');
    }
});

function updateDarkModeButtonText(isDark) {
    const toggleLink = document.getElementById('darkModeToggle');
    if (!toggleLink) return;
    toggleLink.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}

document.addEventListener('DOMContentLoaded', function () {
    const heading = document.querySelector('header h1');
    if (heading && document.body.classList.contains('app-loading')) {
        heading.textContent = 'Free Online Calculators & Smart Tools';
    }

    const navLabels = ['Home', 'About Us', 'Contact Us', 'Privacy Policy', 'Download App'];
    document.querySelectorAll('.top-nav a').forEach((link, index) => {
        if (index < navLabels.length) link.textContent = navLabels[index];
    });

    updateDarkModeButtonText(document.body.classList.contains('dark-mode'));

    renderCalculatorList();
});



// Presentation helpers reuse the existing registry, inputs and calculation handlers.
// BEGIN GENERATED CLASSIC GUIDES
const CLASSIC_GUIDES = {
  "basic": [
    "Check everyday arithmetic with addition, subtraction, multiplication, division, powers, and square roots.",
    "Enter a number, choose an operation, enter the next number, and press =. Use DEL to correct a digit or C to clear the expression.",
    "Multiplication and division are evaluated before addition and subtraction. M+ adds the displayed value to memory; M- subtracts it; MRC recalls it.",
    "12 × 8 = 96. By contrast, 12 + 8 × 2 = 28 because multiplication comes first."
  ],
  "scientific": [
    "Evaluate expressions with trigonometric functions, logarithms, powers, and the constants pi and e.",
    "Select a function, enter its argument, and press =. Use parentheses to group expressions and C to begin again.",
    "Sine, cosine, and tangent use radians. The ln function is the natural logarithm; log uses base 10. Convert degrees to radians by multiplying by pi / 180.",
    "sin(0) = 0 and cos(0) = 1. A right angle is pi / 2 radians, not 90 radians."
  ],
  "unit": [
    "Convert measurements within length, weight, or temperature without mixing incompatible quantities.",
    "Choose a category, enter the measurement, select its source and destination units, and choose Convert.",
    "Length and weight use conversion factors through a common base unit. Temperature also needs an offset: Fahrenheit = Celsius × 9 / 5 + 32.",
    "1 meter = 100 centimeters. A temperature of 0 degrees Celsius equals 32 degrees Fahrenheit. Results show four decimal places."
  ],
  "age": [
    "Find elapsed calendar years, months, and days from a date of birth to today, plus the next birthday countdown.",
    "Select the date of birth and calculate. The reference date is today on your device; future birth dates are rejected.",
    "The calculation subtracts calendar components and borrows from the previous month when needed. It does not divide a day count by 365, since months and years have different lengths.",
    "Someone born on 15 June 2000 is 25 years old on 15 June 2025. Your result changes with today's date and the device's time zone."
  ],
  "date": [
    "Measure the number of calendar days separating two dates, in either order.",
    "Select both dates and choose Days Between. Both inputs must be valid dates; empty dates produce a validation message.",
    "The result is the absolute difference between the two dates in days. It counts elapsed days, not both endpoints as inclusive days.",
    "1 January to 11 January is 10 days. Selecting the same date twice gives 0 days."
  ],
  "time": [
    "Compare two date-and-time values and see elapsed hours, minutes, and seconds, with totals in minutes and seconds.",
    "Enter both full date-and-time values and choose the calculation action. Include the following date when an interval crosses midnight.",
    "The tool takes the absolute difference between the timestamps. Hours can exceed 24. Inputs use your device's local time zone, which matters around daylight-saving changes.",
    "10:00 to 12:30 on the same day is 02:30:00, or 150 minutes and 9,000 seconds."
  ],
  "percentage": [
    "Find a chosen percentage of a value, such as a portion of a budget or a share of a quantity.",
    "Enter the base value and the percentage, then calculate. Enter 15 for fifteen percent, not 0.15.",
    "Percentage amount = base value × percentage / 100. This tool returns the portion itself; use Percentage Change to compare an old and new value.",
    "15% of 200 is 200 × 15 / 100 = 30."
  ],
  "percentageChange": [
    "Compare a new value with an original value to express the difference as a percentage of the original.",
    "Enter the old value and new value, then choose % Change. The old value must be non-zero.",
    "Percentage change = (new − old) / old × 100. A zero baseline has no defined percentage change. Negative baselines retain the sign of the denominator, so interpret those results carefully.",
    "An increase from 100 to 120 is +20%; a decrease from 100 to 80 is −20%. These are relative changes, not percentage-point differences."
  ],
  "tip": [
    "Calculate a tip amount and the resulting total bill using your chosen percentage.",
    "Enter the bill amount and tip percentage, then calculate. Use the same currency for the bill and the result.",
    "Tip = bill × tip percentage / 100. Total = bill + tip. This tool does not divide the bill between people.",
    "A bill of 50 with a 15% tip produces a tip of 7.50 and a total of 57.50. The display uses a dollar symbol."
  ],
  "vat": [
    "Add a percentage to a net price or recover the original price from a tax-inclusive total.",
    "Enter the amount and rate, then choose Add VAT or Remove VAT according to whether the input excludes or includes tax.",
    "Adding uses net × (1 + rate / 100). Removing uses gross / (1 + rate / 100); it is not the same as subtracting that percentage of the gross price.",
    "At 20%, a net price of 100 becomes 120. Removing 20% VAT from 120 returns 100. Use Discount Calculator for a sale-price reduction."
  ],
  "loanEmi": [
    "Estimate a fixed monthly loan installment and the total interest over the chosen term.",
    "Enter the loan principal, annual interest rate, and term using the selected time unit. Calculate and review the payment breakdown.",
    "EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), where r is the monthly rate and n is the number of monthly payments. At zero interest, the installment is P / n.",
    "A principal of 12,000 over 12 months at 0% interest gives a monthly installment of 1,000. Fees and changing rates are outside this estimate."
  ],
  "mortgage": [
    "Estimate monthly principal and interest together with the property tax and home insurance you enter.",
    "Enter home price, down payment, annual rate, and term in years. Supply annual tax and insurance amounts or enter zero.",
    "Loan principal = home price − down payment. A fixed-rate monthly payment is calculated on that principal; annual tax and insurance are each divided by 12 and added.",
    "At 0% interest, a 120,000 principal over 10 years costs 1,000 monthly before tax and insurance. Other ownership costs and lender fees are not included."
  ],
  "compoundInterest": [
    "Project growth of an initial balance with a selected compounding frequency and optional monthly contributions.",
    "Enter the principal, annual rate, time period, compounding frequency, and monthly contribution. Review future value, contributions, and interest separately.",
    "Without deposits, A = P × (1 + r / n)^(n × t). Contributions use the equivalent monthly growth rate and are treated as end-of-month deposits. The annual rate r is expressed as a decimal.",
    "1,000 at 10% compounded annually for two years becomes 1,210 without additional deposits. This assumes a constant rate and excludes fees and taxes."
  ],
  "bmi": [
    "Calculate adult body mass index from weight and height and view the corresponding screening category.",
    "Select the available unit system, enter height and weight, and calculate. Check the units before interpreting the number.",
    "BMI = weight in kilograms / height in meters squared. The categories describe a screening measure, not body-fat percentage or a diagnosis; children and pregnancy need different assessment.",
    "70 kg at 1.75 m gives 70 / 1.75² = 22.86, shown as 22.9. BMI does not distinguish muscle from fat."
  ],
  "discount": [
    "Compare an original price with a discounted price and optional tax to see the final cost and savings.",
    "Enter the original price, discount percentage, and optional tax rate, then calculate.",
    "Savings = price × discount / 100. The savings are subtracted from the original price, then tax is applied to the reduced price.",
    "A price of 100 reduced by 20% becomes 80; adding 10% tax gives a final price of 88."
  ],
  "fuelCost": [
    "Estimate liters of fuel and trip cost from distance, vehicle efficiency, and fuel price.",
    "Enter distance in kilometers, efficiency in kilometers per liter, and the price of one liter of fuel.",
    "Liters needed = distance / efficiency. Total cost = liters needed × price per liter. Do not enter liters per 100 km into the km-per-liter field.",
    "A 300 km trip at 15 km per liter uses 20 liters. At 2 currency units per liter, the fuel cost is 40; tolls and parking are separate."
  ],
  "profitMargin": [
    "Compare cost and selling price to see profit, margin on revenue, and markup on cost.",
    "Enter the cost price and selling price in the same currency, then calculate.",
    "Profit = selling price − cost. Margin = profit / selling price × 100; markup = profit / cost × 100. Margin and markup have different denominators.",
    "A cost of 80 and selling price of 100 give profit of 20, margin of 20%, and markup of 25%. Include relevant costs in your input."
  ],
  "breakEven": [
    "Estimate how many units must be sold to cover fixed costs at a given selling price and variable cost.",
    "Enter fixed costs for the period, selling price per unit, and variable cost per unit. Selling price must exceed variable cost.",
    "Contribution per unit = selling price − variable cost. Break-even units = fixed costs / contribution. The displayed unit count rounds up; the sales-value estimate uses the unrounded threshold.",
    "Fixed costs of 1,000 with a price of 25 and variable cost of 15 require 100 units. This assumes costs and prices remain constant."
  ],
  "roi": [
    "Express the gain or loss on an investment as a percentage of its initial amount.",
    "Enter a positive initial investment and its final value or total return amount in the same currency.",
    "Net profit = final value − initial investment. ROI = net profit / initial investment × 100. The result is a total-period return, not an annualized rate.",
    "An investment of 1,000 ending at 1,250 earns 250, giving 25% ROI. Account for fees consistently when choosing the final value."
  ],
  "simpleInterest": [
    "Calculate interest that is proportional to principal and time without compounding earlier interest.",
    "Enter the principal, annual interest rate, and duration in years. For six months, enter 0.5 years.",
    "Interest = P × r × t, where r is the annual rate divided by 100 and t is time in years. Total amount = principal + interest.",
    "1,000 at 5% for two years earns 100 interest and totals 1,100. Compound Interest Calculator is appropriate when interest itself earns interest."
  ],
  "volume": [
    "Find the volume of supported three-dimensional shapes using their measured dimensions.",
    "Choose a shape and measurement unit, then enter the dimensions requested. For circular shapes, use radius rather than diameter.",
    "A cuboid uses length × width × height; a cylinder uses pi × radius² × height; a sphere uses 4 × pi × radius³ / 3. Keep all dimensions in the same unit.",
    "A cube with a 10 cm side has volume 1,000 cm³. Volume uses cubic units, unlike the square units used for area."
  ],
  "area": [
    "Find the area of a supported two-dimensional shape from its dimensions.",
    "Select the shape and unit, enter the required dimensions, and calculate. Use perpendicular height for a triangle or parallelogram.",
    "A rectangle uses length × width; a triangle uses base × height / 2; a circle uses pi × radius². Convert dimensions to the same unit first.",
    "A rectangle 10 cm long and 5 cm wide has area 50 cm². Area describes a surface, not perimeter or volume."
  ]
};
// END GENERATED CLASSIC GUIDES
function escapeGuideText(value) {
 return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function getCalculatorIntroduction(calculator) {
 return CLASSIC_GUIDES[calculator.target]?.[0] || dynamicToolDefinitions[calculator.dynamicTool]?.description || calculator.metaDescription;
}
function getCalculatorGuideHtml(calculator) {
 const guide = CLASSIC_GUIDES[calculator.target];
 if (!guide) return '<h2>How to Use</h2><p>'+escapeGuideText(dynamicToolDefinitions[calculator.dynamicTool].help.how)+'</p>';
 return '<h2>How to Use</h2><p>'+escapeGuideText(guide[1])+'</p><h3>Formula and interpretation</h3><p>'+escapeGuideText(guide[2])+'</p><h3>Example</h3><p>'+escapeGuideText(guide[3])+'</p>';
}
function getCalculatorApplicationSchema(calculator) {
 return {'@context':'https://schema.org','@type':'WebApplication',name:calculator ? getCalculatorTitle(calculator) : 'OnlineCalMaster Calculator',url:getCanonicalUrl(calculator),description:calculator ? getCalculatorIntroduction(calculator) : HOME_DESCRIPTION,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}};
}
function closeCalculatorNavigation() {
 const toggle=document.getElementById('navigationToggle');
 if(toggle) toggle.setAttribute('aria-expanded','false');
 document.getElementById('calculatorSidebar')?.classList.remove('is-open');
}
function renderCalculatorContext(calculator) {
 const panel=document.getElementById(calculator.elementId);
 const description=panel?.querySelector('.calculator-description')?.textContent || calculator.metaDescription;
 const context=document.getElementById('contextDescription'); if(context) context.textContent=description;
 const guide=document.getElementById('calculatorGuide'); if(!guide) return;
 if (CLASSIC_GUIDES[calculator.target]) {
  guide.innerHTML = getCalculatorGuideHtml(calculator);
  return;
 }
 const definition=calculator.dynamicTool ? dynamicToolDefinitions[calculator.dynamicTool] : null;
  guide.replaceChildren();
 const heading=document.createElement('h2'); heading.textContent='How to Use'; guide.append(heading);
 const steps=document.createElement('ol');
 const labels=[...panel.querySelectorAll('.field-group > span')].map(el=>el.textContent).slice(0,4);
 const text=['basic','scientific'].includes(calculator.target)
 ? ['Enter numbers using the keypad or keyboard.','Choose an operation. Memory and advanced controls remain available.','Press = or Enter to calculate. Use C to start again.']
 : [definition?.help.how || (labels.length ? 'Enter '+labels.join(', ')+'.' : 'Enter the values requested in the calculator.'),'Choose the calculation action to see your result.','Review the result and use Clear to start a new calculation.'];
 text.forEach(value=>{const li=document.createElement('li');li.textContent=value;steps.append(li);});guide.append(steps);
 if(['basic','scientific'].includes(calculator.target)){const p=document.createElement('p');p.textContent='Example: 12 × 8 = 96. Your calculations are saved locally in this browser’s calculation history.';guide.append(p);}
}
document.addEventListener('DOMContentLoaded',()=>{
 const toggle=document.getElementById('navigationToggle');
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));document.getElementById('calculatorSidebar').classList.toggle('is-open',open);if(open)document.getElementById('calculatorSearch').focus();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape' && toggle?.getAttribute('aria-expanded')==='true'){closeCalculatorNavigation();toggle.focus();}});
 const query=new URLSearchParams(location.search).get('q');
 if(query){document.getElementById('calculatorSearch').value=query;const input=document.getElementById('headerSearch');if(input)input.value=query;renderCalculatorList();document.getElementById('calculatorSidebar').classList.add('is-open');toggle?.setAttribute('aria-expanded','true');}
 document.querySelector('.header-search')?.addEventListener('submit',e=>{e.preventDefault();document.getElementById('calculatorSearch').value=document.getElementById('headerSearch').value;document.getElementById('calculatorCategory').value='All Calculators';renderCalculatorList();document.getElementById('calculatorSidebar').classList.add('is-open');toggle?.setAttribute('aria-expanded','true');document.getElementById('calculatorSearch').focus();});
});
