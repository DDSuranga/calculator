// Memory and Theme State
let memory = 0;
let activeDisplay = 'basic';
let display, displayScientific;
let appInitialized = false;

const calculatorData = [
    { name: 'Basic Calculator', category: 'Education', target: 'basic', elementId: 'basicCalculator' },
    { name: 'Scientific Calculator', category: 'Education', target: 'scientific', elementId: 'scientificCalculator' },
    { name: 'Unit Converter', category: 'Unit Conversion', target: 'unit', elementId: 'unitConverter', heightClass: 'tall' },
    { name: 'Age Calculator', category: 'Date & Time', target: 'age', elementId: 'ageCalculator', heightClass: 'extra-tall' },
    { name: 'Date Diff', category: 'Date & Time', target: 'date', elementId: 'dateDifferenceCalculator', title: 'Date Difference Calculator', heightClass: 'extra-tall' },
    { name: 'Time Diff', category: 'Date & Time', target: 'time', elementId: 'timeDifferenceCalculator', title: 'Time Difference Calculator', heightClass: 'extra-tall' },
    { name: 'Percentage', category: 'Finance', target: 'percentage', elementId: 'percentageCalculator', title: 'Percentage Calculator' },
    { name: 'Percentage Change', category: 'Business', target: 'percentageChange', elementId: 'percentageChangeCalculator', title: 'Percentage Change Calculator', heightClass: 'extra-tall' },
    { name: 'Tip', category: 'Business', target: 'tip', elementId: 'tipCalculator', title: 'Tip Calculator', heightClass: 'extra-tall' },
    { name: 'VAT', category: 'Business', target: 'vat', elementId: 'vatCalculator', title: 'VAT / Discount Calculator', heightClass: 'extra-tall' },
    { name: 'Loan EMI', category: 'Finance', target: 'loanEmi', elementId: 'loanEmiCalculator', title: 'Loan EMI Calculator', heightClass: 'extra-tall' },
    { name: 'Mortgage', category: 'Finance', target: 'mortgage', elementId: 'mortgageCalculator', title: 'Mortgage Calculator', heightClass: 'extra-tall' },
    { name: 'Compound Interest', category: 'Finance', target: 'compoundInterest', elementId: 'compoundInterestCalculator', title: 'Compound Interest Calculator', heightClass: 'extra-tall' },
    { name: 'BMI', category: 'Health', target: 'bmi', elementId: 'bmiCalculator', title: 'BMI Calculator', heightClass: 'extra-tall' },
    { name: 'Discount', category: 'Business', target: 'discount', elementId: 'discountCalculator', title: 'Discount Calculator', heightClass: 'extra-tall' },
    { name: 'Fuel Cost', category: 'Finance', target: 'fuelCost', elementId: 'fuelCostCalculator', title: 'Fuel Cost Calculator', heightClass: 'extra-tall' },
    { name: 'Profit Margin', category: 'Business', target: 'profitMargin', elementId: 'profitMarginCalculator', title: 'Profit Margin Calculator', heightClass: 'extra-tall' },
    { name: 'Break-Even', category: 'Business', target: 'breakEven', elementId: 'breakEvenCalculator', title: 'Break-Even Calculator', heightClass: 'extra-tall' },
    { name: 'ROI', category: 'Finance', target: 'roi', elementId: 'roiCalculator', title: 'ROI Calculator', heightClass: 'extra-tall' },
    { name: 'Simple Interest', category: 'Finance', target: 'simpleInterest', elementId: 'simpleInterestCalculator', title: 'Simple Interest Calculator', heightClass: 'extra-tall' },
    { name: 'Volume', category: 'Education', target: 'volume', elementId: 'volumeCalculator', title: 'Volume Calculator', heightClass: 'extra-tall' },
    { name: 'Area', category: 'Education', target: 'area', elementId: 'areaCalculator', title: 'Area Calculator', heightClass: 'extra-tall' }
];

function getCalculatorByTarget(type) {
    return calculatorData.find(calculator => calculator.target === type);
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

function updateCalculatorCount(count) {
    const countElement = document.getElementById('calculatorCount');
    if (!countElement) return;
    countElement.textContent = `Showing ${count} ${count === 1 ? 'calculator' : 'calculators'}`;
}

function renderCalculatorList() {
    const listElement = document.getElementById('calculatorList');
    if (!listElement) return;

    const filteredCalculators = getFilteredCalculators();
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
    showCalculator('basic');
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
function showCalculator(type) {
    document.querySelectorAll('.calculator').forEach(calculator => {
        calculator.style.display = 'none';
        calculator.classList.remove('tall', 'extra-tall');
    });

    const calculator = getCalculatorByTarget(type);
    if (!calculator) return;

    const selectedCalculator = document.getElementById(calculator.elementId);
    if (!selectedCalculator) return;

    selectedCalculator.style.display = 'block';

    if (calculator.heightClass) {
        selectedCalculator.classList.add(calculator.heightClass);
    }

    const titleElement = selectedCalculator.querySelector('.calculator-title');
    if (titleElement) {
        titleElement.textContent = calculator.title || calculator.name;
    }

    activeDisplay = type;
    renderCalculatorList();
}

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

function showCalculator(type) {
    document.querySelectorAll('.calculator').forEach(calculator => {
        calculator.style.display = 'none';
        calculator.classList.remove('tall', 'extra-tall');
    });

    const calculator = getCalculatorByTarget(type);
    if (!calculator) return;

    const selectedCalculator = document.getElementById(calculator.elementId);
    if (!selectedCalculator) return;

    selectedCalculator.style.display = 'block';

    if (calculator.heightClass) {
        selectedCalculator.classList.add(calculator.heightClass);
    }

    const titleElement = selectedCalculator.querySelector('.calculator-title');
    if (titleElement) {
        titleElement.textContent = calculator.title || calculator.name;
    }

    activeDisplay = type;
    renderCalculatorList();
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


