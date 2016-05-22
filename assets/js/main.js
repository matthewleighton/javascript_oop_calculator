/**
* Calculator Class
**/
function Calculator() {
	this.baseCalculation = new Calculation(true);
	this.screen = new Screen;
	this.inputSystem = new InputSystem;
	this.validOperators = ['+', '-', '*', '/', '^'];
	this.firstInputAfterEquals = false;
}

// Returns the calculation object which the inputted value should be entered into.
// For example, if we have several parentheses this will return the last open one.
Calculator.prototype.findInputTarget = function(calculation, closeParenthesis = false) {
	var lastElement = calculation.calculationArray[calculation.calculationArray.length-1];

	if (lastElement && lastElement.constructor.name == "Calculation" && lastElement.isOpen) {
		var innerLastElement = lastElement.calculationArray[lastElement.calculationArray.length-1];

		if (closeParenthesis && innerLastElement && innerLastElement != '-' && (innerLastElement.constructor.name != "Calculation" || !innerLastElement.isOpen)) {
			if (innerLastElement.constructor.name == 'Operator') {
				this.removePreviousInput();
			}
			lastElement.isOpen = false;
			this.screen.closeParenthesis();
			this.screen.setInputDisplayFontSize();
			return calculation;
		}

		return this.findInputTarget(lastElement, closeParenthesis);
	}

	return calculation;
}

