(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Asteroid = Asteroids.Asteroid = function (pos, vel, angle, radius, coords) {
    Asteroids.MovingObject.call(this, pos, vel, angle, this.coordinates, this.radius, Asteroid.COLOR, Asteroid.START_ROTATION);
    this.rotationSpeed = Math.random() * 0.1 -0.05;
    this.radius = radius * 1.4; //bounding radius
    this.coordinates = coords;
  };
  
  Asteroid.inherits(Asteroids.MovingObject);

  Asteroid.COLOR = "white";
  Asteroid.START_ROTATION = 0;

  Asteroid.prototype.draw = function(ctx) {
    this.rotation += this.rotationSpeed;
    ctx.strokeStyle = this.color;
    ctx.save();
    Asteroids.MovingObject.prototype.transformRender.call(this, ctx);
    ctx.stroke();
    ctx.restore();
  };

  Asteroid.randomAsteroid = function(dimX, dimY) {
    var XSide = Math.floor(Math.random() * 2) * (dimX + 80) - 40;
    var YSide = Math.floor(Math.random() * 2) * (dimY + 80) - 40;
    var randomX = Math.floor(Math.random() * dimX);
    var randomY = Math.floor(Math.random() * dimX);
    startPosArray = [[XSide,randomY], [randomX, YSide]];

    var randomRadius = Math.floor(Math.random() * 60) + 30;
    var randomPos = startPosArray[Math.floor(Math.random() * 2)];
    var randomVec = (Math.random() * 100) + 25;
    var randomDir = (Math.random() * 2 * Math.PI)
    var randomCoords = Asteroid.generateCoords(randomRadius);
    return new Asteroid(randomPos, randomVec, randomDir, randomRadius, randomCoords);
  };

  Asteroid.generateCoords= function(radius) {
    var coordinates = [];
    var angles = new Array(_.random(7,14));
    for (i = 0; i < angles.length; i++ ) {
      angles[i] = (2 * Math.PI * i / angles.length + Math.random() * 0.2);
    };
    angles.sort();

    angles.forEach(function(ang){
      var x = radius * Math.cos(ang) * (0.6 + (Math.random() * 0.8));
      var y = radius * Math.sin(ang) * (0.6 + (Math.random() * 0.8));
      coordinates.push([x, y]);
    });
    return coordinates;
  };

  Asteroid.prototype.babyAsteroid = function() {
    if (this.radius > 30) {
      var newCoords = _.map(this.coordinates, function(coord) {
        return [coord[0]/2, coord[1]/2];
      });
      return new Asteroid(this.pos, this.vel, 2 * Math.PI * Math.random(), this.radius/4, newCoords);
    }
  }


})(this)