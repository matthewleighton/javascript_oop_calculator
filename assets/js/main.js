// Todo - Implement some kind of rounding, to avoid gettings irrational results.

/**
* Calculator Class
**/
function Calculator() {
	this.baseCalculation = new Calculation;
	this.screen = new Screen;
	this.validOperators = ['+', '-', '*', '/', '^'];
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
				this.screen.closeParenthesis();
				return calculation;			
			}
		} 
		return this.findInputTarget(lastElement, closeParenthesis, calculation);
	}

	return calculation;
}

// Recieve an input from the user, and 
// Add either a digit or operator onto the current operation.
Calculator.prototype.receiveInput = function(inputValue) {
	console.log("---receiveInput---");
	console.log(this.baseCalculation);

	// Todo - If the user changes their current operator, the operator on the input display should change,
	// rather than simply appending the new operator as it currently does.

	var closeParenthesis = inputValue == ')' ? true : false;
	var currentCalculation = this.findInputTarget(this.baseCalculation, closeParenthesis).calculationArray;
	var lastInput = currentCalculation[currentCalculation.length-1];
	
	// Special cases regarding operators as first input.
	if (currentCalculation.length == 0 && this.isValidOperator(inputValue)) {
		if (inputValue == '-') {
			this.pushInput(currentCalculation, inputValue, inputValue);
			//currentCalculation.push(inputValue);
			//this.screen.updateInputDisplay(inputValue);
		}
		return;
	}

	// Special case for using a negative number as first input.
	// Addition causes the calculation to be cleared, while all other operators are ignored.
	if (currentCalculation[0] == '-' && !this.isValidDigit(inputValue)) {
		if (inputValue == '+') {
			this.findInputTarget(this.baseCalculation).calculationArray = [];
			this.screen.replaceOperator('');
		}
		return;
	}

	// If both the previous and current inputs are operators, replace the previous operator with the new one.
	// Todo - refactor/tidy this?
	if (isNaN(inputValue) &&
		currentCalculation.length > 0 &&
		currentCalculation[currentCalculation.length-1].constructor.name == "Operator" &&
		calculator.isValidOperator(inputValue)) {
			currentCalculation[currentCalculation.length-1] = new Operator(inputValue);
			calculator.screen.replaceOperator(inputValue);
			return;
	}

	// Check if the input is a digit.
	if (!isNaN(inputValue) || inputValue == '.') {
		// Check if the previous input was also a digit.
		if (!isNaN(lastInput) || lastInput == '.' || currentCalculation[0] == '-') {
			//currentCalculation[currentCalculation.length-1] = lastInput + inputValue;
			this.pushInput(currentCalculation, inputValue, inputValue, true);
		}
		else {
			//currentCalculation.push(inputValue);
			this.pushInput(currentCalculation, inputValue, inputValue);
		}
	// Check if the input is an operator.
	} else if (this.isValidOperator(inputValue)) {
		//currentCalculation.push(new Operator(inputValue));
		this.pushInput(currentCalculation, new Operator(inputValue), inputValue);
	}

	// Parentheses
	if (inputValue == '(') {
		//currentCalculation.push(new Calculation);
		this.pushInput(currentCalculation, new Calculation, '(');
	}

	//this.screen.updateInputDisplay(inputValue);
}

// Pushes input to the calculation array, adds it to the input screen, and displays the current answer on the output screen.
// AppendDigit toggles whether the input is a digit being added to the end of a current number.
Calculator.prototype.pushInput = function(calculation, pushValue, displayValue, appendingDigit = false) {
	if (appendingDigit) {
		var lastDigit = calculation[calculation.length-1];
		calculation[calculation.length-1] = lastDigit + pushValue;
	} else {
		calculation.push(pushValue);
	}

	if (displayValue == '(') {
		this.screen.openNewParenthesis();
	}

	
	this.screen.updateInputDisplay(displayValue);	
	
	if (!isNaN(pushValue)) {
		var currentAnswer = this.calculateAll();
		this.screen.updateOutputDisplay(currentAnswer);
	}
}

