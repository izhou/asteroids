(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Star = Asteroids.Star = function(pos, scale) {
    Asteroids.MovingObject.call(this, pos, this.vel, this.angle, 0, this.coords, this.radius, this.color, this.rotation);
    this.pos = pos;
    this.vel = Math.random() * 0.0002 + 0.0005;
    this.angle = 0;
    this.coordinates = _.map(Star.COORDS, function(coord) {
      var size = Math.random() * 0.75 + 0.5;
      return [coord[0] * scale * size, coord[1] * scale * size];
    })
    this.radius = 1;
    this.color = "white";
    this.rotation = 0;
    this.centerX = this.pos[0];
    this.centerY = this.pos[1];
  };

  Star.COORDS = [[-1,1],[-1,-1],[1,-1],[1,1]];

  Star.inherits(Asteroids.MovingObject);

  Star.prototype.zoomMove = function(elapsedSeconds, shipPos, shipVel) {
    this.centerX -= (shipPos[0] - this.centerX) * this.vel + shipVel[0] * 0.001;
    this.centerY -= (shipPos[1] - this.centerY) * this.vel + + shipVel[1] * 0.001;
    this.pos = [this.centerX, this.centerY];
  };

  Star.randomStar = function(dimX, dimY, scale) {
    var x = (Math.random() - 0.5) * dimX * 1.75 * scale;
    var y = (Math.random() - 0.5) * dimY * 1.75 * scale;
    return new Star([x,y], scale)
  };
})(this)