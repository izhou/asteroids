(function(root) {

	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) {
		this.ctx = ctx;
		this.asteroids = [];
		this.ship = Asteroids.Ship.buildShip([Game.DIM_X/2, Game.DIM_Y/2]);
		this.bullets = [];
		this.time = 0;
	};

	Game.DIM_X = $(window).width();
	Game.DIM_Y = $(window).height()
	Game.FPS = 100;

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
		//console.log(object)
		if (object.centerX > Game.DIM_X + 50 || object.centerY > Game.DIM_Y + 50 ||
			object.centerX < -50 || object.centerY < -50) {
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
		//console.log(this.ship);
		that.bullets.push(that.ship.fireBullet());
	}

	

	Game.prototype.bindKeyHandlers = function(event) {
		switch(event.which) {
		case 32:
			this.fireBullet();
			break;
		case 87:
			this.ship.power(1);
			break;
		case 83:
			this.ship.power(-1);
		case 65:
			this.ship.rotate(-0.5);
			break;
		case 68:
			this.ship.rotate(0.5);
			break;
		}

	};


	Game.prototype.stop = function() {
		clearInterval(this.time);
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
			console.log(this.bullets[i]);
			if (this.bullets[i].hitAsteroids(this.asteroids)) {
				this.bullets.splice(i,1);
			}
		}
	};

	Game.prototype.move = function() {
		this.ship.move(this.ship.vel, this.ship.angle);
		this.asteroids.forEach(function(asteroid) {
			asteroid.move(asteroid.vel, asteroid.angle);
		});
		this.bullets.forEach(function(bullet) {
			bullet.move(bullet.vel, bullet.angle);
		});
	};

	Game.prototype.step = function() {
		this.move();
		this.draw(this.ctx);
		this.checkCollisions();
		this.removeOffScreen();
		this.addAsteroids(Math.floor(Math.random() * 2));
		this.removeShotAsteroids();
	};


	Game.prototype.start = function() {
		$(window).keydown(this.bindKeyHandlers.bind(this))
		var g = this;
		this.time = root.setInterval(function() {
			g.step();
		}, Game.FPS);
	};

})(this);

