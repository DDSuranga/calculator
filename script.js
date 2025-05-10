// Get the display element
const display = document.getElementById('display');

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
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**');

        // Handle percentage calculation
        if (expression.includes('%')) {
            expression = expression.replace(/([0-9.]+)%/g, '($1/100)');
        }

        display.value = eval(expression);
    } catch (error) {
        display.value = 'Error';
    }
}

// Function to calculate the square root
function calculateSqrt() {
    try {
        const value = parseFloat(display.value);
        if (isNaN(value)) {
            display.value = 'Error';
        } else {
            display.value = Math.sqrt(value);
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// Add keyboard functionality
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', 'Enter', 'Backspace', '%', '^'].includes(key)) {
        switch (key) {
            case 'Enter':
                calculate();
                break;
            case 'Backspace':
                deleteLast();
                break;
            default:
                appendToDisplay(key);
                break;
        }
    }

    if (key === '*') appendToDisplay('×');
    if (key === '/') appendToDisplay('÷');
});
