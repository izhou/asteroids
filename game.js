(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Game = Asteroids.Game = function(ctx) {
    this.ctx = ctx;
    this.stars = [];
    this.bullets = [];
    this.asteroids = [];
    this.ship = Asteroids.Ship.buildShip([0,0]);
    this.livesLeft = 3;
    this.shipFragments = [];
    // this.music = new Audio('sound/Virt_-_Katamari_Damacy.mp3');
    // this.music.loop = true;
    this.music = Asteroids.Game.loadMusic();

    this.time = 0;
    this.keysPressed = [];
    this.isPaused = false;
    this.animationFrame = null;
    this.elapsedSeconds = null;
    this.lastFrameTime = null;
    this.lastBulletTime = 0;
    this.lastShatterTime = 0;
    this.difficulty = 1;

    this.babyAsteroids = [];
    this.asteroidRate = 1.05;

    this.dimX = $(window).width();
    this.dimY = $(window).height();
    
    this.zoomCount = 0;
    this.scale = 1;
    this.zoomScale = 1;    
    
    this.zoomSize = 4000;
    
    this.cameraCenter = [this.dimX/2, this.dimY/2];
    this.screenCenter = [this.dimX/2, this.dimY/2];
    this.soundPool = Asteroids.Game.buildSoundPool();

  };

  Game.MSPF = 100;

  Game.prototype.addAsteroids = function (numAsteroids) {
    for (var i = 0; i < numAsteroids; i++ ){
      this.asteroids.push(Asteroids.Asteroid.randomAsteroid(this.dimX, this.dimY, this.screenCenter, this.scale, this.difficulty));
    };
    var that = this;
    _.times(this.babyAsteroids.length, function(){that.asteroids.push(that.babyAsteroids.pop())});
  };

  Game.prototype.addStarterAsteroids = function (numAsteroids) {
    for (var i = 0; i < numAsteroids; i++ ){
      this.asteroids.push(Asteroids.Asteroid.starterAsteroid(this.dimX, this.dimY, this.screenCenter, this.scale, this.difficulty));
    };
  };

  Game.prototype.addStars = function (numStars) {
    for (var i = 0; i < numStars; i++ ){
      this.stars.push(Asteroids.Star.randomStar(this.dimX, this.dimY, this.scale));
    }
  };

  Game.loadMusic = function() {
    var music = new Audio('sound/Virt_-_Katamari_Damacy.mp3');
    music.load();
    music.loop = true;
    return music;
  };

  Game.buildSoundPool = function(maxSize) {
    this.explosions = [];
    this.bullets = [];
    
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j <= 5; j++) {
        var explosion = new Audio('sound/explosion'
          + j.toString()
          + ((j < 4) ? '.wav' : '.mp3')
        );
        explosion.volume = 0.5;
        explosion.load();
        this.explosions.push(explosion);
      }
    }

    for (var i = 0; i < 5; i++) {   
      var bullet = new Audio('sound/fireBullet.wav');
      bullet.load();
      this.bullets.push(bullet);
    }
    this.levelUp = new Audio('sound/levelUp.wav');
    this.death = new Audio('sound/death.mp3');
    this.deathsplosion = new Audio('sound/deathsplosion.mp3')
    
    this.levelUp.load();
    this.death.load();
    this.deathsplosion.load();

    return this;
  };

  Game.prototype.playSoundFromPool = function(pool) {
    var startInd = Math.floor(Math.random() * pool.length) //randomizes explosions sound
    for (var i = 0; i < pool.length; i++) {
      var index = (startInd + i) % pool.length;
      if (pool[index].currentTime == 0) {
        this.loadSound(pool[index]);
        break;
      }
    }
  }

  Game.prototype.loadSound = function(sound){
    sound.play();
    sound.addEventListener('ended', function(s) {
      sound.load();
    });
  };

  Game.prototype.playSound = function(sound) {
    if (sfxOn) {
      switch(sound) {
        case 'levelUp':
          this.loadSound(this.soundPool.levelUp);
          break;
        case 'laser':
          this.playSoundFromPool(this.soundPool.bullets);
          break;
        case 'death':
          this.loadSound(this.soundPool.death);
          this.loadSound(this.soundPool.deathsplosion);
          break;
        case 'explosion':
          this.playSoundFromPool(this.soundPool.explosions);
          break;
      }
    }
  };

  Game.prototype.detectCollisions = function() {
    var now = (+ new Date)/1000;
    if (!this.ship.isGhost) {
      for (var i = this.asteroids.length - 1; i >= 0; i-- ) {
        if (this.asteroids[i].area < this.ship.size) {
          if (this.asteroids[i].isCollidedWith(this.ship)) {
            this.ship.resize(this.asteroids[i].area);
            this.asteroids.splice(i,1);
            if (this.ship.size > this.zoomSize) {
              // this.cameraCenter = this.ship.pos;
              this.cameraCenter[0] += this.ship.centerX * (this.zoomScale * 0.800009);
              this.cameraCenter[1] += this.ship.centerY * (this.zoomScale * 0.800009);
              this.zoomCount = 123;
              this.difficulty *= 1.1;
              this.playSound('levelUp');
              this.zoomSize *= 25;
            }
          }
        } else {
          if (this.ship.isCollidedWith(this.asteroids[i])) {
            this.ship.isShattered = true;
            this.shipFragments = this.ship.fragment(this.scale);
            this.removeLife();
          }
        }
      };
    }
  };

  Game.prototype.removeLife = function() {
    this.playSound('death');
    this.music.pause();

    var g = this;
    g.ship.isGhost = true;

    setTimeout(function(){
      if (g.livesLeft === 0) {
        g.endGame();
      } else {
        g.livesLeft -= 1;
        setTimeout(function(){
          this.lastShatterTime = 100;
          g.ship = Asteroids.Ship.buildShip([(g.dimX/2 - g.screenCenter[0]) * g.scale ,(g.dimY/2 - g.screenCenter[1]) * g.scale], g.scale, g.ship.radius, g.ship.size);
          g.shipFragments = [];
          g.ship.ghost();
          g.music.load();
          setTimeout(function() {
            if (musicOn) {
              g.music.play();
            }
          }, 1500);
        }, 500);
      }
    }, 800)
  };

  Game.prototype.isOutOfBounds = function(object) {
    if ( (object.centerX < -this.screenCenter[0] * this.scale * 1.5) || (object.centerX > (this.dimX - this.screenCenter[0]) * this.scale * 1.5) || (object.centerY < -this.screenCenter[1] * this.scale * 1.5) ||  (object.centerY > (this.dimY - this.screenCenter[1]) * this.scale * 1.5)) {
      return true;
    } else {
      return false;
    }
  };
  
  Game.prototype.removeTooSmall = function() {
    for (var i = this.asteroids.length - 1; i >= 0; i--) {
      if(this.asteroids[i].area < this.scale * this.scale * 2) {
        this.asteroids.splice(i,1);
      }
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
      if (!this.ship.isGhost) {
        this.removeLife();
      }
    };
  };

  Game.prototype.removeStars = function(){
    if (this.stars.length > 600) {
      this.stars.splice(0,this.stars.length - 600);
    }
  };

  Game.prototype.fireBullet = function(elapsedSeconds) {
    var now = (+ new Date)/1000;

    if ((now - this.lastBulletTime) >= 0.2) {
      this.ship.power(-elapsedSeconds * 0.5);
      this.playSound('laser');
      this.bullets.push(Asteroids.Bullet.fireBullet(this, this.scale));
      this.lastBulletTime = now;
    }
  };

  Game.prototype.bindKeyHandlers = function() {
    var g = this;
    
    $(window).keydown(function(e) {
      if (e.which === 80) { g.pause(); } //pause if P
      if (e.which === 32) { e.preventDefault(); } //spacebar
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
            if (!g.ship.isGhost)
              g.fireBullet(elapsedSeconds);
            break;
          case 87:
          case 38:
            g.ship.power(elapsedSeconds);
            break;
          case 83:
          case 40:
            g.ship.power(-elapsedSeconds);
            break;
          case 65:
          case 37:
            g.ship.rotate(-elapsedSeconds);
            break;
          case 68:
          case 39:
            g.ship.rotate(elapsedSeconds);
            break;
          case 81: //q ends the game
            g.music.pause();
            g.endGame();
        }
      }
    );
  };

  Game.prototype.unbindKeyHandlers = function() {
    $(window).unbind('keydown');
    $(window).unbind('keyup');
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
      
      if (!this.ship.isShattered) {
        this.ship.draw(ctx);
      } else {
        this.shipFragments.forEach(function(fragment) {
          fragment.draw(ctx);
        });
      }
      
      this.stars.forEach(function(star) {
        star.draw(ctx);
      })
      this.asteroids.forEach(function(asteroid) {
        asteroid.draw(ctx, that.ship.size);
      });  
      this.bullets.forEach(function(bullet) {
        bullet.draw(ctx);
      });
    
    ctx.restore();

    ctx.fillStyle = "red";
    ctx.font = "bold 28px ocr a std";
    ctx.fillText(this.ship.size, 50, 50);
    ctx.xCoord = 50;

    ctx.fillStyle = 'rgba(173, 255, 47, 1)'
    _.times(this.livesLeft, function() {
      ctx.beginPath();
      ctx.moveTo(ctx.xCoord, 80);
      ctx.lineTo(ctx.xCoord + 10, 80);
      ctx.lineTo(ctx.xCoord + 5, 65);
      ctx.closePath();
      ctx.fill();
      ctx.xCoord += 25;
    })
  };

  Game.prototype.detectShots = function() {
    if (this.bullets.length !== 0) {
      for (var i = this.bullets.length - 1; i >= 0; i--) {
        for (var j = this.asteroids.length - 1; j >= 0; j--) {
          if (this.bullets[i].isCollidedWith(this.asteroids[j]) && this.asteroids[j].area > this.ship.size) {
            this.playSound('explosion');
            var babies = this.asteroids[j].fragmentAsteroid(this.bullets[i], this.ship.size);
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

  Game.prototype.zoomOut = function(){
    this.zoomScale *= 0.987;
    this.scale = 1/this.zoomScale;
    this.screenCenter[0] += (this.cameraCenter[0] - this.screenCenter[0]) / this.zoomCount;
    this.screenCenter[1] += (this.cameraCenter[1] - this.screenCenter[1]) / this.zoomCount;
    this.zoomCount -= 1;
    this.ctx.lineWidth = this.scale;
    this.ship.scale = this.scale;
  };

  Game.prototype.move = function(elapsedSeconds) {
    var g = this;
    if (!this.ship.isShattered) {
      this.ship.move(elapsedSeconds);
    } else {
      this.shipFragments.forEach(function(fragment) {
        fragment.move(elapsedSeconds);
      })
    };

    this.asteroids.forEach(function(asteroid) {
      asteroid.move(elapsedSeconds);
    });
    this.bullets.forEach(function(bullet) {
      bullet.move(elapsedSeconds);
    });
    var shipXVel = Math.cos(this.ship.angle) * this.ship.vel;
    var shipYVel = Math.sin(this.ship.angle) * this.ship.vel;    

    this.stars.forEach(function(star) {
      star.zoomMove(elapsedSeconds, g.ship.pos, [shipXVel,shipYVel]);
    })
  };


  Game.prototype.step = function() {
    this.animationFrame = requestAnimationFrame(this.step.bind(this));
    var now = + new Date()
    var elapsedSeconds = (now - this.lastFrameTime)/1000;
    this.lastFrameTime = now;

    if (this.ship.isShattered) {
      var now = (+ new Date)/1000;
      if ((now - this.lastShatterTime) >= 0.2) {
        this.shipFragments = _.flatten(this.shipFragments.map(function(fragment) {
          if (Math.random() > 0.8) return fragment.shatter();
          return fragment;
        }));
        this.shipFragments = _.flatten(this.shipFragments.map(function(fragment) {
          if (Math.random() > 0.95) return fragment.shatter();
          return fragment;
        }));
        this.lastShatterTime = now;
      }
    }

    if (!this.isPaused) {
      this.applyActions(elapsedSeconds);
      this.detectCollisions();
      this.detectShots();
      this.move(elapsedSeconds);
      this.draw(this.ctx);
      
      if (this.zoomCount !== 0) {
        this.zoomOut();
        this.asteroidRate *= 1.0045;
        this.addStars(Math.floor(Math.random() * this.asteroidRate * this.asteroidRate * 3));
        if (this.zoomCount === 0) {
          this.scale = Math.floor(this.scale);
          this.zoomScale = 1/this.scale;
          this.ship.radius = Math.floor(this.ship.radius);
        }
      } else {
        this.asteroidRate = 1.05;
        this.removeOffScreen();
      }

      this.removeTooSmall();
      this.removeStars();
      this.addAsteroids(Math.floor(Math.random() * this.asteroidRate));
      this.addStars(Math.floor(Math.random() * this.asteroidRate * 1.5));
    }
  };

  Game.prototype.start = function() {
    var g = this;
    var opacity = 1;
    if (musicOn) {
      this.music.play();
    };
    this.addStarterAsteroids(5);
    this.addStars(200);

    var fadeIn = setInterval(function() {
      var height = canvas.getAttribute("height");
      var width = canvas.getAttribute("width");
      g.draw(g.ctx);
      g.ctx.fillStyle = "rgba(0,0,0,"+opacity+")";
      g.ctx.fillRect(-width,-height, 2 * width, 2 * height);
      opacity -= 0.02;
    }, 20);

    setTimeout(function(){
      g.bindKeyHandlers();
      g.lastFrameTime = + new Date();
      g.step();
      clearInterval(fadeIn);
    }, 1000);
  };

  Game.prototype.endGame = function() {
    cancelAnimationFrame(this.animationFrame);
    this.unbindKeyHandlers();

    var g = this;
    var fadeOut = setInterval(function() {
      var height = canvas.getAttribute("height");
      var width = canvas.getAttribute("width");
      g.ctx.fillStyle = "rgba(0,0,0,0.1)";
      g.ctx.fillRect(-width,-height, 2 * width, 2 * height);
    }, 50);
    setTimeout(function(){
      clearInterval(fadeOut)
    }, 1500);

    $('#endPanel').show();
    $('.score').html(g.ship.size);
    $('#buttons').hide();
  };

  Game.prototype.pause = function() {
    this.isPaused = !this.isPaused;
    var g = this;
    setTimeout(function() {
      $('#pauseButton').html((g.isPaused) ? '<i class="fa fa-play"></i>' : '<i class="fa fa-pause"></i>');
      if (musicOn) {
        (g.isPaused) ? g.music.pause() : g.music.play();
      }
      (g.isPaused) ? $('#pausePanel').show() : $('#pausePanel').hide();
      }, 0);
  };

  Game.prototype.submitScore = function() {
    var submitScore = new XMLHttpRequest();
    var user = document.getElementById("user").value;
    var address = "./addScore?user=" + user +"&score=" + this.ship.size;
    submitScore.open("post", address, true);
    submitScore.send();
  };

})(this);




