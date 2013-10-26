(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Ship = Asteroids.Ship = function (pos, vel, angle, radius, color) {
		Asteroids.MovingObject.call(this, pos, vel, angle, radius, color);
	};

	Ship.COLOR = "green";
	Ship.RADIUS = 10;
	Ship.MAX_VEL = 20;

	Ship.inherits(Asteroids.MovingObject);

	Ship.buildShip = function(pos) {
		return new Ship(pos, 0, 3*Math.PI/2, Ship.RADIUS, Ship.COLOR);
	}

	Ship.prototype.draw = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.save();
		that = this;
		ctx.translate(this.centerX, this.centerY)


		ctx.rotate(this.angle + Math.PI);
		
		ctx.beginPath();
		ctx.moveTo(-10, 0);
		ctx.lineTo( 10,  10 );
		ctx.lineTo( 10,  -10 );
		ctx.closePath();
		
		ctx.fill();
		
		ctx.restore();
	};



	Ship.prototype.power = function(impulse) {
		this.vel += impulse;
		if (this.vel > Ship.MAX_VEL) {
			this.vel = Ship.MAX_VEL;
		} else if (this.vel < 0) {
			this.vel = 0;
		}
	}

	Ship.prototype.rotate = function(direction) {
		this.angle += direction;
	}

	Ship.prototype.fireBullet = function() {
		var bullet = new Asteroids.Bullet(this.pos, this.vel, this.angle, 2, "red");
		return bullet;
	}


})(this)