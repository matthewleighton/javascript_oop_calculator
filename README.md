#Javascript Object Oriented Calculator

##Summary
Calculations (e.g. 2+3) are stored as an array in a “Calculation” object.

2+3, for example, consists of three elements:

* The digit “2”.
* The “plus” operator.
* The digit “3”.

As well as Calculations, the other important object is the Operator. Rather than a plus simply being stored as a plus symbol, it’s stored in the calculation array as an Operator object. This object contains two main attributes:

* A function “performOperation()”:

 * This contains the instructions for how the operation should be performed. For example, the plus operator object is instructed to return a+b. (‘a’ and ‘b’ being two arguments given to the function).

* A “priority” attribute:

 * Due to the order of operations, we cannot simply tackle a calculation from left to right. For example, 1+2\*3, due to multiplication having a higher priority than addition, really means 1+(2*3). The priority attribute indicates to which operator a number should be associated. In this case the 2 is associated with the multiplication operator, rather than the addition.

 * Addition and subtraction - priority 1.
 * Multiplication and division - priority 2.
 * Exponents - priority 3.
 * Parentheses, although they outrank exponents, do not have a priority attribute, as they are not operations but rather another calculation object within the parent one.

At an overview, the calculation is solved by looping over the calculation array, dealing with higher priority operators first, leaving lower priority operators to be handled on a second loop. For example, 1+2*3, after the first loop, becomes 1+6. The ‘1+’ was ignored on the first loop, since the next digit, 2, was actually associated with the next operator due to its higher priority.

Parentheses (including both brackets and everything between) are stored in the array as a single value - another calculation object within the parent calculation. When one is encountered while solving the outer calculation it is immediately solved and replaced with its return value by running its runCalculation() function, just as the outer calculation is currently doing. This recursion can potentially result in us going several levels deep when solving parentheses within parentheses. (For example “2\*(3+4*(5+6)+7))”).