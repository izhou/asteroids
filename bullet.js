(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Bullet = Asteroids.Bullet = function (pos, vel, angle, radius, color) {

		Asteroids.MovingObject.call(this, pos, 500, angle, radius, color);
	}


	Bullet.inherits(Asteroids.MovingObject);

	Bullet.prototype.hitAsteroids = function(asteroids) {
		for (var i = asteroids.length - 1; i >= 0; i--) {
			if (this.isCollidedWith(asteroids[i])) {
				asteroids.splice(i,1);
				return true;
			}
		}
	}


})(this)