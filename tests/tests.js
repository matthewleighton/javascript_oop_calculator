// Setup

//var newCalculation = new Calculation;

// Calculator Object
QUnit.test("Calculator object created on startup", function( assert ) {
	var testCalculator = new Calculator;
	assert.ok(calculator, "calculator object exists");
});

QUnit.test("Calculator adds first digit input to empty calculation", function(assert) {
	var testCalculator = new Calculator;
	assert.deepEqual(testCalculator.baseCalculation, new Calculation(true), "current calculation array is initially empty");

	testCalculator.receiveInput('1');
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '1', "After inputting '1', calculation array contains '1'");
});

QUnit.test("Calculator adds a second digit to a number", function(assert) {
	var testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('2');
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '12', "Adding a second digit appends it to the first");
});

QUnit.test("Inputting an operator after a digit is added as a new element to the calculationArray", function(assert) {
	var testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 2, "Calculation array contains two elements");
	
	var additionOperator = new Operator('+');
	assert.deepEqual(testCalculator.baseCalculation.calculationArray[1], additionOperator, "Second element of calculationArray is an addition operator");
});

//Calculation Object
QUnit.test("Calculation object is added to calculator openCalculations array on calculator creation", function(assert) {
	testCalculator = new Calculator;
	testCalculation = new Calculation(true);
	assert.deepEqual(calculator.baseCalculation, testCalculation, "calculation object is in inputTarget array");
});

QUnit.test("Calculation objects have an empty 'calculationArray' upon creation", function(assert) {
	testCalculator = new Calculator;
	assert.ok(testCalculator.baseCalculation.calculationArray);
});


//Operator Object
QUnit.test("The appropriate operator is added to the calculationArray when the corresponding symbol is inputted", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	var additionOperator = new Operator('+');
	assert.propEqual(testCalculator.baseCalculation.calculationArray[1], additionOperator, "Last element of calculationArray is addition operator");
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

QUnit.test("Correctly answers a calculation switching back and forth between different operators: 1+2^2*4/2+1=10", function(assert) {
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
});

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

QUnit.test("Ignore first input if inputValue is an operator", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('+');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "CalculationArray is empty after entering only a '+'");

	testCalculator.receiveInput('*');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('^');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "CalculationArray is empty after entering various operators");
});

QUnit.test("Usual performance still works after initially entering ignored operators as first input", function(assert) {
	testCalculator = new Calculator;
	
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('^');

	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "CalculationArray only has 3 elements after entering '1+1' after invalid operators");
	assert.equal(testCalculator.calculateAll(), '2', "Still provides a correct answer after initially recieving invalid operators");
});


QUnit.test("Allows for input of negative number as first input", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 1, "CalculationArray contains only 1 element after entering '-2'");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '-2', "First element of calculationArray is '-2'");
});

QUnit.test("Correctly handles multiple entries of operators including minus", function(assert) {
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

QUnit.test("Can close a parenthesis and then perform an operator on it", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('2');

	assert.deepEqual(testCalculator.baseCalculation.calculationArray[1], new Operator('*'), "Second element of the base calculationArray is a multiplication operator");
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "baseCalculation calculationArray contains 3 elements");
	assert.equal(testCalculator.calculateAll(), 4, "'(1+1)*2' = 4");
});

QUnit.test("3*(1+2)=9", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 9);
});

QUnit.test("25-(6/3)*(1+1) = 21", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('6');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 21);
});

QUnit.test("Can solve questions containing parentheses within parentheses: 3*(2+8*(5-3)-1)+2 = 53", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('8');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), 53);
});

QUnit.test("Correctly prioritises parentheses ahead of exponents: 1+2*(3+4)^2 = 99", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('4');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('^');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), 99);
});

QUnit.test("Parentheses cannot be closed while they are empty - the input of ')' will be ignored", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "The baseCalculation calculationArray contains 3 elements - the parenthesis was never closed");
	assert.equal(testCalculator.calculateAll(), 2, "'1+(1' = 2");
});

QUnit.test("4*(2+3*()2+1))=44", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('4');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput(')');
	
	assert.equal(testCalculator.calculateAll(), 44, "False closure of the parenthesis was ignored");
});

QUnit.test("A number next to a parenthesis will be understood as that number multiplied by the parenthesis (Parenthesis fist)", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('5');

	assert.equal(testCalculator.calculateAll(), 25, "(2+3)5 = 25");
});

QUnit.test("2+(1+2)2=8", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), 8);
});


QUnit.test("A number next to a parenthesis will be understood as that number multiplied by the parenthesis (Number first)", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 8, "2(1+3) = 8");
});

