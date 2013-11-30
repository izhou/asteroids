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

    var xDistance = this.centerX - otherObject.centerX;
    var yDistance = this.centerY - otherObject.centerY;

    var distance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 0.5);

    if (this.radius + otherObject.radius < distance) { //detect whether bounding circles of polygons collide
      
      return false;
    } else {  //detect whether coordinates of object fall within other polygon 
      return this.isWithin(otherObject);
      

    }
  };

  MovingObject.prototype.isWithin = function(otherObject) { //point-in-polygon algorithm
    var that = this;

    var rotatedCoord = function(coord, obj) {
      var newX = coord[0] * Math.cos(obj.rotation) - coord[1] * Math.sin(obj.rotation) + obj.centerX;
      var newY = coord[0] * Math.sin(obj.rotation) + coord[1] * Math.cos(obj.rotation) + obj.centerY;
      return [newX, newY];
    }

    var coordinates = _.map(this.coordinates, function(coord){
      return rotatedCoord(coord, that) ;
    });

    var vert = _.map(otherObject.coordinates, function(coord){
      return rotatedCoord(coord, otherObject);
    });

    var numVert = vert.length;
    return coordinates.some(function(coord) {
      var within = false;
      for (var i = 0, j = numVert - 1; i < numVert; j = i++) {
        if ( ((vert[i][1] > coord[1]) != (vert[j][1] > coord[1])) &&
          (coord[0] < (vert[j][0] - vert[i][0]) * (coord[1] - vert[i][1]) / (vert[j][1] - vert[i][1]) + vert[i][0]))
          within = !within;
      }
      return within;
    });
  };

})(this)