// Returns true if the input value is either a digit or '.'
Calculator.prototype.isValidDigit = function(inputValue) {
	return (!isNaN(inputValue) || inputValue == '.') ? true : false;
}

// Returns true if the input value is an operator.
Calculator.prototype.isValidOperator = function(inputValue) {
	return (this.validOperators.indexOf(inputValue) >= 0) ? true : false;
}

// Performs all calculations, including inner parentheses, and returns the answer.
Calculator.prototype.calculateAll = function() {
	return this.baseCalculation.runCalculation(this.baseCalculation);
}

/**
* Calculation Class
**/
function Calculation() {
	// An array to store the numbers and operators making up the calculation.
	this.calculationArray = [];

	// Specifies whether the parentheses of this calculation are open or have been closed.
	// This will be set to false when the user enters a ')', signaling the calculator to
	// ignore the calculation while chosing an input target.
	this.isOpen = true;
}

// Removes trailing operations (e.g. '1+1+') from the workingCalculationArray, ensuring the program won't fail trying to calculate them.
Calculation.prototype.ignoreTrailingOperations = function(calculation) {
	var lastElement = calculation[calculation.length-1];
	console.log("HELLO?");
	console.log(lastElement);
	if (lastElement && !isNaN(lastElement)) {
		return calculation;
	} else if (lastElement && lastElement.constructor.name == "Operator" || lastElement == '-') {
		console.log("Removing trailing operator!!!");
		calculation.pop();
		return calculation;
	} else if (lastElement && lastElement.constructor.name == "Calculation") {
		console.log("ignoreTrailingOperations() - calculation");
		//var newCalculation = $.extend([], )
		calculation[calculation.length-1].calculationArray = this.ignoreTrailingOperations(lastElement.calculationArray);
		if (!lastElement.calculationArray.length > 0) {
			calculation.pop();
			return this.ignoreTrailingOperations(calculation);
		}
		return calculation;
	}

	console.log("Nothing triggered in ignoreTrailingOperations");

	return calculation;
}

