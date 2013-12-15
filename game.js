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
    this.shipSize = 250;
    this.scale = 1;
    this.dimX = $(window).width();
    this.dimY = $(window).height();
    this.ship = Asteroids.Ship.buildShip([0,0]);
    this.zoomSize = 4000;
    this.zoomCount = 0;
    this.zoomScale = 1;
    this.screenCenter = [this.dimX/2, this.dimY/2];
    this.cameraCenter = [this.dimX/2, this.dimY/2];
  };

  Game.MSPF = 100;

  Game.prototype.addAsteroids = function (numAsteroids) {
    for (var i = 0; i < numAsteroids; i++ ){
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(this.dimX * this.scale, this.dimY * this.scale, this.scale));
    };
    var that = this;
    _.times(this.babyAsteroids.length, function(){that.asteroids.push(that.babyAsteroids.pop())});
  };

  Game.prototype.detectCollisions = function() {
    for (var i = this.asteroids.length - 1; i >= 0; i-- ) {
      if (this.asteroids[i].area < this.shipSize) {
        if (this.asteroids[i].isCollidedWith(this.ship)) {
          this.shipSize += this.asteroids[i].area;
          this.ship.radius = Math.sqrt(0.4 * this.shipSize);
          this.ship.grow();
          this.asteroids.splice(i,1);
          if (this.shipSize > this.zoomSize) {
            console.log(this.screenCenter);
            this.cameraCenter[0] += this.ship.centerX * (this.zoomScale * .750162944);
            this.cameraCenter[1] += this.ship.centerY * (this.zoomScale * .750162944);
            console.log(this.cameraCenter);
            this.zoomCount = 138;
            // this.screenCenter = this.ship.pos;
            var levelUp = new Audio('levelUp.wav')
            levelUp.play();
            this.zoomSize *= 16.346165883;
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


  Game.prototype.isOutOfBounds = function(object) {
    // if (object.centerX > this.dimX * this.scale + 100 || object.centerY > this.dimY * this.scale + 100 ||
    //   object.centerX < -100 || object.centerY < -100) {
    //   return true;
    // } else {
      return false;
    // }
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
      var laserSound = new Audio('fireBullet.wav')
      laserSound.play();
      g.bullets.push(Asteroids.Bullet.fireBullet(g, g.scale));
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
    var height = canvas.getAttribute("height");
    var width = canvas.getAttribute("width");
    ctx.fillStyle = "black";
    ctx.fillRect(-width,-height, 2 * width, 2 * height);
    ctx.save();

      ctx.translate(this.screenCenter[0], this.screenCenter[1]);

      ctx.scale(this.zoomScale,this.zoomScale);
      this.ship.draw(ctx);
      this.asteroids.forEach(function(asteroid) {
        asteroid.draw(ctx, that.shipSize);
      });
      this.bullets.forEach(function(bullet) {
        bullet.draw(ctx);
      });

    // ctx.fillStyle = "red"
    // ctx.beginPath();
    // ctx.arc(0,0,50,0,2*Math.PI);
    // ctx.closePath()
    // ctx.fill();
    // ctx.fillStyle='yellow';
    // ctx.beginPath();
    // ctx.arc(this.cameraCenter[0],this.cameraCenter[1],20 * this.scale,0,2*Math.PI);
    // ctx.closePath()
    // ctx.fill();

    ctx.fillStyle='black';
    ctx.beginPath();
    ctx.arc(this.ship.centerX,this.ship.centerY, 3 * this.scale,0,2*Math.PI);
    ctx.closePath()
    ctx.fill();


    // ctx.fillStyle = "blue"
    // ctx.beginPath();
    // ctx.arc(this.screenCenter[0],this.screenCenter[1],20 * this.scale,0,2*Math.PI);
    // ctx.closePath()
    // ctx.fill();



    ctx.restore();

    ctx.fillStyle = "purple";
    ctx.font = "bold 28px ocr a std";
    ctx.fillText(this.shipSize, 50, 50);
    // ctx.scale(.999,.999)

  };

  Game.prototype.detectShots = function() {
    if (this.bullets.length !== 0) {
      for (var i = this.bullets.length - 1; i >= 0; i--) {
        for (var j = this.asteroids.length - 1; j >= 0; j--) {
          if (this.bullets[i].isCollidedWith(this.asteroids[j]) && this.asteroids[j].area > this.shipSize) {
            var collisionSound = new Audio('explosion.wav')
            collisionSound.play();
            var babies = this.asteroids[j].fragmentAsteroid(this.bullets[i], this.shipSize);
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
    if (this.zoomCount !== 0) {
      this.zoomOut();
    }
    this.addAsteroids(Math.floor(Math.random() * 1.2));
  };

  Game.prototype.zoomOut = function(){
    this.zoomScale *= 0.99;
    this.screenCenter[0] += (this.cameraCenter[0] - this.screenCenter[0]) / this.zoomCount;
    this.screenCenter[1] += (this.cameraCenter[1] - this.screenCenter[1]) / this.zoomCount;
    console.log(this.screenCenter)
    this.zoomCount -= 1;
    this.scale = 1/this.zoomScale;
    this.ctx.lineWidth = this.scale;
    this.ship.scale = this.scale;
  };


  Game.prototype.start = function() {
    this.bindKeyHandlers();
    this.lastFrameTime = + new Date();
    this.step();
  };

})(this);




