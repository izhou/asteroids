(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function (pos, scale, radius, size) {
    Asteroids.MovingObject.call(this, pos, Ship.START_VEL, this.angle, Ship.COORDS, this.radius, Ship.COLOR, Ship.START_ROTATION);
    var that = this;
    this.pos = pos;
    this.angle = Ship.START_ANGLE;
    this.angle_vel = 0;
    this.scale = scale || 1;
    this.radius = radius || Ship.RADIUS;
    this.size = size || 250;
    this.maxVel = function() {
      return that.scale * -500;
    }

    this.coordinates = _.map(Ship.COORDS, function(coord) {
      return [coord[0] * that.radius, coord[1] * that.radius];
    })
    this.isGhost = false;
    this.isShattered = false;
  };

  Ship.inherits(Asteroids.MovingObject);

  Ship.START_VEL = 0;
  Ship.START_ANGLE = Math.PI/2;
  Ship.START_ROTATION = Ship.START_ANGLE; //rotation angle is same as direction
  Ship.COLOR = "#ADFF2F";
  Ship.RADIUS = 10;
  Ship.COORDS = [[-1.25,0],[1.25,1],[1.25,-1]];
  
  Ship.MAX_ANGLE_VEL = Math.PI;

  Ship.buildShip = function(pos, scale, radius, size) {
    return new Ship(pos, scale, radius, size);
  }

  Ship.prototype.move = function(elapsedSeconds) {
    this.angle += this.angle_vel;
    this.rotation = this.angle;
    this.angle_vel *= 0.95;
    if (this.vel >= 0) {
      this.vel *= 0.94;
    } else {
      this.vel *= 0.996;
    }

    Asteroids.MovingObject.prototype.move.call(this, elapsedSeconds);
  };

  Ship.prototype.power = function(impulse) {
    var maxVel = this.maxVel();
    this.vel -= impulse * 600 * this.scale;
    if (this.vel < maxVel * this.scale) {
      this.vel = maxVel * this.scale;
    } else if (this.vel > -maxVel * this.scale) {
      this.vel = -maxVel * this.scale;
    }
    // console.log(maxVel);
    // console.log(this.vel);
  }

  Ship.prototype.fragment = function(scale) {
    var shipFragment = new Asteroids.shipFrag(this.pos, this.angle, this.radius, this.coordinates, this.pos, this.scale, this.vel);
    // console.log(shipFragment);
    return shipFragment.shatter();
  }

  Ship.prototype.rotate = function(direction) {
    this.angle_vel += direction * 0.22;
  };

  Ship.prototype.resize = function(area) {
    this.size += Math.floor(area);
    this.radius = Math.sqrt(0.4 * this.size);
    var that = this;
    this.coordinates = _.map(Ship.COORDS, function(coord) {
      return [coord[0] * that.radius, coord[1] * that.radius];
    });
  }

  Ship.prototype.grow = function() {
    var that = this;
    this.coordinates = _.map(Ship.COORDS, function(coord) {
      return [coord[0] * that.radius, coord[1] * that.radius];
    });
  };

  Ship.prototype.ghost = function() {
    var s = this;
    this.isGhost = true;
    this.color = 'rgba(173, 255, 47, 0.3)';
    blinkCount = 1;
    setTimeout(function() {
      var blink = setInterval(function() {
        if (blinkCount % 2 === 1) {
          s.color = 'rgba(173, 255, 47, 0.3)';
        } else {
          s.color = 'rgba(173, 255, 47, 1)';
        }
        blinkCount += 1;
        if (blinkCount > 30) {
          s.isGhost = false;
          clearInterval(blink);
        }
      }, 30);
    }, 1500);
  }

  // Ship.prototype.fragments = function(pos, angle) {

  // }

})(this)