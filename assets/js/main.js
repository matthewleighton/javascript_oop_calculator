/**
* Classes
**/

//Calculator Class
function Calculator() {
	
	// An array of calculation objects. We're always targeting the last element.
	// This array will have multiple elements when we have unclosed parenthasies.
	this.openCalculations = [new Calculation];

	
}

Calculator.prototype.receiveInput = function(inputValue) {
	var currentCalculation = this.openCalculations[this.openCalculations.length-1].calculationArray;
	var lastInput = currentCalculation[currentCalculation.length-1];

	// Check if the input is a digit
	if (validInputDigits.indexOf(inputValue) >= 0) {
		// Check if the previous input was also a digit
		if (validInputDigits.indexOf(lastInput) >= 0) {
			currentCalculation[currentCalculation.length-1] = lastInput + inputValue;
		}
		else {
			currentCalculation.push(inputValue);
		}
	// Check if the input is an operand
	} else if (validOperands.indexOf(inputValue) >= 0) {
		currentCalculation.push(new Operand(inputValue));
	}
}

Calculator.prototype.calculateAll = function() {
	return this.openCalculations[0].runCalculation();
}




// Calculation Class
function Calculation() {
	this.calculationArray = [];
}

Calculation.prototype.runCalculation = function() {
	var workingCalculationArray = this.calculationArray;

	while (workingCalculationArray.length > 1) {
		var memory = parseInt(workingCalculationArray[0]);
		var currentOperand;
		
		for (var i = 1; i < workingCalculationArray.length; i++) {
			// Check if the object we're looking at is a parenthesis.
			// If so, calculate it first.
			if (workingCalculationArray[i].constructor.name == "Calculation") {
				workingCalculationArray[i] = workingCalculationArray[i].runCalculation;
			}
			if (workingCalculationArray[i].constructor.name == "Operand") {
				currentOperand = workingCalculationArray[i];
			} else {
				// Check if the following operand takes priority by order of operations.
				if (workingCalculationArray[i+1] && workingCalculationArray[i+1].priority > currentOperand.priority) {
					memory = parseInt(workingCalculationArray[i]);
				} else {
					workingCalculationArray[i] = currentOperand.performOperation(memory, workingCalculationArray[i]);
					workingCalculationArray[i-1] = null;
					workingCalculationArray[i-2] = null;
				}
			}
		}

		workingCalculationArray = workingCalculationArray.filter(function(n){return n != null});
	}

	return workingCalculationArray[0];
}


// Operand Class
function Operand(symbol) {
	switch (symbol) {
		case '+':
			this.priority = 1;
			this.performOperation = function(a, b) {
				return parseInt(a) + parseInt(b);
			}
			break;
		case '-':
			this.priority = 1;
			this.performOperation = function(a, b) {
				return parseInt(a) - parseInt(b);
			}
			break;
		case '*':
			this.priority = 2;
			this.performOperation = function(a, b) {
				return parseInt(a) * parseInt(b);
			}
			break;
		case '/':
			this.priority = 2;
			this.performOperation = function(a, b) {
				return parseInt(a) / parseInt(b);
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
* Variables
**/
var validInputDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
var validOperands = ['+', '-', '*', '/', '^'];


var calculator = new Calculator();