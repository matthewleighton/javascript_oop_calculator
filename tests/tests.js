// Setup

//var newCalculation = new Calculation;

// Calculator Object
QUnit.test("Calculator object created on startup", function( assert ) {
	var testCalculator = new Calculator;
	assert.ok(calculator, "calculator object exists");
});

QUnit.test("Calculator adds first digit input to empty calculation", function(assert) {
	var testCalculator = new Calculator;
	assert.deepEqual(testCalculator.openCalculations[0], new Calculation, "current calculation array is initially empty");

	testCalculator.receiveInput('1');
	assert.equal(testCalculator.openCalculations[0].calculationArray[0], '1', "After inputting '1', calculation array contains '1'");
});

QUnit.test("Calculator adds a second digit to a number", function(assert) {
	var testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('2');
	assert.equal(testCalculator.openCalculations[0].calculationArray[0], '12', "Adding a second digit appends it to the first");
});

/* Older version of early tests - Tests are combined together, requiring less setup before each one, as the setup is done in the previous test.
** This takes less space, but is it better to be establishing things before each test?
QUnit.test("calculator correctly handles input", function(assert) {
	var testCalculator = new Calculator;
	assert.deepEqual(testCalculator.openCalculations[0], new Calculation, "Current calculation is initially empty");

	testCalculator.receiveInput('1');
	assert.equal(testCalculator.openCalculations[0].calculationArray[0], '1', "After inputting '1', calculation array contains '1'");
	
	testCalculator.receiveInput('2');
	assert.equal(testCalculator.openCalculations[0].calculationArray[0], '12', "A second inputted digit gets appended to the first element of calculationArray");
	assert.equal(testCalculator.openCalculations[0].calculationArray.length, 1, "The calculationArray still only contains one element after adding second digit");
});
*/

QUnit.test("Inputting an operand after a digit is added as a new element to the calculationArray", function(assert) {
	var testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	assert.equal(testCalculator.openCalculations[0].calculationArray.length, 2, "Calculation array contains two elements");
	
	var additionOperand = new Operand('+');
	assert.deepEqual(testCalculator.openCalculations[0].calculationArray[1], additionOperand, "Second element of calculationArray is an addition operand");
});




//Calculation Object
QUnit.test("Calculation object is added to calculator openCalculations array on calculator creation", function(assert) {
	testCalculator = new Calculator;
	testCalculation = new Calculation;
	assert.deepEqual(calculator.openCalculations[0], testCalculation, "calculation object is in inputTarget array");
});

QUnit.test("Calculation objects have an empty 'calculationArray' upon creation", function(assert) {
	testCalculator = new Calculator;
	assert.ok(testCalculator.openCalculations[0].calculationArray);
});


//Operand Object
QUnit.test("The appropriate operand is added to the calculationArray when the corresponding symbol is inputted", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	var additionOperand = new Operand('+');
	assert.propEqual(testCalculator.openCalculations[0].calculationArray[1], additionOperand, "Last element of calculationArray is addition operand");

	//console.log(additionOperand);
	//console.log(testCalculator.openCalculations[0].calculationArray[1]);

	// Add tests for other operands.
});

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
// Todo - prevent input of operand as first input (except minus, which creates a negative number);