// Todo - Implement some kind of rounding, to avoid gettings irrational results.

// Todo - Prevent equals button from being used when there isn't actually anything to calculate.

// Todo - If output display says 'Infinity', the calculation array should be reset to empty, so that the next input will start a new calculation.

/**
* Calculator Class
**/
function Calculator() {
	this.baseCalculation = new Calculation(true);
	this.screen = new Screen;
	this.inputSystem = new InputSystem;
	this.validOperators = ['+', '-', '*', '/', '^'];
}

// Returns the calculation object which the inputted value should be entered into.
// For example, if we have several parentheses this will return the last open one.
Calculator.prototype.findInputTarget = function(calculation, closeParenthesis = false) {
	// The last element of the calculationArray we're looking at.
	var lastElement = calculation.calculationArray[calculation.calculationArray.length-1];

	if (lastElement && lastElement.constructor.name == "Calculation" && lastElement.isOpen) {
		var innerCalculation = lastElement.calculationArray[lastElement.calculationArray.length-1];

		if (closeParenthesis && innerCalculation && (innerCalculation.constructor.name != "Calculation" || !innerCalculation.isOpen)) {
			lastElement.isOpen = false;
			this.screen.closeParenthesis();
			return calculation;
		}

		return this.findInputTarget(lastElement, closeParenthesis);
	}

	return calculation;
}

// Recieve an input from the user, and 
// Add either a digit or operator onto the current operation.
Calculator.prototype.receiveInput = function(inputValue) {
	var closeParenthesis = inputValue == ')' ? true : false;
	var currentCalculation = this.findInputTarget(this.baseCalculation, closeParenthesis).calculationArray;
	var lastElement = currentCalculation[currentCalculation.length-1];	

	// If the lastElement is a number, the variable 'lastInput' is its final digit.
	if (!isNaN(lastElement)) {
		var finalDigit = lastElement.slice(-1);
	}

	// Special case for using a negative number as first input.
	// Addition causes the calculation to be cleared, while all other operators are ignored.
	// Todo - Refactor this into the operator input section below.
	if (currentCalculation[0] == '-' && !this.isValidDigit(inputValue)) {
		if (inputValue == '+') {
			this.findInputTarget(this.baseCalculation).calculationArray = [];
			this.screen.replaceLastCharacter('');
		}
		return;
	}

	if (inputValue == '.') { // ----- Handle input of decimal points -----
		
		// Prevent input if the number already contains a decimal.
		if (!isNaN(lastElement) && lastElement.indexOf('.') != -1) {
			return;
		} else if (currentCalculation.length < 1 || lastElement.constructor.name == 'Operator'|| lastElement == '-') {
			this.receiveInput('0');
		}

		this.pushInput(currentCalculation, '.', '.', true);

	} else if (!isNaN(inputValue)) { // ----- Handle input of digits -----
		
		if (lastElement == '0') {
			currentCalculation.pop();
			console.log(currentCalculation);
			this.screen.replaceLastCharacter('');
			lastElement = currentCalculation[currentCalculation.length-1];
		}

		if (!isNaN(lastElement) || finalDigit == '.' || currentCalculation[0] == '-') {
			this.pushInput(currentCalculation, inputValue, inputValue, true);
		} else {
			this.pushInput(currentCalculation, inputValue, inputValue);
		}
	
	} else if (this.isValidOperator(inputValue)) { // ----- Handle input of operators -----
		
		// Operators as will be ignored as first input, except for '-'.
		if (currentCalculation.length == 0) {
			if (inputValue == '-') {
				this.pushInput(currentCalculation, inputValue, inputValue);
			}
			return;
		}

		// If the previous input is also an operator, replace it with the new one.
		if (currentCalculation[currentCalculation.length-1].constructor.name == "Operator") {
			currentCalculation[currentCalculation.length-1] = new Operator(inputValue);
			calculator.screen.replaceLastCharacter(inputValue);
			return;
		}

		if (finalDigit == '.') {
			currentCalculation[currentCalculation.length-1] = lastElement.substring(0, lastElement.length-1);
			this.screen.replaceLastCharacter('');
		}
		this.pushInput(currentCalculation, new Operator(inputValue), inputValue);

	} else if (inputValue == '(') { // ----- Handle input of open parenthesis -----
		this.pushInput(currentCalculation, new Calculation, '(');
	}
}

// Pushes input to the calculation array, adds it to the input screen, and displays the current answer on the output screen.
// AppendDigit toggles whether the input is a digit being added to the end of a current number.
Calculator.prototype.pushInput = function(calculation, pushValue, displayValue, appendingDigit = false) {
	if (appendingDigit) {
		var lastElement = calculation[calculation.length-1];
		calculation[calculation.length-1] = lastElement + pushValue;
	} else {
		calculation.push(pushValue);
	}

	if (displayValue == '(') {
		this.screen.openNewParenthesis();
	}
	
	this.screen.updateInputDisplay(displayValue);	
	
	if (!isNaN(pushValue) && this.readyToCalculate(this.baseCalculation)) {
		this.calculateAll();
	}

	this.screen.setInputDisplayFontSize();
}

