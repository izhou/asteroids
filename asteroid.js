(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function (pos, vel, radius, color) {

		Asteroids.MovingObject.call(this, pos, vel, radius, color);
	}

	Asteroid.COLOR = "white";
	Asteroid.RADIUS = 5;

	Asteroid.inherits(Asteroids.MovingObject);

	Asteroid.randomAsteroid = function(dimX, dimY) {
		var XSide = Math.floor(Math.random() * 2) * dimX;
		var YSide = Math.floor(Math.random() * 2) * dimY;
		var randomX = Math.floor(Math.random() * dimX);
		var randomY = Math.floor(Math.random() * dimX);
		startPosArray = [[XSide,randomY], [randomX, YSide]];

		var randomRadius = Math.floor(Math.random() * 30) + 5;
		var randomStart = startPosArray[Math.floor(Math.random() * 2)];
		var randomVec = [(Math.random() * 16) - 8, (Math.random() * 16) - 8];
		return new Asteroid(randomStart, randomVec, randomRadius, Asteroid.COLOR);
	}

})(this)