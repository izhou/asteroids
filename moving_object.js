(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var MovingObject = Asteroids.MovingObject = function (pos, vel, angle, coords, radius, color, rotation) {
    this.pos = pos;
    this.vel = vel;
    this.angle = angle;
    this.coordinates = coords;
    this.radius = radius;
    this.color = color;
    this.rotation = rotation;
    this.centerX = this.pos[0];
    this.centerY = this.pos[1];
  };

  MovingObject.prototype.move = function(vel, angle) {
    this.centerX += Math.cos(angle) * vel;
    this.centerY += Math.sin(angle) * vel;
    this.pos = [this.centerX, this.centerY];
  };

  MovingObject.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.save();
    this.transformRender(ctx);
    ctx.fill();
    ctx.restore();
  };

  MovingObject.prototype.transformRender = function(ctx) {
    ctx.translate(this.centerX, this.centerY)
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.moveTo(this.coordinates[0][0], this.coordinates[0][1]);
    for (var i = 1; i < this.coordinates.length; i++) {
      ctx.lineTo( this.coordinates[i][0], this.coordinates[i][1]);
    };
    ctx.closePath();
  }

  MovingObject.prototype.isCollidedWith = function(otherObject) {
    if (this.isInBounds(otherObject)) {
      var obj = this;
      var coords = this.transformedCoords();
      var poly = otherObject.transformedCoords();
      return MovingObject.isWithin(coords, poly);
    } else {
      return false;
    }
  };

  MovingObject.prototype.isInBounds = function(otherObject) {
    var xDistance = this.centerX - otherObject.centerX;
    var yDistance = this.centerY - otherObject.centerY;
    var distance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 0.5);
    return (this.radius + otherObject.radius > distance)//detect whether bounding circles of polygons collide
  };

  MovingObject.prototype.transformedCoords = function() {
    var that = this;
    var cosRotation = Math.cos(this.rotation);
    var sinRotation = Math.sin(this.rotation);
    return _.map(this.coordinates, function(coord) {
      var newX = coord[0] * cosRotation - coord[1] * sinRotation + that.centerX;
      var newY = coord[0] * sinRotation + coord[1] * cosRotation + that.centerY;
      return [newX, newY];
    });
  };

  MovingObject.isWithin = function(coords, poly) { //point-in-polygon algorithm
    var numVert = poly.length;
    return coords.some(function(coord) {
      var within = false;
      for (var i = 0, j = numVert - 1; i < numVert; j = i++) {
        if ( ((poly[i][1] > coord[1]) != (poly[j][1] > coord[1])) &&
          (coord[0] < (poly[j][0] - poly[i][0]) * (coord[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]))
          within = !within;
      }
      return within;
    });
  };




})(this)