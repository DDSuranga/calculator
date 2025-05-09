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
        display.value = eval(display.value);  // Simple evaluation of the expression
    } catch (error) {
        display.value = 'Error';  // Show error if the calculation fails
    }
}

// Add keyboard functionality
document.addEventListener('keydown', function(event) {
    const key = event.key;

    // If the key is a number or operator, append it to the display
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '*', '/', '.', 'Enter', 'Backspace'].includes(key)) {
        switch (key) {
            case 'Enter': // "=" key (calculate)
                calculate();
                break;
            case 'Backspace': // "DEL" key (delete last character)
                deleteLast();
                break;
            default:
                appendToDisplay(key);
                break;
        }
    }
});
