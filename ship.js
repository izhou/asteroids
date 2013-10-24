(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Ship = Asteroids.Ship = function (pos, vel, radius, color) {
		Asteroids.MovingObject.call(this, pos, vel, radius, color);
	};

	Ship.COLOR = "green";
	Ship.RADIUS = 10;
	Ship.MAX_VEL = 15;

	Ship.inherits(Asteroids.MovingObject);

	Ship.buildShip = function(pos) {
		return new Ship(pos, [0,0], Ship.RADIUS, Ship.COLOR);
	}

	Ship.prototype.power = function(impulse) {
		// impulse[0] *= 6;
		// impulse[1] ;
		//console.log(this.vel);
		this.vel[0] += impulse[0];
		this.vel[1] += impulse[1];
		if (this.vel[0] > Ship.MAX_VEL) {
			this.vel[0] = Ship.MAX_VEL;
		}
		if (this.vel[0] < -1 * Ship.MAX_VEL) {
			this.vel[0] = -1 * Ship.MAX_VEL;
		}
		if (this.vel[1] > Ship.MAX_VEL) {
			this.vel[1] = Ship.MAX_VEL;
		}
		if (this.vel[1] < -1 * Ship.MAX_VEL) {
			this.vel[1] = -1 * Ship.MAX_VEL;
		}
		// this.move(this.vel);
		// this.centerX += this.vel[0];
		// this.centerY += this.vel[1];
	}

	Ship.prototype.fireBullet = function() {
		console.log(this.vel);
		var bullet = new Asteroids.Bullet(this.pos, this.vel, 2, "red");
		console.log(bullet);
		// debugger
		return bullet;
	}



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