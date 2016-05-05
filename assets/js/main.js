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
	if (!isNaN(inputValue) || inputValue == '.') {
		
		// Check if the previous input was also a digit
		if (!isNaN(lastInput) || lastInput == '.') {
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
		var memory = parseFloat(workingCalculationArray[0]);
		var currentOperand;
		
		for (var i = 1; i < workingCalculationArray.length; i++) {
			console.log("Start loop: i is " + workingCalculationArray[i]);
			console.log("i = " + i);
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
					memory = parseFloat(workingCalculationArray[i]);
				} else {
					workingCalculationArray[i] = currentOperand.performOperation(memory, workingCalculationArray[i]);
					memory = workingCalculationArray[i];
					workingCalculationArray[i-1] = null;
					workingCalculationArray[i-2] = null;
					console.log("finised loop");
					console.log(workingCalculationArray);
				}
			}
		}
		console.log(workingCalculationArray);
		workingCalculationArray = workingCalculationArray.filter(function(n){return n != null});
		console.log(workingCalculationArray);
	}

	return workingCalculationArray[0];
}


// Operand Class
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
* Variables
**/
var validOperands = ['+', '-', '*', '/', '^'];

// validInputDigits is most likely no longer needed, as I'm now checking via isNaN. Leaving it commented for now, just in case.
//var validInputDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];


var calculator = new Calculator();