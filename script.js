let memory = 0;

function showCalculator(type) {
    const calculator = document.getElementById('calculator');
    calculator.style.display = (type === 'basic') ? 'block' : 'none';
}

window.onload = function () {
    showCalculator('basic');
};

const display = document.getElementById('display');

function appendToDisplay(value) {
    if (value === '√') {
        display.value += 'Math.sqrt(';
    } else {
        display.value += value;
    }
}

function clearDisplay() {
    display.value = '';
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let expression = display.value.replace(/÷/g, '/').replace(/×/g, '*');
        display.value = eval(expression);
    } catch (error) {
        display.value = 'Error';
    }
}

function memoryAdd() {
    try {
        memory += parseFloat(eval(display.value) || 0);
    } catch { }
}

function memorySubtract() {
    try {
        memory -= parseFloat(eval(display.value) || 0);
    } catch { }
}

function memoryRecall() {
    display.value = memory.toString();
}

// Keyboard support
document.addEventListener('keydown', function (e) {
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
    } else if (e.key === 'r') {
        appendToDisplay('√');
    } else if (e.key === '^') {
        appendToDisplay('**');
    }
});
