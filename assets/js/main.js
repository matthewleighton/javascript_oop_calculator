/**
* Calculator Class
**/
function Calculator() {
	
	// An array of calculation objects. We're always targeting the last element.
	// This array will have multiple elements when we have unclosed parenthasies.
	this.baseCalculation = new Calculation;
	//this.openCalculations = [new Calculation];
	this.validOperands = ['+', '-', '*', '/', '^'];
}

// Returns the calculation object which the inputted values should be entered into.
// For example, if we have several open parentheses, this will return the most recently opened calculation.
Calculator.prototype.findInputTarget = function(calculation) {
	var lastCalculation = calculation.calculationArray[calculation.calculationArray.length-1];
	
	if (lastCalculation && lastCalculation.constructor.name == "Calculation") {
		return this.findInputTarget(lastCalculation);
	}
	//return lastCalculation;
	return calculation;
}

// Add either a digit or operand onto the current operation.
Calculator.prototype.receiveInput = function(inputValue) {
	var currentCalculation = this.findInputTarget(this.baseCalculation).calculationArray;

	//var currentCalculation = this.openCalculations[this.openCalculations.length-1].calculationArray;
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

	// Opening parentheses
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
	return this.baseCalculation.runCalculation();
}

/**
* Calculation Class
**/
function Calculation() {
	this.calculationArray = [];
}

// Returns the answer of this calculation.
// Recursively solves parentheses as calculation objects of their own.
Calculation.prototype.runCalculation = function() {
	var workingCalculationArray = this.calculationArray;

	while (workingCalculationArray.length > 1 || workingCalculationArray[0].constructor.name == "Calculation") {
		// If the first element is a parenthesis, evaluate it first and replace it with its value.
		// We do this since we usually skip the first element in the for loop.
		if (isNaN(workingCalculationArray[0])) {
			workingCalculationArray[0] = workingCalculationArray[0].runCalculation();
		}
		var memory = parseFloat(workingCalculationArray[0]);
		var currentOperand;
		
		for (var i = 1; i < workingCalculationArray.length; i++) {
			// Check if the object we're looking at is a parenthesis.
			// If so, calculate it first.
			//console.log(workingCalculationArray[i]);
			if (workingCalculationArray[i].constructor.name == "Calculation") {
				console.log("gszfgz");
				workingCalculationArray[i] = workingCalculationArray[i].runCalculation();
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