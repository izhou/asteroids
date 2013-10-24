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
		that = this;

		this.vel.forEach(function(value, i) {
			value += impulse[i];
			if (value > Ship.MAX_VEL) {
				value = Ship.MAX_VEL;
			} else if(value < -1 * Ship.MAX_VEL) {
				value = - 1 * Ship.MAX_VEL;
			};
			that.vel[i] = value;
		})
	}

	Ship.prototype.fireBullet = function() {
		var bullet = new Asteroids.Bullet(this.pos, this.vel, 2, "red");
		return bullet;
	}


})(this)