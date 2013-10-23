(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function (pos, vel, radius, color) {

		Asteroids.MovingObject.call(this, pos, vel, radius, color);
	}

	Asteroid.COLOR = "black";
	Asteroid.RADIUS = 5;

	Asteroid.inherits(Asteroids.MovingObject);

	Asteroid.randomAsteroid = function(dimX, dimY) {
		var randomX = Math.random() * dimX;
		var randomY = Math.random() * dimY;
		var randomStart = [randomX, randomY];
		var randomVec = [(Math.random() * 50) - 25, (Math.random() * 50) - 25];
		return new Asteroid(randomStart, randomVec, Asteroid.RADIUS, Asteroid.COLOR);
	}




})(this)