// Setup

//var newCalculation = new Calculation;

// Calculator Object
QUnit.test("Calculator object created on startup", function( assert ) {
	var testCalculator = new Calculator;
	assert.ok(calculator, "calculator object exists");
});

QUnit.test("Calculator adds first digit input to empty calculation", function(assert) {
	var testCalculator = new Calculator;
	assert.deepEqual(testCalculator.baseCalculation, new Calculation, "current calculation array is initially empty");

	testCalculator.receiveInput('1');
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '1', "After inputting '1', calculation array contains '1'");
});

QUnit.test("Calculator adds a second digit to a number", function(assert) {
	var testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('2');
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '12', "Adding a second digit appends it to the first");
});

QUnit.test("Inputting an operand after a digit is added as a new element to the calculationArray", function(assert) {
	var testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 2, "Calculation array contains two elements");
	
	var additionOperand = new Operand('+');
	assert.deepEqual(testCalculator.baseCalculation.calculationArray[1], additionOperand, "Second element of calculationArray is an addition operand");
});

//Calculation Object
QUnit.test("Calculation object is added to calculator openCalculations array on calculator creation", function(assert) {
	testCalculator = new Calculator;
	testCalculation = new Calculation;
	assert.deepEqual(calculator.baseCalculation, testCalculation, "calculation object is in inputTarget array");
});

QUnit.test("Calculation objects have an empty 'calculationArray' upon creation", function(assert) {
	testCalculator = new Calculator;
	assert.ok(testCalculator.baseCalculation.calculationArray);
});


//Operand Object
QUnit.test("The appropriate operand is added to the calculationArray when the corresponding symbol is inputted", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	var additionOperand = new Operand('+');
	assert.propEqual(testCalculator.baseCalculation.calculationArray[1], additionOperand, "Last element of calculationArray is addition operand");
});


// Testing two digit calculations
QUnit.test("1+1=2", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.calculateAll(), '2');
});

QUnit.test("2-1=1", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.calculateAll(), '1');	
});

QUnit.test("2*2=4", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), '4');
});

QUnit.test("2/2=1", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('4');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), '2');
});

QUnit.test("2^3=8", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('^');
	testCalculator.receiveInput('3');

	assert.equal(testCalculator.calculateAll(), '8');
});

// Testing three digit calculations
QUnit.test("1+1+1=3", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 5, "CalculationArray contains 5 elements after entering '1+1+1'");

	assert.equal(testCalculator.calculateAll(), '3');
});

QUnit.test("9-1-1=7", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('9');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.calculateAll(), '7');
});

QUnit.test("2*3*4=24", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('4');

	assert.equal(testCalculator.calculateAll(), '24');
});

QUnit.test("8/2/2=2", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('8');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), '2');
});

// Multiple digit numbers must be inputted via multiple inputs of single digits
QUnit.test("Can handle two digit numbers: 10+5=15", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('0');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('5');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "CalculationArray contains 3 elements after entering '10+5'");
	assert.equal(testCalculator.calculateAll(), '15');
});

QUnit.test("Correctly orders addition and multiplication according to order of operations: 1+2*3=7", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('3');

	assert.equal(testCalculator.calculateAll(), '7');
});

QUnit.test("Correctly prioritises exponents before multiplication: 2*3^2=18", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('^');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), '18');
});

QUnit.test("Correctly answers a calculation switching back and forth between different operands: 1+2^2*4/2+1=10", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('^');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('4');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.calculateAll(), '10');
});

QUnit.test("Correctly handles a calculation resulting in a decimal: 3/2=1.5", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), '1.5');
});

QUnit.test("Correctly handles three digit numbers: 125+2=127", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "CalculationArray contains 3 elements after entering '125+2'");
	assert.equal(testCalculator.calculateAll(), '127');
});

QUnit.test("Correctly handles a calculation including one decimal: 1.5+1=2.5",function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('.');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	console.log(testCalculator.baseCalculation.calculationArray);

	assert.equal(testCalculator.calculateAll(), '2.5');
})


QUnit.test("Correctly handles a calculation of two decimals: 1.5+1.4=2.9", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('.');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('.');
	testCalculator.receiveInput('4');

	assert.equal(testCalculator.calculateAll(), '2.9');
});

QUnit.test("Correctly handles a calculation resulting in a negative number: 1-2=-1", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), '-1');
});

QUnit.test("Correctly handles a calculation resulting in a negative decimal: 0.5-1=-0.5", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('0');
	testCalculator.receiveInput('.');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.calculateAll(), '-0.5');
});

QUnit.test("Ignore first input if inputValue is an operand", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('+');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "CalculationArray is empty after entering only a '+'");

	testCalculator.receiveInput('*');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('^');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "CalculationArray is empty after entering various operands");
});

QUnit.test("Usual performance still works after initially entering ignored operands as first input", function(assert) {
	testCalculator = new Calculator;
	
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('^');

	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "CalculationArray only has 3 elements after entering '1+1' after invalid operands");
	assert.equal(testCalculator.calculateAll(), '2', "Still provides a correct answer after initially recieving invalid operands");
});


QUnit.test("Allows for input of negative number as first input", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 1, "CalculationArray contains only 1 element after entering '-2'");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '-2', "First element of calculationArray is '-2'");
});

QUnit.test("Correctly handles multiple entries of operands including minus", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('+');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "CalculationArray is empty after entering '-+'");
/*
	testCalculator = new Calculator;
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('*');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 1, "CalculationArray only contains one element after entering -*");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '-', "CalculationArray's first element is a minus after entering -* ")
*/
});

// Parenthesis Tests
QUnit.test("Creates and adds a new calculation object to the openCalculations array by inputting '('", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 1, "openCalculations array contains one element");
	assert.deepEqual(testCalculator.baseCalculation.calculationArray[0], new Calculation, "The first element of our first calculation is the second calculation");
});

QUnit.test("Can input digits into a parenthesis", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	
	assert.equal(testCalculator.baseCalculation.calculationArray[0].calculationArray.length, 1, "Parenthesis calculationArray contains one element after inputting '(1");
	assert.equal(testCalculator.baseCalculation.calculationArray[0].calculationArray[0], '1', "Parenthesis calculationArray contains '1'");
});

QUnit.test("Can complete calculations within a parenthesis", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.calculateAll(), 2, "'(1+1'=2");
});

QUnit.test("Can close a parenthesis and then perform an operand on it", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), 4, "'(1+1)*2'=4");
});