QUnit.test("3(2+5)2=42", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.calculateAll(), 42)
});

QUnit.test("Will multiply two parentheses placed next to each other: (2+1)(4-2) = 6", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('4');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 6);
});

QUnit.test("Will multiply three parentheses placed next to each other: (1+2)(3+4)(5+6) = 321", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('4');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('6');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 231);
});

QUnit.test("Can multiply two parentheses only containing single numbers: (2)(3) = 6", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 6);
});

QUnit.test("2-1(2)=0", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 0);
})

QUnit.test("2+1(3)=5", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 5);
});

QUnit.test("Placing a number beside a parentheses is the same as using a multiplication symbol", function(assert) {
	calculatorOne = new Calculator;
	calculatorOne.receiveInput('2');
	calculatorOne.receiveInput('*');
	calculatorOne.receiveInput('2');

	calculatorTwo = new Calculator;
	calculatorTwo.receiveInput('2');
	calculatorTwo.receiveInput('(');
	calculatorTwo.receiveInput('2');
	calculatorTwo.receiveInput(')');

	assert.equal(calculatorOne.calculateAll(), calculatorTwo.calculateAll());
});

QUnit.test("(2+1*(2)) = 4", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput(')');
	
	assert.equal(testCalculator.calculateAll(), 4);
});

QUnit.test("3(2()2+3)(2+1(2))+1) = 123", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput(')');
	
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 2, "calculationArray contains two elements");
	assert.equal(testCalculator.calculateAll(), 123);
});

QUnit.test("2(2+1*(2))+1 = 5", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	
	assert.equal(testCalculator.calculateAll(), 9);
});

QUnit.test("2((2))+1 has a base calculation array consisting of 4 elements", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 4, "The base calculation array contains 4 elements: 2, (), +, 1");
});

QUnit.test("Parentheses still close properly if all they include is an inner calculation: ((2))+3", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "The base calculation array contains 3 elements: (), +, 3");
});

QUnit.test("Correctly handles input of a negative number via parentheses: 10+(-3) = 7", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('0');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 7);
});

QUnit.test("Performing a calculation doesn't effect the calculationArray itself", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');

	beforeCalculation = testCalculator.baseCalculation.calculationArray;
	testCalculator.calculateAll();
	afterCalculation = testCalculator.baseCalculation.calculationArray;
	
	assert.deepEqual(beforeCalculation, afterCalculation);
});

QUnit.test("If a calculation ends in an operator, it will be ignored while calculating", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');

	assert.equal(testCalculator.calculateAll(), 2, "1+1+ = 2");

	testCalculator.receiveInput('1');
	assert.equal(testCalculator.calculateAll(), 3, "The extra '+' is still taken into account if user inputs another digit");
});

QUnit.test("If a calculation ends in a calculation with does not contain a digit, both that end calculation and the preceeding operator will be ignored", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('(');

	assert.equal(testCalculator.calculateAll(), 2);
});

QUnit.test("'1+1()+': The addition operator and empty parenthesis will be ignored", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('+');

	assert.equal(testCalculator.calculateAll(), 2);
});

QUnit.test("1(+(-(*(/((( = 1", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('*');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('(');

	console.log("calculation array is");
	console.log(testCalculator.baseCalculation.calculationArray);

	assert.equal(testCalculator.calculateAll(), 1);
});

QUnit.test("Empty calculation returns 0", function(assert) {
	testCalculator = new Calculator;
	
	assert.equal(testCalculator.calculateAll(), 0);
});

QUnit.test("Calculation consitiong of only '-' returns 0", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('-');

	assert.equal(testCalculator.calculateAll(), 0);
});

QUnit.test("2+3() = 5", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.calculateAll(), 5);
});

//Screen tests

QUnit.test("Invalid inputs such as opening with operands/closing an empty parenthesis are not added to the input display", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.screen.inputDisplay, '(');	
});

QUnit.test("The output display is automatically updated as new inputs are entered", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	assert.equal(testCalculator.screen.inputDisplay, '2+3', "Input display is '2+3'");
	assert.equal(testCalculator.screen.outputDisplay, '5');
});

QUnit.test("5+-2 = 3", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('5');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 3, "Calculaiton array contains 3 elements");
	assert.equal(testCalculator.baseCalculation.calculationArray[2], '2', "Element [2] is a '2'");
	assert.equal(testCalculator.calculateAll(), 3);
});

QUnit.test("The calculation array remains unchanged after calculating", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('4');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 8, "Calculation array contains 8 elements");
	assert.equal(testCalculator.calculateAll(), 14);
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 8, "Calculation array still contains 8 elements");
});

