// Memory and Theme State
let memory = 0;
let activeDisplay = 'basic';
let display, displayScientific;
let appInitialized = false;
let lastRenderedCalculatorListKey = '';
let lastTrackedPath = '';
let latestShareStatusTimer;
const HOME_TITLE = 'Free Online Calculators & Tools | OnlineCalMaster';
const HOME_DESCRIPTION = 'Use OnlineCalMaster for fast, free, and mobile-friendly online calculators including finance, business, education, health, date, time, and developer tools.';
const SITE_ORIGIN = 'https://onlinecalmaster.com';
const SOCIAL_IMAGE_URL = `${SITE_ORIGIN}/Logo.png`;
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
    { name: 'Area', category: 'Education', target: 'area', slug: 'area-calculator', elementId: 'areaCalculator', title: 'Area Calculator', heightClass: 'extra-tall', metaDescription: 'Calculate area for common 2D shapes using the free Area Calculator by OnlineCalMaster.' }
];

function getCalculatorByTarget(type) {
    return calculatorData.find(calculator => calculator.target === type);
}

const dynamicToolDefinitions = {
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
                ${field.options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
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
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
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
    return canUseCleanUrls() ? `/${calculator.slug}` : `#${calculator.slug}`;
}

function getAbsoluteCalculatorUrl(calculator) {
    return calculator?.slug ? `${SITE_ORIGIN}/${calculator.slug}` : `${SITE_ORIGIN}/`;
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
    const title = calculatorTitle ? `${calculatorTitle} | OnlineCalMaster` : HOME_TITLE;
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
}

function trackPageView(calculator) {
    const path = calculator?.slug ? `/${calculator.slug}` : '/';
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
        const matchesSearch = calculator.name.toLowerCase().includes(searchTerm);
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
    home.addEventListener('click', event => {
        event.preventDefault();
        showCalculator('basic');
    });

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

function renderCalculatorList() {
    const listElement = document.getElementById('calculatorList');
    if (!listElement) return;

    const filteredCalculators = getFilteredCalculators();
    const searchInput = document.getElementById('calculatorSearch');
    const categorySelect = document.getElementById('calculatorCategory');
    const renderKey = `${searchInput?.value || ''}|${categorySelect?.value || ''}|${activeDisplay}`;
    if (renderKey === lastRenderedCalculatorListKey) {
        updateCalculatorCount(filteredCalculators.length);
        return;
    }
    lastRenderedCalculatorListKey = renderKey;
    updateCalculatorCount(filteredCalculators.length);
    listElement.innerHTML = '';

    if (!filteredCalculators.length) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'calculator-empty';
        emptyMessage.textContent = 'No calculators found.';
        listElement.appendChild(emptyMessage);
        return;
    }

    filteredCalculators.forEach(calculator => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = calculator.name;
        button.dataset.target = calculator.target;
        button.classList.toggle('is-active', calculator.target === activeDisplay);
        button.addEventListener('click', () => showCalculator(calculator.target));
        listElement.appendChild(button);
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

    display = document.getElementById('display');
    displayScientific = document.getElementById('displayScientific');

    initializeCalculatorPanel();
    const initialCalculator = getInitialCalculatorFromUrl();
    if (initialCalculator) {
        showCalculator(initialCalculator.target, { replace: true });
    } else {
        showCalculator('basic', { updateUrl: false, updateMeta: false });
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
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateDarkModeButtonText(true);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-mode');
        updateDarkModeButtonText(true);
    } else {
        updateDarkModeButtonText(false);
    }
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
    trackPageView(calculator);
    runSeoDiagnostics(calculator);
    renderCalculatorNavigation(calculator);
    renderCalculatorList();
}

window.addEventListener('popstate', () => {
    const calculator = getInitialCalculatorFromUrl();
    if (calculator) {
        showCalculator(calculator.target, { updateUrl: false });
    } else {
        showCalculator('basic', { updateUrl: false, updateMeta: false });
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
            .replace(/sqrt/g, 'Math.sqrt');

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
    const date1 = new Date(document.getElementById('date1Input').value);
    const date2 = new Date(document.getElementById('date2Input').value);
    const display = document.getElementById('dateDiffDisplay');
    if (!date1 || !date2) {
        display.value = "Please select both dates";
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
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
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

    const navLabels = ['Home', 'About Us', 'Contact Us', 'Privacy Policy', 'Download Desktop App', 'Purchase Source Code'];
    document.querySelectorAll('.top-nav a').forEach((link, index) => {
        if (index < navLabels.length) link.textContent = navLabels[index];
    });

    updateDarkModeButtonText(document.body.classList.contains('dark-mode'));

    renderCalculatorList();
});


