const display = document.getElementById('display');
let memory = 0;

// Append value to display
function appendToDisplay(value) {
    display.value += value;
}

// Clear display
function clearDisplay() {
    display.value = '';
}

// Delete last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Evaluate expression
function calculate() {
    try {
        let expression = display.value
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**');

        // Handle percentages
        expression = expression.replace(/([0-9.]+)%/g, '($1/100)');

        const result = eval(expression);
        display.value = result;
    } catch (error) {
        display.value = 'Error';
    }
}

// Square root
function calculateSqrt() {
    try {
        const value = parseFloat(display.value);
        if (isNaN(value)) throw new Error();
        display.value = Math.sqrt(value);
    } catch {
        display.value = 'Error';
    }
}

// Scientific functions
function calculateTrig(func) {
    try {
        const value = parseFloat(display.value);
        if (isNaN(value)) throw new Error();
        const radians = value * Math.PI / 180;
        display.value = Math[func](radians).toFixed(8);
    } catch {
        display.value = 'Error';
    }
}

function calculateLog() {
    try {
        const value = parseFloat(display.value);
        if (isNaN(value) || value <= 0) throw new Error();
        display.value = Math.log10(value).toFixed(8);
    } catch {
        display.value = 'Error';
    }
}

function calculateExp() {
    try {
        const value = parseFloat(display.value);
        if (isNaN(value)) throw new Error();
        display.value = Math.exp(value).toFixed(8);
    } catch {
        display.value = 'Error';
    }
}

// Memory functions
function memoryAdd() {
    try {
        const value = parseFloat(display.value);
        if (!isNaN(value)) memory += value;
    } catch {}
}

function memorySubtract() {
    try {
        const value = parseFloat(display.value);
        if (!isNaN(value)) memory -= value;
    } catch {}
}

function memoryRecall() {
    display.value = memory;
}

function memoryClear() {
    memory = 0;
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (['0','1','2','3','4','5','6','7','8','9','+','-','*','/','.','%','^'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key.toLowerCase() === 'c') {
        clearDisplay();
    } else if (key === 's') {
        calculateSqrt();
    }
});