// Remove the user's previous input via the 'C' button.
Calculator.prototype.removePreviousInput = function() {
	var currentCalculation = this.findInputTarget(this.baseCalculation);

	// Check if the current calculation is empty. Only remove if it is NOT the base calculation.
	if (currentCalculation.calculationArray.length == 0) {
		if (!currentCalculation.isBaseCalculation) {
			currentCalculation.isOpen = false;
			var outerCalculation = this.findInputTarget(this.baseCalculation).calculationArray;
			outerCalculation.pop();
			this.screen.removeParenthesis();
			this.calculateAll();
		}
		return;
	}

	var currentCalculation = currentCalculation.calculationArray;
	var lastElement = currentCalculation[currentCalculation.length-1];
	var secondLastElement = currentCalculation[currentCalculation.length-2];

	if (!isNaN(lastElement)) {
		// Remove the last digit of the number
		currentCalculation[currentCalculation.length-1] = lastElement.substring(0, lastElement.length-1);
		this.screen.replaceLastCharacter('');
		if (currentCalculation[currentCalculation.length-1].length == 0) {
			currentCalculation.pop();
		}
	} else if (lastElement.constructor.name == "Operator" || lastElement == '-') {
		// Remove the last operator.
		currentCalculation.pop();
		this.screen.replaceLastCharacter('');
	} else if (!lastElement.isOpen) {
		// If the last element is a closed parenthesis, open it, removing the closing bracket.
		currentCalculation[currentCalculation.length-1].isOpen = true;
		this.screen.replaceLastCharacter('');
		this.screen.openNewParenthesis();
	}

	if (this.readyToCalculate(this.baseCalculation)) {
		this.screen.setInputDisplayFontSize();
		this.calculateAll();
	} else {
		this.screen.clearOutputDisplay();
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

Calculator.prototype.readyToCalculate = function(calculation) {
	var baseArray = calculation.calculationArray;
	if (baseArray.length > 2) {
		return true;
	} else if (baseArray.length == 2 && baseArray[0].constructor.name != "Operator" && baseArray[1].constructor.name != "Operator") {
		return true;
	} else if (baseArray[0] && baseArray[0].constructor.name == "Calculation" && baseArray[0].calculationArray.length > 0) {
		return this.readyToCalculate(baseArray[0]);
	}

	this.screen.updateOutputDisplay('');
	return false;
}

// Performs all calculations, including inner parentheses, and returns the answer.
Calculator.prototype.calculateAll = function() {
	console.log("----------Running Calculate All----------");
	var currentAnswer = this.baseCalculation.runCalculation(this.baseCalculation.calculationArray);
	this.screen.updateOutputDisplay(currentAnswer);
	return currentAnswer;
}

// Starts a new base calculation, containing only the result of the previous calculation.
Calculator.prototype.equals = function() {
	if (this.readyToCalculate(this.baseCalculation)) {
		var answer = this.calculateAll().toString();
		this.screen.closeAllParentheses();
		this.baseCalculation = new Calculation(true);
		this.baseCalculation.calculationArray.push(answer);
		this.screen.equalsAnimation(answer);
	}
}

/**
* Calculation Class
**/
function Calculation(isBaseCalculation = false) {
	// An array to store the numbers and operators making up the calculation.
	this.calculationArray = [];

	// Specifies whether the parentheses of this calculation are open or have been closed.
	// This will be set to false when the user enters a ')', signaling the calculator to ignore the calculation while chosing an input target.
	this.isOpen = true;

	// Ensures that the base calculation cannot be deleted.
	this.isBaseCalculation = isBaseCalculation;
}

// Insert the implied multiplication operators between parentheses and adjacent parentheses or numbers.
// E.g. between '1(2+3)' or '(2+3)(4+5)'.
Calculation.prototype.insertMultiplicationOperators = function(calculation) {
	var i = 0;
	while (i < calculation.length) {
		if (calculation[i].constructor.name == "Calculation") {
			if (calculation[i].calculationArray.length < 1) {
				calculation.splice(i);
				i--;
			} else {
				if (calculation[i-1] && !isNaN(calculation[i-1])) {
					calculation.splice(i, 0, new Operator('*'));
					i++;
				}
				if (calculation[i+1] && (!isNaN(calculation[i+1]) || calculation[i+1].constructor.name == "Calculation")) {
					calculation.splice(i+1, 0, new Operator('*'));
				}
				if (calculation[i].calculationArray.length == 1) {
					if (calculation[i].calculationArray[0] == '-') {
						calculation.splice(i);
					} else {
						calculation[i] = calculation[i].calculationArray[0];
						i--;
					}
					
				}	
			}			
		}
		i++;
	}

	return calculation;
}

// Returns the answer of the calculation.
// Loops through the calcuation several times, evaluating higher priority operations first, 
// leaving the lower priority operations to deal with the resulting value on the next loop.
// For example '1+2*3' would, after the first loop, be simplified to '1+6', as * has a higher priority than '+',
// therefore associating the '2' with the '*' rather than the '+'.
// After performing an operation we set the used elements to null, and remove all null values at the end of the loop.
Calculation.prototype.runCalculation = function(inputCalculation) {
	// Create a copy of the calculationArray, to ensure we're not altering the original array.
	var workingCalculationArray = $.extend([], inputCalculation);

	if (workingCalculationArray.length == 0 || workingCalculationArray.length == 1 && workingCalculationArray[0] == '-') {
		return 0;
	}

	workingCalculationArray = this.insertMultiplicationOperators(workingCalculationArray);

	// Loop through the calculation array multiple times, gradually simplifying it until it contains only one element.
	while (workingCalculationArray.length > 1 || workingCalculationArray[0].constructor.name == "Calculation") {
		
		if (isNaN(workingCalculationArray[0])) {
			workingCalculationArray[0] = workingCalculationArray[0].runCalculation(workingCalculationArray[0].calculationArray);
		}
		
		var memory = parseFloat(workingCalculationArray[0]);
		var currentOperator;

		for (var i = 1; i < workingCalculationArray.length; i++) {
			
			// If the element is a calculation, replace it with the number it evaluates to. 
			if (workingCalculationArray[i].constructor.name == "Calculation") {
				workingCalculationArray[i] = workingCalculationArray[i].runCalculation(workingCalculationArray[i].calculationArray);
			}

			if (workingCalculationArray[i].constructor.name == "Operator" && workingCalculationArray[i+1]) {
				currentOperator = workingCalculationArray[i];
			} else if (workingCalculationArray[i+1] && workingCalculationArray[i+1].priority > currentOperator.priority) {
				memory = parseFloat(workingCalculationArray[i]);
			} else {
				// If, at this point, the current element is an operator, it means the last element of the calculation is an operator.
				// This would result in an infinite loop since there is nothing to calculate it with (e.g. 3*blank), so it must be removed.
				if (workingCalculationArray[i].constructor.name == "Operator") {
					workingCalculationArray[i] = null;
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

	// A string of ')'s to be faintly desplayed after the inputDisplay, representing the number of currently open parentheses.
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
	$('#open-parentheses').css('display', 'inline-block');
}

// Used when adding the closing bracket to a parenthesis.
Screen.prototype.closeParenthesis = function() {
	this.updateInputDisplay(')');
	this.openParentheses = this.openParentheses.substring(0, this.openParentheses.length-1);
	$('#open-parentheses').text(this.openParentheses);
	
	if (this.openParentheses.length == 0) {
		$('#open-parentheses').css('padding', '5px 0px 5px 0px');
	}
}

// Used when removing the closing bracket from a parenthesis.
Screen.prototype.removeParenthesis = function() {
	this.replaceLastCharacter('');
	this.openParentheses = this.openParentheses.substring(0, this.openParentheses.length-1);
	$('#open-parentheses').text(this.openParentheses);
	if (this.openParentheses == '') {
		$('#open-parentheses').css('display', 'none');
	}
}

Screen.prototype.clearScreen = function() {
	calculator.screen.clearInputDislay();
	calculator.screen.clearOutputDisplay();
	$('#open-parentheses').text('');
	$('#open-parentheses').css('padding', '5px 0px 5px 0px');
	calculator.screen.openParentheses = '';
}

// Replace the last character of the input display. For use when user changes mind about which operator to use.
Screen.prototype.replaceLastCharacter = function(newCharacter) {
	this.inputDisplay = this.inputDisplay.substring(0, this.inputDisplay.length-1);
	this.inputDisplay += newCharacter;
	$('#input-display').text(this.inputDisplay);
}

// Resizes the font based on the numer of characters in the input/output display.
Screen.prototype.setInputDisplayFontSize = function() {
	var inputFontSize = this.findCorrectFontSize();

	$('#input-display').css('font-size', inputFontSize);
	$('#open-parentheses').css('font-size', inputFontSize);
}

Screen.prototype.closeAllParentheses = function() {
	this.openParentheses = '';
	$('#open-parentheses').empty();
	$('#open-parentheses').css('display', 'none');
}

// Returns the correct font size for the input display, based on how many characters it contains.
Screen.prototype.findCorrectFontSize = function() {
	var inputCharacters = this.inputDisplay.length;

	if (inputCharacters < 14) {
		return 40;
	} else if (inputCharacters >= 14 && inputCharacters < 25) {
		return 40-(2*(inputCharacters-14));
	} else {
		return 18;
	}
}

Screen.prototype.equalsAnimation = function(answer) {
	var originalFontSize = $('#output-display').css('font-size');
	this.inputDisplay = answer;
	$('#input-display').text('');

	var animateOutput = function() {
		fontSize = calculator.screen.findCorrectFontSize();
		$('#output-display').animate({"font-size":fontSize, "bottom": "66px"}, 500);
	}

	var resetPositions = function(answer) {
		if (!calculator.skippingAnimation) {
			$('#input-display').text(calculator.screen.inputDisplay);
			calculator.screen.clearOutputDisplay();
			$('#output-display').css('bottom', '0px');
			$('#output-display').css('font-size', '30px');
			calculator.screen.setInputDisplayFontSize();
		} else {
			calculator.skippingAnimation = false;
		}
	}

	animateOutput();
	setTimeout(function() {
		resetPositions(answer);
	}, 600);

}

// If the 'equals' animation is currently running, skip to the end of it.
Screen.prototype.skipEqualsAnimation = function() {
	if ($('#output-display').is(':animated')) {
		$('#output-display').finish();
		calculator.skippingAnimation = true;

		// Todo - this code is written twice: once here and once in the original function for if the animation is not skipped.
		// Refactor it so that the code is only actually written once.
		$('#input-display').text(this.inputDisplay);
		calculator.screen.clearOutputDisplay();
		$('#output-display').css('bottom', '0px');
		$('#output-display').css('font-size', '30px');
	}		
}

/**
* InputSystem Class
**/

function InputSystem() {
	this.pressedKeys = [];
}

// Controls the animation when a button is pressed, either via the mouse or keyboard.
InputSystem.prototype.buttonHighlightOn = function(btn, inputMethod, keyCode = '') {
	if (inputMethod == 'keyboard') {
		btn = $('#btn-' + btn);
	}

	var originalBtnColor = $(btn).css('background-color');
	$(btn).css('background-color', '#D3D3D3');
	$(btn).css('color', originalBtnColor);

	if (inputMethod == 'mouse') {
		$(btn).mouseleave(function() {
			calculator.buttonPressUp(btn, originalBtnColor);
		});
	} else {
		$(document).keyup(function() {
			var index = calculator.inputSystem.pressedKeys.indexOf(keyCode);
			if (index > -1) {
				calculator.inputSystem.pressedKeys.splice(index);
			}

			calculator.buttonPressUp(btn, originalBtnColor);
		});
	}
}

InputSystem.prototype.keyboardInput = function(keyCode, shiftKey) {
	var keyValue = '';
	var keyId = '';

	if (keyCode >= 48 && keyCode <= 57 && !shiftKey) {
		keyValue = (keyCode - 48).toString();
	} else if (keyCode >= 96 && keyCode <= 105) {
		keyValue = (keyCode - 96).toString();
	} else {
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
			case 110:
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

	if (keyValue != '') {
		calculator.receiveInput(keyValue);
		keyId = keyId == '' ? keyValue : keyId;
	} else if (keyCode == 13 || keyCode == 187) {
		calculator.equals();
		var keyId = 'equals';
	} else if (keyCode == 67 || keyCode == 8 || keyCode == 46) {
		calculator.removePreviousInput();
		var keyId = 'c';
	}

	this.pressedKeys.push(keyCode);
	this.buttonHighlightOn(keyId, 'keyboard', keyCode);
}

// Todo - Refactor this into the InputSystem class.
Calculator.prototype.buttonPressUp = function(btn, originalBtnColor) {
	$(btn).css('background-color', originalBtnColor);
	$(btn).css('color', 'white');
}

$(document).ready(function() {
	
	// Mouse hovers over calculator button.
	$('.btn').mouseenter(function() {
		calculator.inputSystem.buttonHighlightOn(this, 'mouse');
	});

	// Handle mouse clicks 
	$('.btn').mousedown(function() {
		calculator.screen.skipEqualsAnimation();
		var btnValue = $(this).text().trim();
		console.log("btnValue = " + btnValue);
		if (btnValue == '=') {
			calculator.equals();
		} else if (btnValue == 'C') {
			calculator.removePreviousInput();
		} else {
			calculator.receiveInput(btnValue);
		}
	});

	// Handle key presses
	$(document).keydown(function(key) {
		if (calculator.inputSystem.pressedKeys.indexOf(key.keyCode) < 0) {
			calculator.screen.skipEqualsAnimation();
			var keyCode = parseInt(key.keyCode);
			calculator.inputSystem.keyboardInput(keyCode, key.shiftKey);
		}
	});

});




var calculator = new Calculator();


/* Known Bugs */
// 