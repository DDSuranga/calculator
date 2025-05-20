let memory = 0;
let activeDisplay = 'basic';
let display, displayScientific;

function showCalculator(type) {
    document.getElementById('basicCalculator').style.display = type === 'basic' ? 'block' : 'none';
    document.getElementById('scientificCalculator').style.display = type === 'scientific' ? 'block' : 'none';
    document.getElementById('unitConverter').style.display = type === 'unit' ? 'block' : 'none';
    document.getElementById('currencyConverter').style.display = type === 'currency' ? 'block' : 'none';
    document.getElementById('ageCalculator').style.display = type === 'age' ? 'block' : 'none';
    document.getElementById('dateDifferenceCalculator').style.display = type === 'date' ? 'block' : 'none';
    document.getElementById('timeDifferenceCalculator').style.display = type === 'time' ? 'block' : 'none';
    document.getElementById('percentageCalculator').style.display = type === 'percentage' ? 'block' : 'none';
    document.getElementById('percentageChangeCalculator').style.display = type === 'percentageChange' ? 'block' : 'none';
    document.getElementById('tipCalculator').style.display = type === 'tip' ? 'block' : 'none';
    document.getElementById('vatCalculator').style.display = type === 'vat' ? 'block' : 'none';
    activeDisplay = type;
}

window.onload = function () {
    showCalculator('basic');
    display = document.getElementById('display');
    displayScientific = document.getElementById('displayScientific');
    updateUnits();
    updateCurrencies();
};

function getCurrentDisplay() {
    return activeDisplay === 'scientific' ? displayScientific : display;
}

function appendToDisplay(value) {
    const input = getCurrentDisplay();
    const lastFuncPattern = /Math\.\w+$/;
    if (lastFuncPattern.test(input.value)) {
        input.value = input.value.replace(lastFuncPattern, value);
    } else {
        input.value += value;
    }
}

function clearDisplay() {
    getCurrentDisplay().value = '';
}

function deleteLast() {
    const input = getCurrentDisplay();
    input.value = input.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = getCurrentDisplay().value
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/√/g, 'Math.sqrt');

        let openParens = (expression.match(/\(/g) || []).length;
        let closeParens = (expression.match(/\)/g) || []).length;

        while (closeParens < openParens) {
            expression += ')';
            closeParens++;
        }

        getCurrentDisplay().value = eval(expression);
    } catch {
        getCurrentDisplay().value = 'Error';
    }
}

// Memory Functions
function memoryAdd() {
    try {
        const result = eval(getCurrentDisplay().value);
        memory += isNaN(result) ? 0 : result;
    } catch {}
}

function memorySubtract() {
    try {
        const result = eval(getCurrentDisplay().value);
        memory -= isNaN(result) ? 0 : result;
    } catch {}
}

function memoryRecall() {
    getCurrentDisplay().value = memory.toString();
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
            temperature: '°'
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

// CURRENCY CONVERTER LOGIC
const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "INR", name: "Indian Rupee" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "HKD", name: "Hong Kong Dollar" },
    { code: "SEK", name: "Swedish Krona" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "ZAR", name: "South African Rand" },
    { code: "AED", name: "UAE Dirham" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "DKK", name: "Danish Krone" },
    { code: "ILS", name: "Israeli Shekel" },
    { code: "IRR", name: "Iranian Rial" },
    { code: "ISK", name: "Icelandic Króna" },
    { code: "KRW", name: "South Korean Won" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "PKR", name: "Pakistani Rupee" },
    { code: "PLN", name: "Polish Zloty" },
    { code: "RUB", name: "Russian Ruble" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "THB", name: "Thai Baht" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "TWD", name: "New Taiwan Dollar" },
    { code: "UAH", name: "Ukrainian Hryvnia" },
    { code: "VND", name: "Vietnamese Dong" },
    { code: "XAF", name: "Central African CFA Franc" },
    { code: "XOF", name: "West African CFA Franc" },
    { code: "ZAR", name: "South African Rand" }
];

function updateCurrencies() {
    const fromSelect = document.getElementById('currencyFrom');
    const toSelect = document.getElementById('currencyTo');
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    const sortedCurrencies = [...currencies].sort((a, b) => a.name.localeCompare(b.name));

    sortedCurrencies.forEach(curr => {
        const optionFrom = document.createElement('option');
        optionFrom.value = curr.code;
        optionFrom.text = `${curr.name} (${curr.code})`;

        const optionTo = document.createElement('option');
        optionTo.value = curr.code;
        optionTo.text = `${curr.name} (${curr.code})`;

        fromSelect.appendChild(optionFrom);
        toSelect.appendChild(optionTo);
    });

    fromSelect.value = 'USD';
    toSelect.value = 'INR';
}

async function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyInput').value);
    const from = document.getElementById('currencyFrom').value;
    const to = document.getElementById('currencyTo').value;

    if (isNaN(amount)) {
        document.getElementById('currencyDisplay').value = "Invalid input";
        return;
    }

    try {
        const response = await fetch(`https://api.frankfurter.app/latest?amount= ${amount}&from=${from}&to=${to}`);
        const data = await response.json();

        if (!data.rates || !data.rates[to]) {
            throw new Error("Rate not found");
        }

        const result = data.rates[to];
        document.getElementById('currencyDisplay').value = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    } catch (error) {
        console.error("Conversion error:", error.message);
        document.getElementById('currencyDisplay').value = "Error fetching rate";
    }
}

function swapCurrencies() {
    const from = document.getElementById('currencyFrom');
    const to = document.getElementById('currencyTo');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
}

function clearCurrency() {
    document.getElementById('currencyInput').value = '';
    document.getElementById('currencyDisplay').value = '';
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
    display.innerText = `🎉 Next birthday in ${diff} day${diff !== 1 ? 's' : ''}`;
}

function clearAge() {
    document.getElementById('birthDateInput').value = '';
    document.getElementById('ageDisplay').value = '';
    document.getElementById('nextBirthdayDisplay').innerText = '';
}

// DATE DIFFERENCE CALCULATOR
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

// TIME DIFFERENCE CALCULATOR
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
    displaySeconds.innerText = `Total Seconds: ${seconds}`;
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

// VAT / DISCOUNT CALCULATOR
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