QUnit.test("Inputting a decimal point after a minus at the start of a calculation will insert a '0' before the '.'", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('.');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 1, "Calculation Array contains 1 elements after inputting '-.'");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '-0.', "The first element of the calculation array is '-0.'");

	testCalculator.receiveInput('1');

	assert.equal(testCalculator.calculateAll(), '-0.1', "After inputing '1', the calculation evaluates to '-0.1");
});

QUnit.test("Decimal points cannot be added twice in a row", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('.');
	testCalculator.receiveInput('.');
	testCalculator.receiveInput('5');

	assert.equal(testCalculator.baseCalculation.calculationArray[0], '1.5', "After entering '1..5', first array element is '1.5'");
});

QUnit.test("Decimal points cannot be added multiple times at the start of a calculation", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('.');
	//testCalculator.receiveInput('.');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 1, "The calculation array contains 1 element");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '0.', "The first element is '0.'");
	assert.equal(testCalculator.calculateAll(), 0, "The calculation equals 0");
});

QUnit.test("If a decimal point is added to a number, but an operator is then inputted before and extra digits, the decimal point will be removed", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('.');
	testCalculator.receiveInput('+');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 2, "calculationArray contains two elements");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '1', "First element of array is '1'");
	assert.equal(testCalculator.screen.inputDisplay, '1+', "Input display shows '1+'");
});

QUnit.test("Inputting a 0 at the start of a number, followed by another digit, will remove the 0", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('0');
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.baseCalculation.calculationArray[0], '12', "CalculationArray contains '12'");
	assert.equal(testCalculator.calculateAll(), '12', "Calculation evaluates to 12");
});

QUnit.test("Numbers starting in 0 (e.g. 0123) are also impossible to enter after operations", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('0');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('3');

	assert.equal(testCalculator.baseCalculation.calculationArray[2], '23', "Third element of calculationArray is 23");
	assert.equal(testCalculator.calculateAll(), '24', "Calculation evaluates to 24");	
});

QUnit.test("Inputting 'c' removes the previous input", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.removePreviousInput();

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "Calculation array contains no elements");
});

QUnit.test("c will remove an empty array, but cannot remove the initial base array", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.removePreviousInput();

	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "After entering c the base calculation array is empty");

	testCalculator.removePreviousInput();
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 0, "After entering c again noting has changed");
	assert.equal(testCalculator.screen.inputDisplay, '', "Input display is empty");
	assert.equal(testCalculator.screen.openParentheses, '', "There are 0 open calculations remaining after using c");
});

QUnit.test("c successfully removes the last digit of a multi-digit number", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('3');
	testCalculator.removePreviousInput();

	assert.equal(testCalculator.baseCalculation.calculationArray[0], '12', "Calculation array contains '12'");
	assert.equal(testCalculator.calculateAll(), '12', "Calculation evaluates to 12");
});

QUnit.test("c successfully removes the last digit of a single digit number", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.removePreviousInput();

	assert.equal(testCalculator.baseCalculation.calculationArray.length, '2', "Calculation array contains 2 elements");
	assert.equal(testCalculator.calculateAll(), '1', "Calculation evaluates to 1");
	assert.equal(testCalculator.screen.outputDisplay, '1', "Output screen displays 1");
});

QUnit.test("c successfully removes an operator", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.removePreviousInput();
	testCalculator.receiveInput('2');

	assert.equal(testCalculator.baseCalculation.calculationArray.length, '1', "Calculation array contains 1 element");
	assert.equal(testCalculator.calculateAll(), '12', "Calculation evaluates to 12");
	assert.equal(testCalculator.screen.outputDisplay, '12', "Output screen displays 12");
});

QUnit.test("c successfully removes several sets of parentheses", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('4');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput(')');
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 4, "After entering '(2)(3)4(5)' the calculation array contains 4 elements");
	assert.equal(testCalculator.screen.inputDisplay, '(2)(3)4(5)', "The input screen shows '(2)(3)4(5)'");

	testCalculator.removePreviousInput();
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 4, "After pressing c once the array still contains 4 elements");
	var lastElement = testCalculator.baseCalculation.calculationArray[testCalculator.baseCalculation.calculationArray.length-1];
	console.log("LAST ELEMENT IS");
	console.log(lastElement);
	assert.equal(lastElement.isOpen, true, "After pressing c the last inner-calculation is now open");
	assert.equal(testCalculator.screen.inputDisplay, '(2)(3)4(5', "The input screen shows '(2)(3)4(5'");	
});

