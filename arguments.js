var sum = function() {
	var total = 0;
	for (var i = 0; i < arguments.length; i++) {
		total += arguments[i];
	}
	return total;
}

Function.prototype.myBind = function() {
	var args = Array.prototype.slice.call(arguments);
	var myObj = args[0];
	var restOfArgs = args.slice(1);
	var that = this;
	return function() {
		that.apply(myObj, restOfArgs);
	}
}

function times(num, fun) {
  for (var i = 0; i < num; i++) {
    fun(); // call is made "function-style"
  }
}

var cat = {
  age: 5,

  age_one_year: function (num, mult) {
    this.age += num * mult;
  }
};

times(10, cat.age_one_year.myBind(cat, 3, 5));
// console.log(cat.age);

function curriedSum(numArgs) {
	var numbers = [];
	function _curriedSum(number) {
		numbers.push(number);
		if (numbers.length === numArgs) {
			var total = 0;
			for(var i = 0; i < numArgs; i++) {
				total += numbers[i];
			}
			return total;
		} else {
			return _curriedSum;
		}
	}
	return _curriedSum;
}

var sum = curriedSum(4);
console.log(sum(5)(30)(20)(1));
// console.log(sum(5)(30)(20)(1));