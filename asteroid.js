(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function (pos, vel, angle, radius, color) {
		Asteroids.MovingObject.call(this, pos, vel, angle, radius, color);
		this.coordinates = [];
		this.rotation = 0;
		this.rotationSpeed = Math.random() * 0.1 -0.05;
		var that = this;

		var angles = new Array(_.random(7,14));

		for (i = 0; i < angles.length; i++ ) {
			angles[i] = (2 * Math.PI * i / angles.length + Math.random() * 0.2);
		};

		// _.times(_.random(7,14), function() {
		// 	angles.push(Math.random() * 2 * Math.PI);
		// 	// _.map(angles, function(ang) {
		// 	// 	var sum =  _.reduce(ang, function(x,y){x + y}, 0);
		// 	// 	return ang / sum * 2 * Math.PI;
		// 	// });
		// });
		angles.sort();

		angles.forEach(function(ang){
			var x = that.radius * Math.cos(ang) * (0.6 + (Math.random() * 0.8));
			var y = that.radius * Math.sin(ang) * (0.6 + (Math.random() * 0.8));
			that.coordinates.push([x, y])
		});

		
	}

	Asteroid.COLOR = "gray";
	Asteroid.RADIUS = 5;

	Asteroid.inherits(Asteroids.MovingObject);


	Asteroid.prototype.draw = function(ctx) {
		ctx.strokeStyle = "white";
		ctx.fillStyle = this.color;
		ctx.save();

		ctx.translate(this.centerX, this.centerY)
		ctx.rotate(this.rotation);
		this.rotation += this.rotationSpeed;

		ctx.beginPath();
		console.log(this.coordinates);
		ctx.moveTo(this.coordinates[0][0], this.coordinates[0][1]);

		for (var i = 1; i < this.coordinates.length; i++) {
			ctx.lineTo( this.coordinates[i][0], this.coordinates[i][1]);
		};

		ctx.closePath();
//		ctx.fill();
		ctx.stroke();
		ctx.restore();

		
		// ctx.beginPath();
		// ctx.arc(this.centerX, this.centerY, this.radius, 0, 2* Math.PI, false);
		// ctx.stroke();
	};


	Asteroid.randomAsteroid = function(dimX, dimY) {
		var XSide = Math.floor(Math.random() * 2) * (dimX + 80) - 40;
		var YSide = Math.floor(Math.random() * 2) * (dimY + 80) - 40;
		var randomX = Math.floor(Math.random() * dimX);
		var randomY = Math.floor(Math.random() * dimX);
		startPosArray = [[XSide,randomY], [randomX, YSide]];

		var randomRadius = Math.floor(Math.random() * 40) + 30;
		var randomStart = startPosArray[Math.floor(Math.random() * 2)];
		var randomVec = (Math.random() * 100) + 25;
		var randomDir = (Math.random() * 2 * Math.PI)
		return new Asteroid(randomStart, randomVec, randomDir, randomRadius, Asteroid.COLOR);
	}

})(this)