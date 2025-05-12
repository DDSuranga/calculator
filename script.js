let memory = 0;
let activeDisplay = 'basic';

let display, displayScientific;

function showCalculator(type) {
    const basicCalculator = document.getElementById('basicCalculator');
    const scientificCalculator = document.getElementById('scientificCalculator');

    if (type === 'basic') {
        basicCalculator.style.display = 'block';
        scientificCalculator.style.display = 'none';
        activeDisplay = 'basic';
    } else {
        basicCalculator.style.display = 'none';
        scientificCalculator.style.display = 'block';
        activeDisplay = 'scientific';
    }
}

window.onload = function () {
    showCalculator('basic');
    display = document.getElementById('display');
    displayScientific = document.getElementById('displayScientific');
};

function getCurrentDisplay() {
    return activeDisplay === 'scientific' ? displayScientific : display;
}

function appendToDisplay(value) {
    const input = getCurrentDisplay();
    const lastFuncPattern = /Math\.\w+$/;

    // If the last thing is a function like Math.sin, replace it
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

// Keyboard support
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