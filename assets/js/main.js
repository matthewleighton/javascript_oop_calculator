// Todo - Implement some kind of rounding, to avoid gettings irrational results.

/**
* Calculator Class
**/
function Calculator() {
	this.baseCalculation = new Calculation(true);
	this.screen = new Screen;
	this.validOperators = ['+', '-', '*', '/', '^'];
}

// Returns the calculation object which the inputted values should be entered into.
// For example, if we have several parentheses this will return the last open one.
Calculator.prototype.findInputTarget = function(calculation, closeParenthesis = false) {
	
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
		return this.findInputTarget(lastElement, closeParenthesis);
	}

	return calculation;
}

// Recieve an input from the user, and 
// Add either a digit or operator onto the current operation.
Calculator.prototype.receiveInput = function(inputValue) {
	console.log("---receiveInput---");
	console.log(this.baseCalculation);

	var closeParenthesis = inputValue == ')' ? true : false;
	var currentCalculation = this.findInputTarget(this.baseCalculation, closeParenthesis).calculationArray;
	console.log(currentCalculation);
	var lastElement = currentCalculation[currentCalculation.length-1];
	var lastInput = '';

	if (!isNaN(lastElement)) {
		var lastInput = lastElement.slice(-1);
	}
	
	// Special cases regarding operators as first input.
	if (currentCalculation.length == 0 && this.isValidOperator(inputValue)) {
		if (inputValue == '-') {
			this.pushInput(currentCalculation, inputValue, inputValue);
		}
		return;
	}

	// Special case for using a negative number as first input.
	// Addition causes the calculation to be cleared, while all other operators are ignored.
	if (currentCalculation[0] == '-' && !this.isValidDigit(inputValue)) {
		if (inputValue == '+') {
			this.findInputTarget(this.baseCalculation).calculationArray = [];
			this.screen.replaceLastCharacter('');
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
			calculator.screen.replaceLastCharacter(inputValue);
			return;
	}

	// Handle decimal point inputs.
	if (inputValue == '.') {
		console.log("Last element was" + lastElement);
		if (!isNaN(lastElement) && lastElement.indexOf('.') != -1) {
			console.log("Last input was . - returning");
			return;
		} else if (currentCalculation.length < 1 || lastElement.constructor.name == 'Operator') {
			this.pushInput(currentCalculation, '0', '0');
		}

		this.pushInput(currentCalculation, '.', '.', true);
		return;
	}

	// Handle input of digits.
	if (!isNaN(inputValue)) {
		if (lastElement == '0') {
			currentCalculation.pop();
			console.log(currentCalculation);
			this.screen.replaceLastCharacter('');
			lastElement = currentCalculation[currentCalculation.length-1];
		}
		if (!isNaN(lastElement) || lastInput == '.' || currentCalculation[0] == '-') {
			this.pushInput(currentCalculation, inputValue, inputValue, true);
		} else {
			this.pushInput(currentCalculation, inputValue, inputValue);
		}
	// Handle input of operators.
	} else if (this.isValidOperator(inputValue)) {
		if (lastInput == '.') {
			currentCalculation[currentCalculation.length-1] = lastElement.substring(0, lastElement.length-1);
			this.screen.replaceLastCharacter('');
		}
		this.pushInput(currentCalculation, new Operator(inputValue), inputValue);
	}

	// Handle input of open parenthesis.
	if (inputValue == '(') {
		this.pushInput(currentCalculation, new Calculation, '(');
	}
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
	
	if (!isNaN(pushValue) && this.readyToCalculate(this.baseCalculation)) {
		this.calculateAll();
	}

	this.screen.checkFontSize();

	console.log("After input base calculation array is...");
	console.log(this.baseCalculation);
}

// Remove the user's previous input via the 'C' button.
Calculator.prototype.removePreviousInput = function() {
	console.log("ENTERING removePreviousInput()");
	var currentCalculation = this.findInputTarget(this.baseCalculation);
	console.log("Targeted calculation is ");
	console.log(currentCalculation);

	// Check if the current calculation is empty. Only remove if it is NOT the base calculation.
	if (currentCalculation.calculationArray.length == 0) {
		if (!currentCalculation.isBaseCalculation) {
			console.log("deleted empty parenthesis - removed left bracket");
			currentCalculation.isOpen = false;
			var outerCalculation = this.findInputTarget(this.baseCalculation).calculationArray;
			outerCalculation.pop();
			this.screen.removeParenthesis();
		}
		console.log("Attempt to remove base calculation ignored");
		console.log("calculation array after C:------------------------- ");
		console.log(this.baseCalculation);
		this.calculateAll();
		return;
	}

	var currentCalculation = currentCalculation.calculationArray;
	var lastElement = currentCalculation[currentCalculation.length-1];
	var secondLastElement = currentCalculation[currentCalculation.length-2];
	
	console.log("Second last element is...");
	console.log(secondLastElement);

	console.log("Last element is...");
	console.log(lastElement);

	if (!isNaN(lastElement)) {
		// Remove the last digit of the number
		currentCalculation[currentCalculation.length-1] = lastElement.substring(0, lastElement.length-1);
		console.log("REMOVING NUMBER");
		console.log(currentCalculation[currentCalculation.length-1]);
		this.screen.replaceLastCharacter('');
		if (currentCalculation[currentCalculation.length-1].length == 0) {
			// If the number is now empty, remove the element itself.
			console.log("DIGIT IS EMPTY - REMOVING ELEMENT");
			currentCalculation.pop();
		}
	} else if (lastElement.constructor.name == "Operator" || lastElement == '-') {
		// Remove the last operator.
		console.log("Removing operator");
		currentCalculation.pop();
		this.screen.replaceLastCharacter('');
	} else if (!lastElement.isOpen) {
		// If the last element is a closed parenthesis, open it, removing the closing bracket.
		currentCalculation[currentCalculation.length-1].isOpen = true;
		console.log("opened closed parenthesis - deleted right bracket");
		this.screen.replaceLastCharacter('');
		this.screen.openNewParenthesis();
	}

	lastElement = currentCalculation[currentCalculation.length-1];
	console.log("At end of removePreviousInput...");
	console.log(lastElement);

	this.screen.checkFontSize();

	if (this.readyToCalculate(this.baseCalculation)) {
		console.log("CALCULATING AFTER USING C");
		console.log(this.baseCalculation);
		this.calculateAll();
	} else {
		this.screen.clearOutputDisplay();
	}

	console.log("calculation array after C:------------------------- ");
	console.log(this.baseCalculation);	
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
	var answer = this.calculateAll().toString();
	this.baseCalculation = new Calculation(true);
	this.baseCalculation.calculationArray.push(answer);
	console.log(this.baseCalculation.calculationArray);
	this.screen.equalsAnimation(answer);
	
	//this.screen.clearScreen();
	//this.receiveInput(answer.toString());
	console.log(this.screen.inputDisplay == 3);
}

/**
* Calculation Class
**/
function Calculation(base = false) {
	// An array to store the numbers and operators making up the calculation.
	this.calculationArray = [];

	// Specifies whether the parentheses of this calculation are open or have been closed.
	// This will be set to false when the user enters a ')', signaling the calculator to
	// ignore the calculation while chosing an input target.
	this.isOpen = true;

	// Ensures that the base calculation cannot be deleted.
	this.isBaseCalculation = base;
}

// Removes trailing operations (e.g. '1+1+') from the workingCalculationArray, ensuring the program won't fail trying to calculate them.
Calculation.prototype.ignoreTrailingOperations = function(inputCalculation) {
	var calculation = $.extend([], inputCalculation);

	var lastElement = calculation[calculation.length-1];
	if (lastElement && !isNaN(lastElement)) {
		return calculation;
	} else if (lastElement && lastElement.constructor.name == "Operator" || lastElement == '-') {
		console.log("Removing trailing operator!!!");
		calculation.pop();
		return calculation;
	} else if (lastElement && lastElement.constructor.name == "Calculation") {
		console.log("ignoreTrailingOperations() - calculation");
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
Calculation.prototype.runCalculation = function(inputCalculation) {
	console.log("Entering calculation...");
	// Create a copy of the calculationArray, to ensure we're not altering the original array.
	var workingCalculationArray = [];
	$.extend(workingCalculationArray, inputCalculation);

	//workingCalculationArray = this.ignoreTrailingOperations(workingCalculationArray);

	if (workingCalculationArray.length == 0) {
		return 0;
	}

	// Check for any numbers (or parentheses) next to parentheses and insert the required multiplication operator.
	var i = 0;
	while (i < workingCalculationArray.length) {
		if (workingCalculationArray[i] == '-') {
			console.log("setting '-' to null");
			workingCalculationArray[i] = null;
		} else if (workingCalculationArray[i].constructor.name == "Calculation") {
			if (workingCalculationArray[i].calculationArray.length < 1) {
				workingCalculationArray[i] = null;
			} else {
				if (workingCalculationArray[i-1] && !isNaN(workingCalculationArray[i-1])) {
					workingCalculationArray.splice(i, 0, new Operator('*'));
					i++;
				}
				if (workingCalculationArray[i+1] && (!isNaN(workingCalculationArray[i+1]) || workingCalculationArray[i+1].constructor.name == "Calculation")) {
					workingCalculationArray.splice(i+1, 0, new Operator('*'));
				}
				if (workingCalculationArray[i].calculationArray.length == 1) {
					console.log("DOes this rfdgbksd");
					workingCalculationArray[i] = workingCalculationArray[i].calculationArray[0];
				}	
			}			
		}
		i++;
	}

	if (workingCalculationArray.length == 1) {
		console.log("workingCalculationArray only contains 1 element");
		if (workingCalculationArray[0] == null) {
			workingCalculationArray[0] = 0;
		} else if (workingCalculationArray[0].constructor.name == "Calculation") {
			workingCalculationArray[0] = this.runCalculation(workingCalculationArray[0].calculationArray);
		} else if (workingCalculationArray[0] == '-') {
			return 0;
		}
		return workingCalculationArray[0];
	}

	while (workingCalculationArray.length > 1 || workingCalculationArray[0].constructor.name == "Calculation") {
		console.log("Entering main loop");
		// If the first element is a parenthesis, evaluate it first and replace it with its value.
		// We specify this since we usually skip the first element in the for loop.
		if (isNaN(workingCalculationArray[0])) {
			workingCalculationArray[0] = workingCalculationArray[0].runCalculation(workingCalculationArray[0].calculationArray);
		}
		
		var memory = parseFloat(workingCalculationArray[0]);
		var currentOperator;
		
		for (var i = 1; i < workingCalculationArray.length; i++) {
			// Check if the object we're looking at is a parenthesis. If so, calculate it first.
			if (workingCalculationArray[i]) {
				if (workingCalculationArray[i].constructor.name == "Calculation") {
					console.log("Running inner calculation");
					workingCalculationArray[i] = workingCalculationArray[i].runCalculation(workingCalculationArray[i].calculationArray);
				}
				console.log(workingCalculationArray[i]);
				if (workingCalculationArray[i].constructor.name == "Operator" && workingCalculationArray[i+1]) {
					console.log("Assigning current operator");
					currentOperator = workingCalculationArray[i];
				} else {
					// Check if the following operator takes priority by order of operations.
					if (workingCalculationArray[i+1] && workingCalculationArray[i+1].priority > currentOperator.priority) {
						memory = parseFloat(workingCalculationArray[i]);
					} else {
						
						var safeToCalculate = true;
						if (workingCalculationArray[i].constructor.name == "Operator") {
							safeToCalculate = false;
							workingCalculationArray[i] = null;
						}

						if (safeToCalculate) {
							workingCalculationArray[i] = currentOperator.performOperation(memory, workingCalculationArray[i]);
							memory = workingCalculationArray[i];
							workingCalculationArray[i-1] = null;
							workingCalculationArray[i-2] = null;
						}
					}
				}
			}
		}
	
		// Remove all null values (numbers we've already calculated) from the array.
		workingCalculationArray = workingCalculationArray.filter(function(n){return n != null});
		console.log(workingCalculationArray);
	}

	console.log("At end of calculation...");
	console.log(calculator.baseCalculation);

	if (workingCalculationArray[0] == null) {
		console.log("Setting last null value to 0");
		workingCalculationArray[0] = 0;
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

Screen.prototype.removeParenthesis = function() {
	this.replaceLastCharacter('');
	this.openParentheses = this.openParentheses.substring(0, this.openParentheses.length-1);
	$('#open-parentheses').text(this.openParentheses);
}

Screen.prototype.clearScreen = function() {
	calculator.screen.clearInputDislay();
	calculator.screen.clearOutputDisplay();
	$('#open-parentheses').text('');
	$('#open-parentheses').css('padding', '5px 0px 5px 0px');
	calculator.screen.openParentheses = '';
	//calculator.baseCalculation.calculationArray = [];
}

// Replace the last character of the input display. For use when user changes mind about which operator to use.
Screen.prototype.replaceLastCharacter = function(newOperator) {
	this.inputDisplay = this.inputDisplay.substring(0, this.inputDisplay.length-1);
	this.inputDisplay += newOperator;
	$('#input-display').text(this.inputDisplay);
}

// Resizes the font based on the numer of characters in the input/output display.
Screen.prototype.checkFontSize = function() {
	var inputCharacters = this.inputDisplay.length;
	var inputFontSize = '';

	if (inputCharacters < 14) {
		inputFontSize = 40;
	} else if (inputCharacters >= 14 && inputCharacters < 25) {
		inputFontSize = 40-(2*(inputCharacters-14));
	} else {
		inputFontSize = 18;
	}

	$('#input-display').css('font-size', inputFontSize);
	$('#open-parentheses').css('font-size', inputFontSize);
}

Screen.prototype.equalsAnimation = function(answer) {
	var originalFontSize = $('#output-display').css('font-size');
	this.inputDisplay = answer;
	$('#input-display').text('');

	var animateOutput = function() {
		//var r = $.Deferred();

		//calculator.screen.clearInputDislay();
		//$(document).keydown(false);
		$('#output-display').animate({"font-size":"40px", "bottom": "66px"}, 500);

		//setTimeout(function() {
		//	r.resolve();
		//}, 1000);

		//return r;
	}

	var resetPositions = function(answer) {
		//alert(answer);
		if (!calculator.skipingAnimation) {
			$('#input-display').text(calculator.screen.inputDisplay);
			calculator.screen.clearOutputDisplay();
			$('#output-display').css('bottom', '0px');
			$('#output-display').css('font-size', '30px');
			console.log("DONE");
		} else {
			calculator.skippingAnimation = false;
		}
	}

	animateOutput();
	setTimeout(function() {
		resetPositions(answer);
	}, 600);

	//animateOutput().done(resetPositions(answer));
}


var calculator = new Calculator();

/**
* User Interaction
**/

// Controls the animation when a button is pressed, either via the mouse or keyboard.
Calculator.prototype.buttonHighlightOn = function(btn, inputMethod) {
	//console.log("Pressed a button");

	if (inputMethod == 'keyboard') {
		btn = $('#btn-' + btn);
	}
	//console.log(btn);
	var originalBtnColor = $(btn).css('background-color');
	$(btn).css('background-color', '#D3D3D3');
	$(btn).css('color', originalBtnColor);

	if (inputMethod == 'mouse') {
		$(btn).mouseleave(function() {
			calculator.buttonPressUp(btn, originalBtnColor);
		});
	} else {
		$(document).keyup(function() {
			calculator.keydown = false;
			console.log("Resetting keydown");
			console.log(this);
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

	// Handle mouse clicks 
	$('.btn').mousedown(function() {
		var btnValue = $(this).text().trim();
		console.log("btnValue = " + btnValue);
		if (btnValue == '=') {
			calculator.equals();
			//calculator.calculateAll();
			//calculator.screen.updateOutputDisplay(answer);
		} else if (btnValue == 'C') {
			//calculator.screen.clearScreen();
			calculator.removePreviousInput();
		} else {
			calculator.receiveInput(btnValue);
		}
	});

	Calculator.prototype.keyboardInput = function(keyCode, shiftKey) {
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
			//calculator.screen.clearScreen();
			var keyId = 'c';
		}

		if (keyCode != 16) {
			this.keydown = true;	
		}
		
		this.buttonHighlightOn(keyId, 'keyboard');
	}

	// Handle key presses
	$(document).keydown(function(key) {
		if (!calculator.keydown) {
			var triggerKeypress = function(key) {
				var keyCode = parseInt(key.keyCode);
				calculator.keyboardInput(keyCode, key.shiftKey);
			}

			
			calculator.screen.skipAnimation();

			triggerKeypress(key);
			
		}
	});

	// If the 'equals' animation is currently running, skip to the end of it.
	Screen.prototype.skipAnimation = function() {
		if ($('#output-display').is(':animated')) {
			$('#output-display').finish();
			calculator.skipingAnimation = true;

			$('#input-display').text(this.inputDisplay);
			calculator.screen.clearOutputDisplay();
			$('#output-display').css('bottom', '0px');
			$('#output-display').css('font-size', '30px');
		}		
	}

	// Both key and mouse inputs should get filtered through the same function.
	// Only numbers or operators should go to recieveInput().


});



// Todo tomorrow - The output should always be empty if there are fewer than two numbers present in the array.
// There's currently an issue with the output still being visable when we use c to undo input.