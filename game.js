(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx, dimX, dimY) {
		this.ctx = ctx;
		this.asteroids = [];
		var DIM_X = dimX;
		var DIM_Y = dimY;
		var FPS = 30000;
	};

	Game.prototype.addAsteroids = function (numAsteroids) {
		for (var i = 0; i < numAsteroids; i++ ){
			this.asteroids.push(Asteroid.randomAsteroid(this.DIM_X, this.DIM_Y));
		}
	};

	Game.prototype.draw = function(ctx) {
		ctx.clearRect(0,0, this.DIM_X, this.DIM_Y);

		this.asteroids.forEach(function(asteroid) {
			asteroid.draw(ctx);
		});
	};

	Game.prototype.move = function() {
		this.asteroids.forEach(function(asteroid) {
			asteroid.move(asteroid.vel);
		});
	};

	Game.prototype.step = function() {
		this.move();
		this.draw(this.ctx);
	}

	Game.prototype.start = function() {
		root.setInterval(this.step(), this.FPS);
	}

})