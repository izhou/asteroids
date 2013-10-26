(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function (pos, vel, angle, radius, color) {

		Asteroids.MovingObject.call(this, pos, vel, angle, radius, color);
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

		var randomRadius = Math.floor(Math.random() * 40) + 30;
		var randomStart = startPosArray[Math.floor(Math.random() * 2)];
		var randomVec = (Math.random() * 16) - 8;
		var randomDir = (Math.random() * 2 * Math.PI)
		return new Asteroid(randomStart, randomVec, randomDir, randomRadius, Asteroid.COLOR);
	}

})(this)