(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function (pos, vel, radius, color) {

		Asteroids.MovingObject.call(this, pos, vel, radius, color);
	}

	Asteroid.COLOR = "white";
	Asteroid.RADIUS = 5;

	Asteroid.inherits(Asteroids.MovingObject);

	Asteroid.randomAsteroid = function(dimX, dimY) {
		var randomX = Math.floor(Math.random() * 2) * dimX;
		var randomY = Math.floor(Math.random() * 2) * dimY;
		var randomStart = [randomX, randomY];
		var randomVec = [(Math.random() * 20) - 10, (Math.random() * 20) - 10];
		return new Asteroid(randomStart, randomVec, Asteroid.RADIUS, Asteroid.COLOR);
	}




})(this)