(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) { // function(ctx, dimX, dimY) {
		this.ctx = ctx;
		this.asteroids = [];
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

	Game.prototype.draw = function(ctx) {
		ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
		//debugger
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
	};

	Game.prototype.start = function() {
		this.addAsteroids(Game.AsteroidCount);
		// var ctx = canvas.getContext("2d");
		// var that = this
		// setInterval(this.step.bind(this), Game.FPS);

		var that = this;
		root.setInterval(function() {
			that.step();
			// console.log("test");
		}, Game.FPS);
	};

})(this);

