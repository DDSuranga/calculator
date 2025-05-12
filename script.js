let memory = 0;
let activeDisplay = 'basic';

let display, displayScientific;

function showCalculator(type) {
    document.getElementById('basicCalculator').style.display = type === 'basic' ? 'block' : 'none';
    document.getElementById('scientificCalculator').style.display = type === 'scientific' ? 'block' : 'none';
    document.getElementById('unitConverter').style.display = type === 'unit' ? 'block' : 'none';
    document.getElementById('currencyConverter').style.display = type === 'currency' ? 'block' : 'none';
    document.getElementById('ageCalculator').style.display = type === 'age' ? 'block' : 'none';
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
            result = to === 'Fahrenheit' ? (input * 9/5) + 32 : input + 273.15;
        } else if (from === 'Fahrenheit') {
            result = to === 'Celsius' ? (input - 32) * 5/9 : (input - 32) * 5/9 + 273.15;
        } else if (from === 'Kelvin') {
            result = to === 'Celsius' ? input - 273.15 : (input - 273.15) * 9/5 + 32;
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

// CURRENCY CONVERTER LOGIC - With Emoji Flags
const currencies = [
    // Asia
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
    { code: "PKR", name: "Pakistani Rupee", symbol: "₨", flag: "🇵🇰" },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", flag: "🇧🇩" },
    { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs", flag: "🇱🇰" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
    { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
    { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
    { code: "VND", name: "Vietnamese Dong", symbol: "₫", flag: "🇻🇳" },
    { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
    { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩" },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
    { code: "PHP", name: "Philippine Peso", symbol: "₱", flag: "🇵🇭" },
    { code: "SGD", name: "Singapore Dollar", symbol: "$", flag: "🇸🇬" },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "$", flag: "🇭🇰" },
    { code: "IRR", name: "Iranian Rial", symbol: "﷼", flag: "🇮🇷" },
    { code: "ILS", name: "Israeli Shekel", symbol: "₪", flag: "🇮🇱" },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
    { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦" },
    { code: "OMR", name: "Omani Rial", symbol: "﷼", flag: "🇴🇲" },
    { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },
    { code: "NPR", name: "Nepalese Rupee", symbol: "₨", flag: "🇳🇵" },
    { code: "MMK", name: "Myanmar Kyat", symbol: "K", flag: "🇲🇲" },
    { code: "KHR", name: "Cambodian Riel", symbol: "៛", flag: "🇰🇭" },
    { code: "LAK", name: "Laotian Kip", symbol: "₭", flag: "🇱🇦" },
    { code: "MVR", name: "Maldivian Rufiyaa", symbol: "ރ.", flag: "🇲🇻" },
    { code: "AFN", name: "Afghan Afghani", symbol: "؋", flag: "🇦🇫" },
    { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
    { code: "MNT", name: "Mongolian Tugrik", symbol: "₮", flag: "🇲🇳" },
    { code: "BTN", name: "Bhutanese Ngultrum", symbol: "Nu.", flag: "🇧🇹" },
    { code: "BND", name: "Brunei Dollar", symbol: "$", flag: "🇧🇳" },
    { code: "MUR", name: "Mauritian Rupee", symbol: "₨", flag: "🇲🇺" },
    { code: "SCR", name: "Seychelles Rupee", symbol: "₨", flag: "🇸🇨" },

    // Europe
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
    { code: "CHF", name: "Swiss Franc", symbol: "₣", flag: "🇨🇭" },
    { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴", flag: "🇺🇦" },
    { code: "HUF", name: "Hungarian Forint", symbol: "Ft", flag: "🇭🇺" },
    { code: "PLN", name: "Polish Zloty", symbol: "zł", flag: "🇵🇱" },
    { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
    { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
    { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽", flag: "🇷🇺" },

    // Americas
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
    { code: "CAD", name: "Canadian Dollar", symbol: "$", flag: "🇨🇦" },
    { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
    { code: "ARS", name: "Argentine Peso", symbol: "$", flag: "🇦🇷" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
    { code: "CLP", name: "Chilean Peso", symbol: "$", flag: "🇨🇱" },
    { code: "COP", name: "Colombian Peso", symbol: "$", flag: "🇨🇴" },
    { code: "PEN", name: "Peruvian Sol", symbol: "S/", flag: "🇵🇪" },
    { code: "UYU", name: "Uruguayan Peso", symbol: "$", flag: "🇺🇾" },
    { code: "BOB", name: "Bolivian Boliviano", symbol: "Bs.", flag: "🇧🇴" },
    { code: "GTQ", name: "Guatemalan Quetzal", symbol: "Q", flag: "🇬🇹" },
    { code: "CRC", name: "Costa Rican Colón", symbol: "₡", flag: "🇨🇷" },
    { code: "NIO", name: "Nicaraguan Córdoba", symbol: "C$", flag: "🇳🇮" },

    // Africa
    { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
    { code: "TZS", name: "Tanzanian Shilling", symbol: "Sh", flag: "🇹🇿" },
    { code: "UGX", name: "Ugandan Shilling", symbol: "Sh", flag: "🇺🇬" },
    { code: "XOF", name: "West African CFA Franc", symbol: "Fr", flag: "🌍" },
    { code: "XAF", name: "Central African CFA Franc", symbol: "Fr", flag: "🌍" },
    { code: "EGP", name: "Egyptian Pound", symbol: "£", flag: "🇪🇬" },

    // Middle East
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
    { code: "SAR", name: "Saudi Riyal", symbol: "﷼", flag: "🇸🇦" },
    { code: "QAR", name: "Qatari Riyal", symbol: "﷼", flag: "🇶🇦" },
    { code: "OMR", name: "Omani Rial", symbol: "﷼", flag: "🇴🇲" },
    { code: "BHD", name: "Bahraini Dinar", symbol: ".د.ب", flag: "🇧🇭" },
    { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
    { code: "LBP", name: "Lebanese Pound", symbol: "ل.ل", flag: "🇱🇧" },

    // Oceania
    { code: "AUD", name: "Australian Dollar", symbol: "$", flag: "🇦🇺" },
    { code: "NZD", name: "New Zealand Dollar", symbol: "$", flag: "🇳🇿" },
    { code: "FJD", name: "Fiji Dollar", symbol: "$", flag: "🇫🇯" },
    { code: "PGK", name: "Papua New Guinean Kina", symbol: "K", flag: "🇵🇬" }
];

function updateCurrencies() {
    const fromSelect = document.getElementById('currencyFrom');
    const toSelect = document.getElementById('currencyTo');

    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';

    currencies.forEach(curr => {
        const optionFrom = document.createElement('option');
        optionFrom.value = curr.code;
        optionFrom.text = `${curr.flag} ${curr.name} (${curr.symbol})`;

        const optionTo = document.createElement('option');
        optionTo.value = curr.code;
        optionTo.text = `${curr.flag} ${curr.name} (${curr.symbol})`;

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
        const response = await fetch(`https://api.exchangerate.host/latest?base= ${from}`);
        const data = await response.json();
        const rate = data.rates[to];

        if (!rate) throw new Error("Rate not found");

        const result = amount * rate;

        document.getElementById('currencyDisplay').value = `${amount} ${from} = ${result.toFixed(2)} ${to}`;
    } catch (error) {
        document.getElementById('currencyDisplay').value = "Error fetching rate";
        console.error("Conversion error:", error);
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

// AGE CALCULATOR LOGIC
function calculateAge() {
    const birthDateInput = document.getElementById('birthDateInput').value;
    const display = document.getElementById('ageDisplay');

    if (!birthDateInput) {
        display.value = "Please select a date.";
        return;
    }

    const birthDate = new Date(birthDateInput);
    const today = new Date();

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
    const daysUntil = diff;

    const display = document.getElementById('nextBirthdayDisplay');
    display.innerText = `🎂 Next birthday in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
}

function clearAge() {
    document.getElementById('birthDateInput').value = '';
    document.getElementById('ageDisplay').value = '';
    document.getElementById('nextBirthdayDisplay').innerText = '';
}

// KEYBOARD SUPPORT
document.addEventListener('keydown', function (e) {
    if (document.activeElement.tagName === 'INPUT') return;

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