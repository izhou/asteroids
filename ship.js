(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Ship = Asteroids.Ship = function (pos, vel, radius, color) {
		Asteroids.MovingObject.call(this, pos, vel, radius, color);
	};

	Ship.COLOR = "green";
	Ship.RADIUS = 30;

	Ship.inherits(Asteroids.MovingObject);

	Ship.buildShip = function(pos) {
		return new Ship(pos, [0,0], Ship.RADIUS, Ship.COLOR);
	}

	// Ship.prototype.power = funct



	//
	// Asteroid.randomAsteroid = function(dimX, dimY) {
	// 	var randomX = Math.random() * dimX;
	// 	var randomY = Math.random() * dimY;
	// 	var randomStart = [randomX, randomY];
	// 	var randomVec = [(Math.random() * 50) - 25, (Math.random() * 50) - 25];
	// 	return new Asteroid(randomStart, randomVec, Asteroid.RADIUS, Asteroid.COLOR);
	// }
	//



})(this)