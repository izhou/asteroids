(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Ship = Asteroids.Ship = function (pos) {
    Asteroids.MovingObject.call(this, pos, Ship.START_VEL, Ship.START_ANGLE, Ship.COORDS, Ship.RADIUS, Ship.COLOR, Ship.START_ROTATION);
    var that = this;
    this.angle_vel = 0;
    this.coordinates = [[-15,0],[10,10],[10,-10]];
    this.scale = 1;
  };

  Ship.inherits(Asteroids.MovingObject);

  Ship.START_VEL = 0;
  Ship.START_ANGLE = Math.PI/2;
  Ship.START_ROTATION = Ship.START_ANGLE; //rotation angle is same as direction
  Ship.COLOR = "#ADFF2F";
  Ship.RADIUS = 10;
  Ship.COORDS = [[-1.5,0],[1,1],[1,-1]];
  Ship.MAX_VEL = -5;
  Ship.MAX_ANGLE_VEL = Math.PI;

  Ship.buildShip = function(pos) {
    return new Ship(pos);
  }

  Ship.prototype.move = function() {
    this.angle += this.angle_vel;
    this.rotation = this.angle;
    this.angle_vel = this.angle_vel*0.95;
    this.centerX += Math.cos(this.angle) * this.vel;
    this.centerY += Math.sin(this.angle) * this.vel;
    this.pos = [this.centerX, this.centerY];

  };

  Ship.prototype.power = function(impulse) {
    this.vel -= impulse * 4 * this.scale;
    if (this.vel < Ship.MAX_VEL * this.scale) {
      this.vel = Ship.MAX_VEL * this.scale;
    } else if (this.vel > 0) {
      this.vel = 0;
    }
  }

  Ship.prototype.rotate = function(direction) {
    this.angle_vel += direction * 0.2;
  };

  Ship.prototype.grow = function() {
    var that = this;
    this.coordinates = _.map(Ship.COORDS, function(coord) {
      return [coord[0] * that.radius, coord[1] * that.radius];
    });
  };

})(this)