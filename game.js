(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) {
		this.ctx = ctx;
		this.asteroids = [];
		this.ship = Asteroids.Ship.buildShip([Game.DIM_X/2, Game.DIM_Y/2]);
		this.bullets = [];
		this.time = 0;
		this.keysPressed = [];
		this.gameEnded = false;
		this.animationFrame = null;
		this.lastFrameTime = null;
		this.elapsedSeconds = null;
		this.lastBulletTime = 0;
	};

	Game.DIM_X = $(window).width();
	Game.DIM_Y = $(window).height()
	Game.MSPF = 100;

	Game.prototype.addAsteroids = function (numAsteroids) {
		for (var i = 0; i < numAsteroids; i++ ){
			this.asteroids.push(Asteroids.Asteroid.randomAsteroid(Game.DIM_X, Game.DIM_Y));
		};
	};

	Game.prototype.checkCollisions = function() {
		for (var i = 0; i < this.asteroids.length; i++ ) {
			if (this.ship.isCollidedWith(this.asteroids[i])) {
				alert('You died!');
				this.stop();
			}
		};
	};

	Game.prototype.isOutOfBounds = function(object) {
		if (object.centerX > Game.DIM_X + 100 || object.centerY > Game.DIM_Y + 100 ||
			object.centerX < -100 || object.centerY < -100) {
			return true;
		} else {
			return false;
		}
	};

	Game.prototype.removeOffScreen = function() {
		for (var i = this.asteroids.length - 1; i >= 0; i--) {
			if(this.isOutOfBounds(this.asteroids[i])) {
				this.asteroids.splice(i,1);
			}
		};

		for (var i = this.bullets.length - 1; i >= 0; i--) {
			if(this.isOutOfBounds(this.bullets[i])) {
				this.bullets.splice(i,1);
			}
		};

		if(this.isOutOfBounds(this.ship)) {
			alert('Oh no! You have floated off into the great unknown...');
			this.stop();
		};
	};

	Game.prototype.fireBullet = function() {
		var that = this;
		var now = (+ new Date)/1000;
		console.log(now - this.lastBulletTime);
		if ((now - this.lastBulletTime) >= 0.1) {
			that.bullets.push(that.ship.fireBullet());
			this.lastBulletTime = now;
		}
	}

	Game.prototype.bindKeyHandlers = function() {
		var g = this;
		
		$(window).keydown(function(e) {
			if (e.which === 32) {
				e.preventDefault();
			}
			g.keysPressed.push(e.which);
			g.keysPressed = _.uniq(g.keysPressed);
			//g.bindKeyHandlers(g.keysPressed);
		}).keyup(function(e) {
			g.keysPressed = _.without(g.keysPressed, e.which);
		});
//		return g.keysPressed;
	};

	Game.prototype.applyActions = function(elapsedSeconds) {
		var g = this;

		g.keysPressed.forEach(function(key) {
				switch(key) {
					case 32:
						g.fireBullet();
						break;
					case 87:
						g.ship.power(elapsedSeconds);
						break;
					case 83:
						g.ship.power(-elapsedSeconds);
						break;
					case 65:
						g.ship.rotate(-elapsedSeconds);
						break;
					case 68:
						g.ship.rotate(elapsedSeconds);
						break;
				}
			}
		);
	};


	Game.prototype.stop = function() {
		cancelAnimationFrame(this.animationFrame);
	}

	Game.prototype.draw = function(ctx) {
		ctx.clearRect(0,0, Game.DIM_X, Game.DIM_Y);
		ctx.fillStyle = "black";
		ctx.fillRect(0,0, canvas.getAttribute("width"), canvas.getAttribute("height"));
		//debugger
		this.ship.draw(ctx);
		this.bullets.forEach(function(bullet) {
			bullet.draw(ctx);
		});
		this.asteroids.forEach(function(asteroid) {
			asteroid.draw(ctx);
		});
	};

	Game.prototype.removeShotAsteroids = function() {
		if (this.bullets.length === 0) {
			return true;
		}
		for (i = this.bullets.length - 1; i >= 0; i--) {
			if (this.bullets[i].hitAsteroids(this.asteroids)) {
				this.bullets.splice(i,1);
			}
		}
	};

	Game.prototype.move = function(elapsedSeconds) {
		this.ship.move();
		this.asteroids.forEach(function(asteroid) {
			asteroid.move(asteroid.vel * elapsedSeconds, asteroid.angle);
		});
		this.bullets.forEach(function(bullet) {
			bullet.move(bullet.vel * elapsedSeconds, bullet.angle);
		});
	};

	Game.prototype.step = function() {
		this.animationFrame = requestAnimationFrame(this.step.bind(this));
		var now = + new Date()
		var elapsedSeconds = (now - this.lastFrameTime)/1000;
		//console.log(this.elapsedSeconds);
		this.lastFrameTime = now;
		this.applyActions(elapsedSeconds);
		this.move(elapsedSeconds);
		this.draw(this.ctx);
		this.checkCollisions();
		this.removeOffScreen();
		this.addAsteroids(Math.floor(Math.random() * 1.2));
		this.removeShotAsteroids();

	};


	Game.prototype.start = function() {
		this.bindKeyHandlers();
		this.lastFrameTime = + new Date();
		this.step();
		//this.time = root.setInterval(function() {
		//	g.step();
		//}, Game.MSPF);
	};

})(this);




