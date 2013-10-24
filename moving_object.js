(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var MovingObject = Asteroids.MovingObject = function (pos, vel, radius, color) {
		this.pos = pos;
		this.vel = vel;
		this.radius = radius;
		this.color = color;
		this.centerX = this.pos[0];
		this.centerY = this.pos[1];
	};

	MovingObject.prototype.move = function(vel) {
		this.centerX += vel[0];
		this.centerY += vel[1];
		this.pos = [this.centerX, this.centerY];

	};

	MovingObject.prototype.draw = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		// debugger
		ctx.arc(this.centerX, this.centerY, this.radius, 0, 2* Math.PI, false);
		ctx.fill();
	};

	MovingObject.prototype.isCollidedWith = function(otherObject) {
		var xDistance = this.centerX - otherObject.centerX;
		var yDistance = this.centerY - otherObject.centerY;

		var distance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 0.5);

		if (this.radius + otherObject.radius > distance) {
			return true;
		} else {
			return false;
		}
	}

})(this)