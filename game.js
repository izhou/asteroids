(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) { // function(ctx, dimX, dimY) {
		this.ctx = ctx;
		this.asteroids = [];
		this.ship = Asteroids.Ship.buildShip([Game.DIM_X/2, Game.DIM_Y/2]);
		this.time = 0;
	};

	Game.DIM_X = 1000;
	Game.DIM_Y = 1000;
	Game.FPS = 100;
	Game.AsteroidCount = 30;

	Game.prototype.addAsteroids = function (numAsteroids) {
		for (var i = 0; i < numAsteroids; i++ ){
			this.asteroids.push(Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
		}
		console.log(this.asteroids);
	};

	Game.prototype.checkCollisions = function() {
		for (var i = 0; i < this.asteroids.length; i++ ){
			if (this.ship.isCollidedWith(this.asteroids[i])) {
				alert('You died!');
				this.stop();
			}
		}
	}

	Game.prototype.stop = function() {
		clearInterval(this.time);
	}

	Game.prototype.draw = function(ctx) {
		ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
		ctx.fillStyle = "black";
		ctx.fillRect(0,0, canvas.getAttribute("width"), canvas.getAttribute("height"));
		//debugger
		this.ship.draw(ctx);
		this.asteroids.forEach(function(asteroid) {
			asteroid.draw(ctx);
		});
	};

	Game.prototype.move = function() {
		// for (var i = 0; i < this.asteroids.length; i++) {
		// 	this.asteroids[i].move(this.asteroids[i].vel);
		// }
		this.asteroids.forEach(function(asteroid) {
			asteroid.move(asteroid.vel);
		});
	};

	Game.prototype.step = function() {
		this.move();
		this.draw(this.ctx);
		this.checkCollisions();
	};


	Game.prototype.start = function() {
		this.addAsteroids(Game.AsteroidCount);
		// var ctx = canvas.getContext("2d");
		// var that = this
		// setInterval(this.step.bind(this), Game.FPS);

		var that = this;
		this.time = root.setInterval(function() {
			that.step();
			// console.log("test");
		}, Game.FPS);
	};

})(this);

