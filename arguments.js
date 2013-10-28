var sum = function() {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
};

Function.prototype.myBind = function() {
  var args = Array.prototype.slice.call(arguments);
  var f = this;
  return function() {
    f.apply(args[0], args.slice(1));
  }
};

function curriedSum(numArgs) {
  var numbers = [];
  function _curriedSum(number) {
    numbers.push(number);
    if (numbers.length === numArgs) {
      var total = 0;
      numbers.forEach(function(number) {
        total += number;
      })
      return total;
    } else {
      return _curriedSum;
    }
  };
  return _curriedSum;
};

Function.prototype.curry = function(numArgs) {
  var args = [];
  var that = this;

  function _curry(arg) {
    args.push(arg);
    if (args.length === numArgs) {
      return that.apply(null, args);
    } else {
      return _curry;
    }
  }
  return _curry;
};
