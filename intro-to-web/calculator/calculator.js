const buttons = document.querySelectorAll(".calc-button");
const screen = document.querySelector(".screen");
const operators = ['÷', 'x', '-', '+', '=']
const operations = []

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        const buttonText = buttons[i].innerText
        console.log("click", buttonText);
        if (buttonText === 'C') {
            clearScreen()
        }
        else if (buttonText === '←') {
            backspace()
        }
        else if (operators.includes(buttonText)) {
            operate(buttonText)
        }
        else {
            writeNumberOnScreen(buttonText)
        } 
    });
}


function writeNumberOnScreen(number) {
    const numberOnScreen = getNumberOnScreen()
    numberOnScreen === '0' ? screen.innerText = number : screen.innerText += number
}

function getNumberOnScreen() {
    return screen.innerText
}

function clearScreen() {
    screen.innerText = '0'
}

function operate(buttonText) {
    if (buttonText === '=') {
        const {firstTerm, operator} = operations[operations.length - 1]
        console.log(firstTerm)
        lastTerm = getNumberOnScreen()
        result = calculateResult(firstTerm, operator, lastTerm)
        screen.innerText = result
        operations.pop()
    }
    else {
        operations.push({
            firstTerm: getNumberOnScreen(),
            operator: buttonText
        })
        screen.innerText = '0'
    }
    
}

function calculateResult(firstTerm, operator, lastTerm) {
    firstTerm = Number.parseInt(firstTerm)
    lastTerm = Number.parseInt(lastTerm)
    switch (operator) {
        case '÷':
            return firstTerm / lastTerm
        case 'x':
            return firstTerm * lastTerm
        case '-':
            return firstTerm - lastTerm
        case '+':
            return firstTerm + lastTerm
    }
}

function backspace() {
    const numberOnScreen = getNumberOnScreen()
    let newNumber = numberOnScreen.substring(0, numberOnScreen.length - 1)
    screen.innerText = newNumber === '' ? '0' : newNumber 
}