
// Surrogate.prototype = SuperClass.prototype;
// Subclass.prototype = new Surrogate();

Function.prototype.inherits = function(superClass) {
	function Surrogate() {};

	Surrogate.prototype = superClass.prototype;
	this.prototype = new Surrogate();
}
//
// function Dog () {};
// Dog.prototype.bark = function () { console.log("Bark!"); };
//
// function Corgi () {};
// Corgi.inherits(Dog);
//
// new Corgi().bark();