// Recieve an input from the user, and 
// Add either a digit or operator onto the current operation.
Calculator.prototype.receiveInput = function(inputValue) {
	
	// Regarding receiving the first input after running the equals() function.
	if (this.firstInputAfterEquals) {
		if (this.screen.inputDisplay == 'Infinity' && (!this.isValidOperator(inputValue) || inputValue == '-')) {
			this.screen.clearScreen();
		} else if (this.screen.inputDisplay == 'Infinity') {
			return;
		} else if (!this.isValidOperator(inputValue)) {
			this.baseCalculation = new Calculation(true);
			this.screen.clearScreen();
		}
	}
	this.firstInputAfterEquals = false;

	var closeParenthesis = inputValue == ')' ? true : false;
	var currentCalculation = this.findInputTarget(this.baseCalculation, closeParenthesis).calculationArray;
	var lastElement = currentCalculation[currentCalculation.length-1];

	// If the lastElement is a number, the variable 'lastInput' is its final digit.
	if (!isNaN(lastElement)) {
		var finalDigit = lastElement.slice(-1);
	}

	// Special case for using a negative number as first input.
	// Addition causes the calculation to be cleared, while all other operators are ignored.
	if (currentCalculation[0] == '-' && !this.isValidDigit(inputValue)) {
		if (inputValue == '+') {
			this.findInputTarget(this.baseCalculation).calculationArray = [];
			this.screen.replaceLastInputCharacter('');
		}
		this.screen.setInputDisplayFontSize();
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
			this.screen.replaceLastInputCharacter('');
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
			calculator.screen.replaceLastInputCharacter(inputValue);
			this.screen.setInputDisplayFontSize();
			return;
		}

		if (finalDigit == '.') {
			currentCalculation[currentCalculation.length-1] = lastElement.substring(0, lastElement.length-1);
			this.screen.replaceLastInputCharacter('');
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

	// The current calculation should be removed if it is empty, but only if it is NOT the base calculation.
	if (currentCalculation.calculationArray.length == 0) {
		if (!currentCalculation.isBaseCalculation) {
			currentCalculation.isOpen = false;
			var outerCalculation = this.findInputTarget(this.baseCalculation).calculationArray;
			outerCalculation.pop();
			this.screen.removeOpeningParenthesis();
			
			if (this.readyToCalculate(this.baseCalculation)) {
				this.calculateAll();	
			}
		}

		this.screen.setInputDisplayFontSize();
		return;
	}

	var currentCalculation = currentCalculation.calculationArray;
	var lastElement = currentCalculation[currentCalculation.length-1];
	var secondLastElement = currentCalculation[currentCalculation.length-2];

	if (!isNaN(lastElement)) {
		// Remove the last digit of the number
		currentCalculation[currentCalculation.length-1] = lastElement.substring(0, lastElement.length-1);
		this.screen.replaceLastInputCharacter('');
		if (currentCalculation[currentCalculation.length-1].length == 0) {
			currentCalculation.pop();
		}
	} else if (lastElement.constructor.name == "Operator" || lastElement == '-') {
		// Remove the last operator.
		currentCalculation.pop();
		this.screen.replaceLastInputCharacter('');
	} else if (!lastElement.isOpen) {
		// If the last element is a closed parenthesis, open it, removing the closing bracket.
		currentCalculation[currentCalculation.length-1].isOpen = true;
		this.screen.replaceLastInputCharacter('');
		this.screen.openNewParenthesis();
	}

	if (this.readyToCalculate(this.baseCalculation)) {
		this.calculateAll();
	} else {
		this.screen.clearOutputDisplay();
	}
	this.screen.setInputDisplayFontSize();
}

// Returns true if the input value is either a digit or '.'
Calculator.prototype.isValidDigit = function(inputValue) {
	return (!isNaN(inputValue) || inputValue == '.') ? true : false;
}

// Returns true if the input value is an operator.
Calculator.prototype.isValidOperator = function(inputValue) {
	return (this.validOperators.indexOf(inputValue) >= 0) ? true : false;
}

// Prevents the calculation from running when there isn't actually anything to calculate.
// For example '1', '2+', '(3)', or '(4+'.
Calculator.prototype.readyToCalculate = function(calculation) {
	var baseArray = calculation.calculationArray;
	if (baseArray.length > 2) {
		return true;
	} else if (baseArray.length == 2 && baseArray[0].constructor.name != "Operator" && baseArray[1].constructor.name != "Operator") {
		return true;
	} else if (baseArray[0] && baseArray[0].constructor.name == "Calculation" && baseArray[0].calculationArray.length > 0) {
		return this.readyToCalculate(baseArray[0]);
	}

	if (this.screen.outputDisplay != '') {
		this.screen.updateOutputDisplay('');
	}
	return false;
}

// Performs all calculations, including inner parentheses, and returns the answer.
Calculator.prototype.calculateAll = function() {
	var currentAnswer = this.baseCalculation.runCalculation(this.baseCalculation.calculationArray);
	currentAnswer = this.roundCalculationAnswer(currentAnswer);
	this.screen.updateOutputDisplay(currentAnswer);
	return currentAnswer;
}

// Shortens an answer to 17 characters, avoiding issues such as 10/3 resulting in 3.33335.
Calculator.prototype.roundCalculationAnswer = function(answer) {
	answer = answer.toString();
	if (answer.length < 17 || answer.indexOf('e') > -1) {
		return answer;
	} else {
		return answer.substring(0, 17);
	}
}

// Starts a new base calculation, containing only the result of the previous calculation.
Calculator.prototype.equals = function() {
	if (this.readyToCalculate(this.baseCalculation)) {
		var answer = this.calculateAll().toString();
		this.baseCalculation = new Calculation(true);
		
		if (answer != 'Infinity') {
			this.baseCalculation.calculationArray.push(answer);
		}
		answer = this.convertScientificNotation(answer);
		this.firstInputAfterEquals = true;
		
		this.screen.closeAllParentheses();
		this.screen.equalsAnimation(answer);
	}
}

// If an answer is returned in scientific notation, translate it into an input the calculator can process.
// E.g. '55e+123' becomes '55*10^123'.
Calculator.prototype.convertScientificNotation = function(answer) {
	var indexOfE = answer.indexOf('e');
	if (answer.indexOf('e') > -1) {	
		var numberOfTens = answer.substring(0, indexOfE);
		var indexofPlus = answer.indexOf('+');
		var exponent = answer.substring(indexofPlus+1, answer.length);
		
		answer = '(' + numberOfTens + '*10^' + exponent + ')';
		this.screen.updateOutputDisplay(answer);

		this.baseCalculation = new Calculation(true);
		this.receiveInput('(');
		this.baseCalculation.calculationArray[0].calculationArray[0] = numberOfTens;
		this.baseCalculation.calculationArray[0].calculationArray[1] = new Operator('*');
		this.baseCalculation.calculationArray[0].calculationArray[2] = '10';
		this.baseCalculation.calculationArray[0].calculationArray[3] = new Operator('^');
		this.baseCalculation.calculationArray[0].calculationArray[4] = exponent;
		this.receiveInput(')');
	}

	return answer;
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
		
		// The number we'll be using on the left hand side of the operator. (E.g. '1' in '1+2').
		var memory = parseFloat(workingCalculationArray[0]);
		var currentOperator;

		for (var i = 1; i < workingCalculationArray.length; i++) {
			if (workingCalculationArray[i].constructor.name == "Operator") {
				var currentElement = workingCalculationArray[i].operatorName;
			} else {
				var currentElement = workingCalculationArray[i];
			}

			// If the element is a calculation, replace it with the number it evaluates to. 
			if (workingCalculationArray[i].constructor.name == "Calculation") {
				workingCalculationArray[i] = workingCalculationArray[i].runCalculation(workingCalculationArray[i].calculationArray);
			}

			if (workingCalculationArray[i].constructor.name == "Operator" && workingCalculationArray[i+1] != null) {
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

Screen.prototype.updateInputDisplay = function(value = '') {
	this.inputDisplay += value;
	$('#input-display').text(this.inputDisplay);
	$('#input-display').append("<span id='open-parentheses'>" + this.openParentheses + "</span>");
}

Screen.prototype.clearOutputDisplay = function() {
	this.outputDisplay = '';
	$('#output-display').text('');
}

Screen.prototype.updateOutputDisplay = function(value) {
	this.outputDisplay = value;
	var outputFontSize = this.findCorrectFontSize('output');
	$('#output-display').css('font-size', outputFontSize);
	$('#output-display').text(value);
}

Screen.prototype.openNewParenthesis = function() {
	this.openParentheses += ')';
	$('#open-parentheses').text(this.openParentheses);
	$('#open-parentheses').css('display', 'inline');
}

// Used when adding the closing bracket to a parenthesis.
Screen.prototype.closeParenthesis = function() {
	this.updateInputDisplay(')');
	this.openParentheses = this.openParentheses.substring(0, this.openParentheses.length-1);
	$('#open-parentheses').text(this.openParentheses);
}

// Used when removing the left-hand bracket to a parenthesis.
Screen.prototype.removeOpeningParenthesis = function() {
	this.replaceLastInputCharacter('');
	this.openParentheses = this.openParentheses.substring(0, this.openParentheses.length-1);
	$('#open-parentheses').text(this.openParentheses);
	if (this.openParentheses == '') {
		$('#open-parentheses').css('display', 'none');
	}
}

Screen.prototype.closeAllParentheses = function() {
	this.openParentheses = '';
	$('#open-parentheses').empty();
	$('#open-parentheses').css('display', 'none');
}

Screen.prototype.clearScreen = function() {
	this.clearInputDislay();
	this.clearOutputDisplay();
	$('#open-parentheses').text('');
	$('#open-parentheses').css('padding', '5px 0px 5px 0px');
	calculator.screen.openParentheses = '';
}

// Replace the last character of the input display. For use when user changes their mind about which operator to use.
Screen.prototype.replaceLastInputCharacter = function(newCharacter) {
	this.inputDisplay = this.inputDisplay.substring(0, this.inputDisplay.length-1);
	this.inputDisplay += newCharacter;
	this.updateInputDisplay();
}

// Resizes the font based on the numer of characters in the input display.
Screen.prototype.setInputDisplayFontSize = function() {
	var inputFontSize = this.findCorrectFontSize();
	$('#input-display').css('font-size', inputFontSize);
	$('#open-parentheses').css('font-size', inputFontSize);
}

// Returns the correct font size for either the input or output display, based on how many characters it contains.
Screen.prototype.findCorrectFontSize = function(display = 'input') {
	if (display == 'input') {
		var numberOfCharacters = this.inputDisplay.length + this.openParentheses.length;
		if (numberOfCharacters < 13) {
			return 40;
		} else if (numberOfCharacters >= 13 && numberOfCharacters < 20) {
			var fontSize = 40-(1.8*(numberOfCharacters-13));
			return fontSize;
		} else if (numberOfCharacters >= 20 && numberOfCharacters < 25) {
			var fontSize = 29.2-(1.2*(numberOfCharacters-20));
			return fontSize;
		} else {
			return 23.2;
		}
	} else {
		var numberOfCharacters = this.outputDisplay.toString().length;
		if (numberOfCharacters < 18) {
			return 30;
		} else if (this.outputDisplay.toString().indexOf('e') > -1) {
			return 26;
		} else {
			return 30-(1*(numberOfCharacters-17));
		}
	}
}

Screen.prototype.equalsAnimation = function(answer) {
	var originalFontSize = $('#output-display').css('font-size');
	this.inputDisplay = answer;
	var fontSize = calculator.screen.findCorrectFontSize();
	
	$('#input-display').text('');
	$('#output-display').animate({"font-size":fontSize, "bottom": "66px"}, 500);

	// If the user enters another input before the animation has finished, the positions will be reset via 
	// the skipEqualsAnimation() function before the timeout completes, and will be skipped here.
	setTimeout(function() {
		if (!calculator.skippingAnimation) {
			calculator.screen.updateInputDisplay();
			calculator.screen.resetPositionsAfterEqualsAnimation();
			calculator.screen.setInputDisplayFontSize();
		} else {
			calculator.skippingAnimation = false;
		}
	}, 600);
}

Screen.prototype.resetPositionsAfterEqualsAnimation = function() {
	this.clearOutputDisplay();
	$('#output-display').css('bottom', '0px');
	$('#output-display').css('font-size', '30px');
}

Screen.prototype.skipEqualsAnimation = function() {
	if ($('#output-display').is(':animated')) {
		$('#output-display').finish();
		calculator.skippingAnimation = true;

		this.updateInputDisplay();
		this.resetPositionsAfterEqualsAnimation();
	}		
}

Screen.prototype.runClearAnimation = function() {
	$('#clear-animation').css('opacity', '1');
	$('#clear-animation').animate({'bottom':'550px'}, 500);
	setTimeout(function() {
		calculator.screen.clearScreen();
		$('#clear-animation').animate({'opacity':'0'}, 200);
		setTimeout(function() {
			$('#clear-animation').css('bottom', '270px');
		}, 200);
	}, 500);
}

/**
* InputSystem Class
**/

function InputSystem() {
	this.pressedKeys = [];
}

// Controls the animation when a button is pressed via either the mouse or keyboard.
InputSystem.prototype.buttonHighlightOn = function(btn, inputMethod, keyCode = '') {
	if (inputMethod == 'keyboard') {
		btn = $('#btn-' + btn);
	}

	var originalBtnColor = $(btn).css('background-color');
	$(btn).css('background-color', '#D3D3D3');
	$(btn).css('color', originalBtnColor);

	if (inputMethod == 'mouse') {
		$(btn).mouseleave(function() {
			calculator.inputSystem.buttonHighlightOff(btn, originalBtnColor);
		});
	} else {
		if (btn[0]['id'] == 'btn-c') {
			var cButtonDown = true;
			setTimeout(function() {
				if (cButtonDown) {
					calculator.screen.runClearAnimation();
					calculator.baseCalculation = new Calculation(true);
				}
			}, 600);
		}

		$(document).keyup(function() {
			var index = calculator.inputSystem.pressedKeys.indexOf(keyCode);
			if (index > -1) {
				calculator.inputSystem.pressedKeys.splice(index);
			}

			calculator.inputSystem.buttonHighlightOff(btn, originalBtnColor);
			cButtonDown = false;
		});
	}
}

InputSystem.prototype.buttonHighlightOff = function(btn, originalBtnColor) {
	$(btn).css('background-color', originalBtnColor);
	$(btn).css('color', 'white');
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
	} else {
		return;
	}

	this.pressedKeys.push(keyCode);
	this.buttonHighlightOn(keyId, 'keyboard', keyCode);
}

$(document).ready(function() {
	
	// Mouse hovers over calculator button.
	$('.btn').mouseenter(function() {
		calculator.inputSystem.buttonHighlightOn(this, 'mouse');
	});

	// Handle mouse clicks. 
	$('.btn').mousedown(function() {
		calculator.screen.skipEqualsAnimation();
		var btnValue = $(this).text().trim();
		if (btnValue == '=') {
			calculator.equals();
		} else if (btnValue == 'C') {
			calculator.removePreviousInput();
			var cButtonDown = true;
			
			setTimeout(function() {
				if (cButtonDown) {
					calculator.screen.runClearAnimation();
					calculator.baseCalculation = new Calculation(true);
				}
			}, 600);
			
			$('#btn-c').mouseup(function() {
				cButtonDown = false;
			});

			$('#btn-c').mouseleave(function() {
				cButtonDown = false;
			});
		} else {
			calculator.receiveInput(btnValue);
		}
	});

	// Handle key presses.
	$(document).keydown(function(key) {
		if (calculator.inputSystem.pressedKeys.indexOf(key.keyCode) < 0) {
			calculator.screen.skipEqualsAnimation();
			var keyCode = parseInt(key.keyCode);
			calculator.inputSystem.keyboardInput(keyCode, key.shiftKey);
		}
	});
});

// Prevent the backspace key from navigating back.
$(document).unbind('keydown').bind('keydown', function (event) {
    var doPrevent = false;
    if (event.keyCode === 8) {
        var d = event.srcElement || event.target;
        if ((d.tagName.toUpperCase() === 'INPUT' && 
             (
                 d.type.toUpperCase() === 'TEXT' ||
                 d.type.toUpperCase() === 'PASSWORD' || 
                 d.type.toUpperCase() === 'FILE' || 
                 d.type.toUpperCase() === 'SEARCH' || 
                 d.type.toUpperCase() === 'EMAIL' || 
                 d.type.toUpperCase() === 'NUMBER' || 
                 d.type.toUpperCase() === 'DATE' )
             ) || 
             d.tagName.toUpperCase() === 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        }
        else {
            doPrevent = true;
        }
    }

    if (doPrevent) {
        event.preventDefault();
    }
});

var calculator = new Calculator();