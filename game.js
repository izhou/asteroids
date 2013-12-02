(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function(ctx) {
    this.ctx = ctx;
    
    this.bullets = [];
    this.asteroids = [];
    this.time = 0;
    this.keysPressed = [];
    this.animationFrame = null;
    this.lastFrameTime = null;
    this.elapsedSeconds = null;
    this.lastBulletTime = 0;
    this.babyAsteroids = [];
    this.shipSize = 200;
    this.dimX = $(window).width();
    this.dimY = $(window).height();
    this.ship = Asteroids.Ship.buildShip([this.dimX/2, this.dimY/2]);
  };

  // Game.dimX = $(window).width();
  // Game.dimY = $(window).height()
  Game.MSPF = 100;

  Game.prototype.addAsteroids = function (numAsteroids) {
    for (var i = 0; i < numAsteroids; i++ ){
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(this.dimX, this.dimY, this.ship.radius));
    };
    var that = this;
    _.times(this.babyAsteroids.length, function(){that.asteroids.push(that.babyAsteroids.pop())});
  };

  Game.prototype.detectCollisions = function() {
    for (var i = this.asteroids.length - 1; i >= 0; i-- ) {
      if (this.asteroids[i].area < this.shipSize) {
        if (this.asteroids[i].isCollidedWith(this.ship)) {
          this.shipSize += this.asteroids[i].area;
          this.ship.radius = Math.sqrt(0.5 * this.shipSize);
          this.ship.scale();
          this.asteroids.splice(i,1);
          if (this.shipSize > 500) {
            _.once(this.zoomOut());
          }
        }
      } else {
        if (this.ship.isCollidedWith(this.asteroids[i])) {
          // alert('You died!');
          // this.stop(); 
        }
      }
    };
  };

  Game.prototype.zoomOut = function() {
    this.ctx.scale(0.99
      ,0.99);
    this.dimX = $(window).width();
    this.dimY = $(window).height();
  }

  Game.prototype.isOutOfBounds = function(object) {
    if (object.centerX > this.dimX + 100 || object.centerY > this.dimY + 100 ||
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

    if ((now - this.lastBulletTime) >= 0.10) {
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
    var that = this;
    ctx.clearRect(0,0, canvas.getAttribute("width") * 2, canvas.getAttribute("height") * 2);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.getAttribute("width") * 2, canvas.getAttribute("height") * 2);
    //debugger
    this.ship.draw(ctx);
    this.bullets.forEach(function(bullet) {
      bullet.draw(ctx);
    });
    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(ctx, that.shipSize);
    });
    ctx.fillStyle = "purple";
    ctx.font = "bold 28px Arial";
    ctx.fillText(this.shipSize, 50, 50);
    //ctx.scale(.999,.999)

  };

  Game.prototype.detectShots = function() {
    if (this.bullets.length !== 0) {
      for (var i = this.bullets.length - 1; i >= 0; i--) {
        for (var j = this.asteroids.length - 1; j >= 0; j--) {
          if (this.bullets[i].isCollidedWith(this.asteroids[j]) && this.asteroids[j].area > this.shipSize) {
            var babies = this.asteroids[j].fragmentAsteroid(this.bullets[i], this.shipSize);
            console.log(babies);
            if (babies)
              this.babyAsteroids.push.apply(this.babyAsteroids, babies);
            this.bullets.splice(i,1);
            this.asteroids.splice(j,1);
            break;
          }
        }
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
    this.detectShots();
    this.removeOffScreen();
    this.move(elapsedSeconds);
    this.draw(this.ctx);
    this.detectCollisions();
    this.addAsteroids(Math.floor(Math.random() * 1.05));
  };

  Game.prototype.start = function() {
    this.bindKeyHandlers();
    this.lastFrameTime = + new Date();
    this.step();
  };

})(this);




