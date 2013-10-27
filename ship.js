(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Ship = Asteroids.Ship = function (pos, vel, angle, radius, color) {
		Asteroids.MovingObject.call(this, pos, vel, angle, radius, color);
		this.angle_vel = 0;
	};

	Ship.COLOR = "#ADFF2F";
	Ship.RADIUS = 10;
	Ship.MAX_VEL = 500;
	Ship.MAX_ANGLE_VEL = Math.PI;

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

	Ship.prototype.move = function() {
		this.angle += this.angle_vel;
		this.angle_vel = this.angle_vel*0.98;
		this.centerX += Math.cos(this.angle) * this.vel;
		this.centerY += Math.sin(this.angle) * this.vel;
		this.pos = [this.centerX, this.centerY];

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
		this.angle_vel += direction * 0.2;
	}

	Ship.prototype.fireBullet = function() {
		var bullet = new Asteroids.Bullet(this.pos, this.vel, this.angle, 2, "#FF4C30");
		return bullet;
	}


})(this)