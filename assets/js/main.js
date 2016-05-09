$(document).ready(function() {
	console.log("jQuery loaded");
});



/**
* Calculator Class
**/
function Calculator() {
	this.baseCalculation = new Calculation;
	this.validOperands = ['+', '-', '*', '/', '^'];
}

// Returns the calculation object which the inputted values should be entered into.
// For example, if we have several parentheses this will return the last open one.
Calculator.prototype.findInputTarget = function(calculation, closeParenthesis = false, previousCalculation = null) {
	
	// The last element of the calculationArray we're looking at.
	var lastElement = calculation.calculationArray[calculation.calculationArray.length-1];

	if (lastElement && lastElement.constructor.name == "Calculation" && lastElement.isOpen) {	
		// If the input was a closing parenthesis, we set the last calculation to 'closed', and return the 2nd from last calcualtion.
		// Todo - This could do with refactoring/cleaning up?
		if (closeParenthesis && lastElement.calculationArray[lastElement.calculationArray.length-1]) {
			if (!(lastElement.calculationArray[lastElement.calculationArray.length-1].constructor.name == "Calculation") ||
				(lastElement.calculationArray[lastElement.calculationArray.length-1].constructor.name == "Calculation" &&
				!(lastElement.calculationArray[lastElement.calculationArray.length-1].isOpen))) {
				lastElement.isOpen = false;
				return calculation;			
			}
		} 
		return this.findInputTarget(lastElement, closeParenthesis, calculation);
	}

	return calculation;
}

// Add either a digit or operand onto the current operation.
Calculator.prototype.receiveInput = function(inputValue) {
	console.log("---receiveInput---");

	var closeParenthesis = inputValue == ')' ? true : false;
	var currentCalculation = this.findInputTarget(this.baseCalculation, closeParenthesis).calculationArray;
	var lastInput = currentCalculation[currentCalculation.length-1];
	
	// Special cases regarding operands as first input.
	if (currentCalculation.length == 0 && this.isValidOperand(inputValue)) {
		if (inputValue == '-') {
			currentCalculation.push(inputValue);
		}
		return;
	}

	// Special case for using a negative number as first input.
	// Addition causes the calculation to be cleared, while all other operands are ignored.
	if (currentCalculation[0] == '-' && !this.isValidDigit(inputValue)) {
		if (inputValue == '+') {
			this.findInputTarget(this.baseCalculation).calculationArray = [];
		}
		return;
	}

	// Check if the input is a digit.
	if (!isNaN(inputValue) || inputValue == '.') {
		// Check if the previous input was also a digit.
		if (!isNaN(lastInput) || lastInput == '.' || currentCalculation[0] == '-') {
			currentCalculation[currentCalculation.length-1] = lastInput + inputValue;
		}
		else {
			currentCalculation.push(inputValue);
		}
	// Check if the input is an operand.
	} else if (this.isValidOperand(inputValue)) {
		currentCalculation.push(new Operand(inputValue));
	}

	// Parentheses
	if (inputValue == '(') {
		currentCalculation.push(new Calculation);
	}
}

// Returns true if the input value is either a digit or '.'
Calculator.prototype.isValidDigit = function(inputValue) {
	return (!isNaN(inputValue) || inputValue == '.') ? true : false;
}

// Returns true if the input value is an operand
Calculator.prototype.isValidOperand = function(inputValue) {
	return (this.validOperands.indexOf(inputValue) >= 0) ? true : false;
}

// Performs all calculations, including inner parentheses, and returns the answer.
Calculator.prototype.calculateAll = function() {
	return this.baseCalculation.runCalculation(this.baseCalculation);
}

/**
* Calculation Class
**/
function Calculation() {
	// An array to store the numbers and operands making up the calculation.
	this.calculationArray = [];

	// Specifies whether the parentheses of this calculation are open or have been closed.
	// This will be set to false when the user enters a ')', signaling the calculator to
	// ignore it while chosing an input target.
	this.isOpen = true;
}

