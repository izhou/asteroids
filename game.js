(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function(ctx) {
    this.ctx = ctx;
    this.ship = Asteroids.Ship.buildShip([Game.DIM_X/2, Game.DIM_Y/2]);
    this.bullets = [];
    this.asteroids = [];
    this.time = 0;
    this.keysPressed = [];
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

  Game.prototype.checkEndGame = function() {
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
    var g = this;
    var now = (+ new Date)/1000;

    if ((now - this.lastBulletTime) >= 0.2) {
      g.bullets.push(Asteroids.Bullet.fireBullet(g));
      this.lastBulletTime = now;
    }
  }

  Game.prototype.bindKeyHandlers = function() {
    var g = this;
    
    $(window).keydown(function(e) {
      if (e.which === 32) { e.preventDefault(); }
      g.keysPressed.push(e.which);
      g.keysPressed = _.uniq(g.keysPressed);

    }).keyup(function(e) {
      g.keysPressed = _.without(g.keysPressed, e.which);
    });
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
  };

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

  Game.prototype.removeCollisions = function() {
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
    this.lastFrameTime = now;
    this.applyActions(elapsedSeconds);
    this.move(elapsedSeconds);
    this.draw(this.ctx);
    this.checkEndGame();
    this.removeCollisions();
    this.removeOffScreen();
    this.addAsteroids(Math.floor(Math.random() * 1.2));
  };


  Game.prototype.start = function() {
    this.bindKeyHandlers();
    this.lastFrameTime = + new Date();
    this.step();
  };

})(this);




