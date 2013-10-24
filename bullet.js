(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Bullet = Asteroids.Bullet = function (pos, vel, radius, color) {
		var bulletVel = [vel[0] * 5, vel[1] * 5];

		Asteroids.MovingObject.call(this, pos, bulletVel, radius, color);
	}


	Bullet.inherits(Asteroids.MovingObject);

	Bullet.prototype.hitAsteroids = function(asteroids) {
		for (var i = 0; i < asteroids.length; i++) {
			if (this.isCollidedWith(asteroids[i])) {
				asteroids.splice(i,1);
				return true;
			}
		}
	}


})(this)