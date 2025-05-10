// Get the display element
const display = document.getElementById('display');

// Memory variables
let memory = 0;

// Function to append a character to the display
function appendToDisplay(value) {
    display.value += value;
}

// Function to clear the display
function clearDisplay() {
    display.value = '';
}

// Function to delete the last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Function to calculate the result
function calculate() {
    try {
        let expression = display.value;
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');

        // Handle percentage calculation
        if (expression.includes('%')) {
            expression = expression.replace(/([0-9.]+)%/g, '($1/100)');
        }

        // Handle power calculation
        if (expression.includes('^')) {
            calculatePower();
            return;
        }

        display.value = eval(expression);
    } catch (error) {
        display.value = 'Error';
    }
}

// Memory Functions
function memoryAdd() {
    memory += parseFloat(display.value) || 0;
    clearDisplay();
}

function memorySubtract() {
    memory -= parseFloat(display.value) || 0;
    clearDisplay();
}

function memoryRecall() {
    appendToDisplay(memory);
}

function memoryClear() {
    memory = 0;
}

// Scientific Functions
function calculateTrig(func) {
    const value = parseFloat(display.value);
    if (!isNaN(value)) {
        switch (func) {
            case 'sin':
                display.value = Math.sin(value * Math.PI / 180).toFixed(6);
                break;
            case 'cos':
                display.value = Math.cos(value * Math.PI / 180).toFixed(6);
                break;
            case 'tan':
                display.value = Math.tan(value * Math.PI / 180).toFixed(6);
                break;
        }
    } else {
        display.value = 'Error';
    }
}

function calculateLog() {
    const value = parseFloat(display.value);
    display.value = !isNaN(value) ? Math.log10(value).toFixed(6) : 'Error';
}

function calculateExp() {
    const value = parseFloat(display.value);
    display.value = !isNaN(value) ? Math.exp(value).toFixed(6) : 'Error';
}

function calculateSqrt() {
    const value = parseFloat(display.value);
    display.value = !isNaN(value) ? Math.sqrt(value).toFixed(6) : 'Error';
}

// Power calculation
function calculatePower() {
    const parts = display.value.split('^');
    if (parts.length === 2) {
        const base = parseFloat(parts[0]);
        const exponent = parseFloat(parts[1]);
        display.value = (!isNaN(base) && !isNaN(exponent)) ? Math.pow(base, exponent).toFixed(6) : 'Error';
    }
}

// Add keyboard functionality
document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', '%', '^'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
