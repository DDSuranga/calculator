let memory = 0;

function showCalculator(type) {
    document.getElementById('basicCalculator').style.display = type === 'basic' ? 'block' : 'none';
    document.getElementById('scientificCalculator').style.display = type === 'scientific' ? 'block' : 'none';

    clearDisplay(); // clear textbox when switching modes
}

window.onload = () => {
    showCalculator('basic');
};

function getCurrentDisplay() {
    return document.getElementById(
        document.getElementById('scientificCalculator').style.display === 'block' ? 'displayScientific' : 'displayBasic'
    );
}

function appendToDisplay(value) {
    const display = getCurrentDisplay();
    display.value += value;
}

function clearDisplay() {
    document.getElementById('displayBasic').value = '';
    document.getElementById('displayScientific').value = '';
}

function deleteLast() {
    const display = getCurrentDisplay();
    display.value = display.value.slice(0, -1);
}

function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function calculate() {
    const display = getCurrentDisplay();
    try {
        const result = eval(display.value);
        display.value = result;
    } catch {
        display.value = 'Error';
    }
}

function memoryAdd() {
    const display = document.getElementById('displayBasic');
    try {
        memory += parseFloat(eval(display.value) || 0);
    } catch {}
}

function memorySubtract() {
    const display = document.getElementById('displayBasic');
    try {
        memory -= parseFloat(eval(display.value) || 0);
    } catch {}
}

function memoryRecall() {
    document.getElementById('displayBasic').value = memory.toString();
}

// Enable pasting into text boxes
document.getElementById('displayBasic').readOnly = false;
document.getElementById('displayScientific').readOnly = false;

// Keyboard support
document.addEventListener('keydown', function (e) {
    const key = e.key;
    if (!isNaN(key) || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
        appendToDisplay(key);
    } else if (key === 'Enter') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key.toLowerCase() === 'c') {
        clearDisplay();
    }
});