// Returns the answer of this calculation.
// Recursively solves parentheses as calculation objects of their own.
Calculation.prototype.runCalculation = function(workingCalculationArray) {
	// Create a copy of the calculationArray if necessary, to ensure we're not altering the original array.
	//if (workingCalculationArray.constructor.name == "Calculation") {
		var workingCalculationArray = $.extend([], workingCalculationArray.calculationArray);
	//}

	console.log("Before removing operations, calculation is...");
	console.log(workingCalculationArray);

	//
	workingCalculationArray = this.ignoreTrailingOperations(workingCalculationArray);

	console.log("After removing operations, calculation is...");
	console.log(workingCalculationArray);

	if (workingCalculationArray.length == 0) {
		return 0;
	}

	// Check for any numbers (or parentheses) next to parentheses and insert the required multiplication operator.
	var i = 0;
	while (i < workingCalculationArray.length) {
		if (workingCalculationArray[i].constructor.name == "Calculation") {
			if (workingCalculationArray[i-1] && !isNaN(workingCalculationArray[i-1])) {
				workingCalculationArray.splice(i, 0, new Operator('*'));
				i++;
			}
			if (workingCalculationArray[i+1] && (!isNaN(workingCalculationArray[i+1]) || workingCalculationArray[i+1].constructor.name == "Calculation")) {
				workingCalculationArray.splice(i+1, 0, new Operator('*'));
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
		var currentOperator;
		
		for (var i = 1; i < workingCalculationArray.length; i++) {
			// Check if the object we're looking at is a parenthesis. If so, calculate it first.
			if (workingCalculationArray[i].constructor.name == "Calculation") {
				workingCalculationArray[i] = workingCalculationArray[i].runCalculation(workingCalculationArray[i]);
			}

			if (workingCalculationArray[i].constructor.name == "Operator") {
				currentOperator = workingCalculationArray[i];
			} else {
				// Check if the following operator takes priority by order of operations.
				if (workingCalculationArray[i+1] && workingCalculationArray[i+1].priority > currentOperator.priority) {
					memory = parseFloat(workingCalculationArray[i]);
				} else {
					workingCalculationArray[i] = currentOperator.performOperation(memory, workingCalculationArray[i]);
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
* Operator Class
**/
function Operator(symbol) {
	switch (symbol) {
		case '+':
			this.priority = 1;
			this.performOperation = function(a, b) {
				return parseFloat(a) + parseFloat(b);
			}
			this.operatorName = '+';
			break;
		case '-':
			this.priority = 1;
			this.performOperation = function(a, b) {
				return parseFloat(a) - parseFloat(b);
			}
			this.operatorName = '-';
			break;
		case '*':
			this.priority = 2;
			this.performOperation = function(a, b) {
				return parseFloat(a) * parseFloat(b);
			}
			this.operatorName = '*';
			break;
		case '/':
			this.priority = 2;
			this.performOperation = function(a, b) {
				return parseFloat(a) / parseFloat(b);
			}
			this.operatorName = '/';
			break;
		case '^':
			this.priority = 3;
			this.performOperation = function(a, b) {
				return Math.pow(a, b);
			}
			this.operatorName = '^';
			break;
	}
}

/**
* Screen Class
**/

function Screen() {
	this.inputDisplay = '';
	this.outputDisplay = '';

	// A string of ')'s to be faintly desplayed after the inputDisplay,
	// representing the number of currently open parentheses.
	this.openParentheses = '';
}

Screen.prototype.clearInputDislay = function() {
	this.inputDisplay = '';
	$('#input-display').text('');
}

Screen.prototype.updateInputDisplay = function(value) {
	this.inputDisplay += value;
	$('#input-display').text(this.inputDisplay);
}

Screen.prototype.clearOutputDisplay = function() {
	this.outputDisplay = '';
	$('#output-display').text('');
}

Screen.prototype.updateOutputDisplay = function(value) {
	this.outputDisplay = value;
	$('#output-display').text(value);
}

Screen.prototype.openNewParenthesis = function() {
	this.openParentheses += ')';
	$('#open-parentheses').text(this.openParentheses);
	$('#open-parentheses').css('padding', '5px 10px 5px 0px');
}

Screen.prototype.closeParenthesis = function() {
	this.updateInputDisplay(')');
	
	this.openParentheses = this.openParentheses.substring(0, this.openParentheses.length-1);
	$('#open-parentheses').text(this.openParentheses);
	
	if (this.openParentheses.length == 0) {
		$('#open-parentheses').css('padding', '5px 0px 5px 0px');
	}
}

Screen.prototype.clearScreen = function() {
	calculator.screen.clearInputDislay();
	calculator.screen.clearOutputDisplay();
	$('#open-parentheses').text('');
	$('#open-parentheses').css('padding', '5px 0px 5px 0px');
	calculator.screen.openParentheses = '';
	calculator.baseCalculation.calculationArray = [];
}

// Replace the last character of the input display. For use when user changes mind about which operator to use.
Screen.prototype.replaceOperator = function(newOperator) {
	this.inputDisplay = this.inputDisplay.substring(0, this.inputDisplay.length-1);
	this.inputDisplay += newOperator;
	$('#input-display').text(this.inputDisplay);
}




var calculator = new Calculator();

/**
* User Interaction
**/

// Controls the animation when a button is pressed, either via the mouse or keyboard.
Calculator.prototype.buttonHighlightOn = function(btn, inputMethod) {
	console.log("Pressed a button");

	if (inputMethod == 'keyboard') {
		//btn = document.getElementById('#btn' )
		btn = $('#btn-' + btn);
	}
	console.log(btn);
	var originalBtnColor = $(btn).css('background-color');
	$(btn).css('background-color', 'd3d3d3');
	$(btn).css('color', originalBtnColor);

	if (inputMethod == 'mouse') {
		$(btn).mouseleave(function() {
			calculator.buttonPressUp(btn, originalBtnColor);
		});
	} else {
		$(document).keyup(function() {
			console.log("QWERRTERTWERWEQEQWE");
			calculator.buttonPressUp(btn, originalBtnColor);
		});
	}
}

Calculator.prototype.buttonPressUp = function(btn, originalBtnColor) {
	$(btn).css('background-color', originalBtnColor);
	$(btn).css('color', 'white');
}

$(document).ready(function() {
	
	// Mouse hovers over calculator button.
	$('.btn').mouseenter(function() {
		calculator.buttonHighlightOn(this, 'mouse');
	});
/*
	// Buttons change color on mouse hover.
	$('.btn').mouseenter(function() {
		var originalBtnColor = $(this).css('background-color');
		$(this).css('background-color', 'd3d3d3');
		$(this).css('color', originalBtnColor);
		$(this).mouseleave(function() {
			$(this).css('background-color', originalBtnColor);
			$(this).css('color', 'white');
		});
	});
*/
	// Handle mouse clicks 
	$('.btn').mousedown(function() {
		var btnValue = $(this).text().trim();
		console.log("btnValue = " + btnValue);
		if (btnValue == '=') {
			var answer = calculator.calculateAll();
			calculator.screen.updateOutputDisplay(answer);
		} else if (btnValue == 'C') {
			calculator.screen.clearScreen();
		} else {
			calculator.receiveInput(btnValue);
		}
	});

	Calculator.prototype.keyboardInput = function(keyCode, shiftKey) {
		console.log("keyboardInput()");
		console.log(keyCode);

		var keyValue = '';
		var keyId = '';

		if (keyCode >= 48 && keyCode <= 57 && !shiftKey) {
			keyValue = (keyCode - 48).toString();
		} else if (keyCode >= 96 && keyCode <= 105) {
			keyValue = (keyCode - 96).toString();
		} else {
			console.log("Entered operations switch");
			switch (keyCode) {
				case 107:
				case 187:
					if ((!shiftKey && keyCode == 107) || (shiftKey && keyCode == 187)) {
						keyValue = '+';
						keyId = 'plus';
					}
					break;
				case 109:
				case 189:
					keyValue = '-';
					keyId = 'minus';
					break;
				case 56:
				case 106:
					keyValue = '*';
					keyId = 'multiply';
					break;
				case 111:
				case 191:
					keyValue = '/';
					keyId = 'divide';
					break;
				case 54:
					keyValue = '^';
					keyId = 'exponent';
					break;
				case 46:
				case 190:
					keyValue = '.';
					keyId = 'dot';
					break;
				case 57:
					keyValue = '(';
					keyId = 'left-bracket';
					break;
				case 48:
					keyValue = ')';
					keyId = 'right-bracket';
					break;
			}
		}
		console.log('keyValue is...');
		console.log(keyValue);
		if (keyValue != '') {
			calculator.receiveInput(keyValue);
			keyId = keyId == '' ? keyValue : keyId;
		} else if (keyCode == 13 || keyCode == 187) {
			var answer = calculator.calculateAll();
			calculator.screen.updateOutputDisplay(answer);
			var keyId = 'equals';
		} else if (keyCode == 67 || keyCode == 8 || keyCode == 46) {
			calculator.screen.clearScreen();
			var keyId = 'c';
		}

		this.buttonHighlightOn(keyId, 'keyboard');
	}

	// Handle key presses
	$(document).keydown(function(key) {
		//console.log(key);
		var keyCode = parseInt(key.keyCode);
		calculator.keyboardInput(keyCode, key.shiftKey);

		//var keyValue = String.fromCharCode(key.keyCode);

		//console.log(key);

		//calculator.keyboardInput(key.keyCode, keyValue);


		//calculator.receiveInput(key);
		//calculator.buttonPressDown(key, 'keyboard');
	});

	// Both key and mouse inputs should get filtered through the same function.
	// Only numbers or operators should go to recieveInput().


});