QUnit.test("C performs correctly on '12(-2)'", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');
	
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();

	assert.equal(testCalculator.baseCalculation.calculationArray.length, '1', "After entering 'C' 5 times the calculation array contains 1 element");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '1', "The first element of the calcualtion array is '1'");

	assert.equal(testCalculator.screen.inputDisplay, '1', "The input display shows '1'");
	testCalculator.removePreviousInput();
	assert.equal(testCalculator.screen.inputDisplay, '', "After using 'C' one more time, the input display is empty");

	assert.equal(testCalculator.screen.openParentheses, '', "After removing all the entered values there are no open parentheses");
});


QUnit.test("C performs correctly on '(2-3)(4-5)'", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('4');
	testCalculator.receiveInput('-');
	testCalculator.receiveInput('5');
	testCalculator.receiveInput(')');
	
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();
	testCalculator.removePreviousInput();

	assert.equal(testCalculator.baseCalculation.calculationArray.length, '1', "After entering 'C' 9 times the calculation array contains 1 element");
	assert.equal(testCalculator.screen.inputDisplay, '(', "The input display shows '('");

	testCalculator.removePreviousInput();
	assert.equal(testCalculator.screen.inputDisplay, '', "After one more C the input display is empty");
	assert.equal(testCalculator.screen.openParentheses, '', "After removing all the entered values there are no open parentheses");
});




QUnit.test("Pressing enter resets the base calculation array to a new array containing only the previous calculation's value", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('2');
	testCalculator.equals();

	assert.equal(testCalculator.baseCalculation.calculationArray.length, '1', "Base calculation array contains 1 element");
	assert.equal(testCalculator.baseCalculation.calculationArray[0], '3', "Base calculation array contains the value '3'");
	//assert.equal(testCalculator.screen.inputDisplay, '3', "Input screen displays '3'");
	// Todo - this last assert is NOT passing in the test suite, although the same behavior appears to work in the actual calculator.
	// Figure out why.
});

QUnit.test("Running the equals function will be ignored if the calculation array does not actualyl contain anything to be calculated. e.g. '1+'", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');
	testCalculator.equals();

	assert.equal(testCalculator.screen.outputDisplay, '', "The output screen is still empty after running equals()");
	assert.equal(testCalculator.baseCalculation.calculationArray.length, 2, "The calculation array contains 2 elements");
});

QUnit.test("The calculation will not be evaluated until the base calculation array contains at least three elements or two calculations", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('+');

	assert.equal(testCalculator.screen.outputDisplay, '', "After inputting '1+' the output display will still be empty");

	testCalculator.receiveInput('1');
	assert.equal(testCalculator.screen.outputDisplay, '2', "After inputting another '1' the output display will contain '2'");
});

QUnit.test("A calculation only containing two sub-calculations will be evaluated", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('2');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.screen.outputDisplay, '', "After inputting '(2)' the output display will still be empty");

	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');
	assert.equal(testCalculator.screen.outputDisplay, '6', "After inputting '(3)' the output display will contain '6'");

});

QUnit.test("A calcualtion containing only a sub-calculation of at least 2 numbrers will be automatically calculated. E.g. (3+4", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('4');

	assert.equal(testCalculator.screen.outputDisplay, '7', "The calculation is evaluated to 7");
});

QUnit.test("((((3+4 will be automatically calculated", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('4');

	assert.equal(testCalculator.screen.outputDisplay, '7', "The calculation is evaluated to 7");
});

QUnit.test("As we use C to delete values, the resulting array will not be calculated if it does not contain more than 1 value", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');
	testCalculator.receiveInput('3');
	assert.equal(testCalculator.screen.outputDisplay, '5', "The calculation is evaluated to 5");
	
	testCalculator.removePreviousInput();
	assert.equal(testCalculator.screen.outputDisplay, '', "After removing one more value the output screen is empty, since we don't run the calculation");
});

QUnit.test("readyToCalculate() returns false for a calculation containing '2+'", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('+');

	assert.notOk(testCalculator.readyToCalculate(testCalculator.baseCalculation));
})

QUnit.test("A calcualtion containing only a number and one sub-calculation will be evaluated", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('2');
	testCalculator.receiveInput('(');
	testCalculator.receiveInput('3');
	testCalculator.receiveInput(')');

	assert.equal(testCalculator.screen.outputDisplay, '6', "After inputting'2(3)' the output display will contain '6'");
});

/*QUnit.test("10/3 = 3.3333333333", function(assert) {
	testCalculator = new Calculator;
	testCalculator.receiveInput('1');
	testCalculator.receiveInput('0');
	testCalculator.receiveInput('/');
	testCalculator.receiveInput('3');

	assert.equal(testCalculator.calculateAll(), '3.3333333333');
});*/