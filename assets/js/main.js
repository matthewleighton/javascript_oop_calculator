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
// For example, if we have several parentheses this will return the last open one.
Calculator.prototype.findInputTarget = function(calculation, endParenthesis = false, previousCalculation = null) {
	console.log("findInputTarget()");
	if (endParenthesis) {
		console.log("end parentheses");
	}
	console.log("Previous calculation at start of function is:");
	console.log(previousCalculation);
	// The last element of the calculationArray we're looking at.
	var lastElement = calculation.calculationArray[calculation.calculationArray.length-1];

	//console.log("Last calculation is ");
	//console.log(lastCalculation);
	
	if (lastElement && lastElement.constructor.name == "Calculation" && lastElement.isOpen) {
		console.log("Last element is an open calculation");
		// If the input was a closing parenthesis, we set the last calculation to 'closed', and return the 2nd from last calcualtion.
		if (endParenthesis && !(lastElement.calculationArray[lastElement.calculationArray.length-1].constructor.name == "Calculation")) {
			console.log("closing parenthesis");
			//lastElement.calculationArray[lastElement.calculationArray.length-1].isOpen = false;
			lastElement.isOpen = false;
			console.log(previousCalculation);
			return calculation;
		}
		console.log("previousCalculation will be:");
		console.log(calculation);
		return this.findInputTarget(lastElement, endParenthesis, calculation);
	}
	//return lastCalculation;
	//console.log("Calculation is:");
	//console.log(calculation);
	return calculation;
}

// Add either a digit or operand onto the current operation.
Calculator.prototype.receiveInput = function(inputValue) {
	console.log("---receiveInput---");
	// Refactor this part
	if (inputValue == ')') {
		var endParenthesis = true;
	} else {
		var endParenthesis = false;
	}
	var currentCalculation = this.findInputTarget(this.baseCalculation, endParenthesis).calculationArray;

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

	// Parentheses
	if (inputValue == '(') {
		currentCalculation.push(new Calculation);
	} /*else if (inputValue == ')') {
		// Thanks to the endParenthesis variable in receive input, we're now targeting the outer calculation again.
		// Although we need some kind of blank value to be entered into it which the system recognises purely as a
		// marker that the previous calculation is done.
		currentCalculation.push(')');
		// Todo - Figure out how to close a parenthesis, and return to the outer calculation.
	}*/
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
	// An array to store the numbers and operands making up the calculation.
	this.calculationArray = [];

	// Specifies whether the parentheses of this calculation are open or have been closed.
	// This will be set to false when the user enters a ')', signaling the calculator to
	// ignore it while chosing an input target.
	this.isOpen = true;
}

// Returns the answer of this calculation.
// Recursively solves parentheses as calculation objects of their own.
Calculation.prototype.runCalculation = function() {
	var workingCalculationArray = this.calculationArray;
	console.log("workingCalculationArray: ");
	console.log(workingCalculationArray);

	while (workingCalculationArray.length > 1 || workingCalculationArray[0].constructor.name == "Calculation") {
		// If the first element is a parenthesis, evaluate it first and replace it with its value.
		// We specify this since we usually skip the first element in the for loop.
		if (isNaN(workingCalculationArray[0])) {
			workingCalculationArray[0] = workingCalculationArray[0].runCalculation();
		}
		var memory = parseFloat(workingCalculationArray[0]);
		var currentOperand;
		
		for (var i = 1; i < workingCalculationArray.length; i++) {
			// Check if the object we're looking at is a parenthesis. If so, calculate it first.
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