// Returns the answer of this calculation.
// Recursively solves parentheses as calculation objects of their own.
Calculation.prototype.runCalculation = function(workingCalculationArray) {
	// Create a copy of the calculationArray if necessary, to ensure we're not altering the original array.
	if (workingCalculationArray.constructor.name == "Calculation") {
		workingCalculationArray = $.extend([], workingCalculationArray.calculationArray);
	}

	// Check for any numbers (or parentheses) next to parentheses and insert the required multiplication operand.
	var i = 0;
	while (i < workingCalculationArray.length) {
		if (workingCalculationArray[i].constructor.name == "Calculation") {
			if (workingCalculationArray[i-1] && !isNaN(workingCalculationArray[i-1])) {
				workingCalculationArray.splice(i, 0, new Operand('*'));
				i++;
			}
			if (workingCalculationArray[i+1] && (!isNaN(workingCalculationArray[i+1]) || workingCalculationArray[i+1].constructor.name == "Calculation")) {
				workingCalculationArray.splice(i+1, 0, new Operand('*'));
			}
			if (workingCalculationArray[i].length == 1) {
				workingCalculationArray[i] = workingCalculationArray[i].calculationArray[0];
			}
		}
		i++;
	}

	while (workingCalculationArray.length > 1 || workingCalculationArray[0].constructor.name == "Calculation") {
		// If the first element is a parenthesis, evaluate it first and replace it with its value.
		// We specify this since we usually skip the first element in the for loop.
		if (isNaN(workingCalculationArray[0])) {
			workingCalculationArray[0] = workingCalculationArray[0].runCalculation(workingCalculationArray[0]);
		}
		
		var memory = parseFloat(workingCalculationArray[0]);
		var currentOperand;
		
		for (var i = 1; i < workingCalculationArray.length; i++) {
			// Check if the object we're looking at is a parenthesis. If so, calculate it first.
			if (workingCalculationArray[i].constructor.name == "Calculation") {
				workingCalculationArray[i] = workingCalculationArray[i].runCalculation(workingCalculationArray[i]);
			}

			if (workingCalculationArray[i].constructor.name == "Operand") {
				currentOperand = workingCalculationArray[i];
			} else {
				// Check if the following operand takes priority by order of operations.
				if (workingCalculationArray[i+1] && workingCalculationArray[i+1].priority > currentOperand.priority) {
					memory = parseFloat(workingCalculationArray[i]);
				} else {
					workingCalculationArray[i] = currentOperand.performOperation(memory, workingCalculationArray[i]);
					memory = workingCalculationArray[i];
					workingCalculationArray[i-1] = null;
					workingCalculationArray[i-2] = null;
				}
			}
		}
		// Remove all null values (numbers we've already calculated) from the array.
		workingCalculationArray = workingCalculationArray.filter(function(n){return n != null});
		console.log(workingCalculationArray);
	}

	return workingCalculationArray[0];
}

/**
* Operand Class
**/
function Operand(symbol) {
	switch (symbol) {
		case '+':
			this.priority = 1;
			this.performOperation = function(a, b) {
				return parseFloat(a) + parseFloat(b);
			}
			break;
		case '-':
			this.priority = 1;
			this.performOperation = function(a, b) {
				return parseFloat(a) - parseFloat(b);
			}
			break;
		case '*':
			this.priority = 2;
			this.performOperation = function(a, b) {
				return parseFloat(a) * parseFloat(b);
			}
			break;
		case '/':
			this.priority = 2;
			this.performOperation = function(a, b) {
				return parseFloat(a) / parseFloat(b);
			}
			break;
		case '^':
			this.priority = 3;
			this.performOperation = function(a, b) {
				return Math.pow(a, b);
			}
	}
}

/**
* Other Functions
**/

var calculator = new Calculator();