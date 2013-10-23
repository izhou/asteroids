(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function (pos, vel, radius, color) {
		var COLOR = "green";
		var RADIUS = 10;
		this.inherits(Asteroids.MovingObject);
		Asteroids.MovingObject.call(this, pos, vel, radius, color);
	}

	Asteroid.randomAsteroid = function(dimX, dimY) {
		var randomX = Math.random * dimX;
		var randomY = Math.random * dimY;
		var randomStart = [randomX, randomY];
		var randomVec = [Math.random * 10, Math.random * 10];
		return new Asteroid(randomStart, randomVec, this.RADIUS, this.COLOR);
	}




})(this)