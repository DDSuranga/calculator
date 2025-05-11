let memory = 0;
let activeDisplay = 'basic';

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
};

const display = document.getElementById('display');
const displayScientific = document.getElementById('displayScientific');

function getCurrentDisplay() {
    return activeDisplay === 'scientific' ? displayScientific : display;
}

function appendToDisplay(value) {
    getCurrentDisplay().value += value;
}

function appendFunction(func) {
    const disp = getCurrentDisplay();
    const lastFuncPattern = /Math\.\w+\($/;
    if (lastFuncPattern.test(disp.value)) {
        disp.value = disp.value.replace(lastFuncPattern, func + '(');
    } else {
        disp.value += func + '(';
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
        memory += parseFloat(eval(display.value) || 0);
    } catch {}
}

function memorySubtract() {
    try {
        memory -= parseFloat(eval(display.value) || 0);
    } catch {}
}

function memoryRecall() {
    display.value = memory.toString();
}

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
    } else if (e.key === '^') {
        appendToDisplay('**');
    }
});
