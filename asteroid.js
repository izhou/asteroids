(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Asteroid = Asteroids.Asteroid = function (pos, vel, angle, radius, coords, rotationSpeed) {
    Asteroids.MovingObject.call(this, pos, vel, angle, this.coordinates, this.radius, this.color, Asteroid.START_ROTATION);
    this.rotationSpeed = rotationSpeed;
    this.radius = radius * 1.5; //bounding radius
    this.coordinates = coords;
    this.area = Math.round(Asteroid.area(this.coordinates));
  };
  
  Asteroid.inherits(Asteroids.MovingObject);
  Asteroid.START_ROTATION = 0;

  Asteroid.prototype.draw = function(ctx, shipSize) {
    
    ctx.strokeStyle = (this.area < shipSize ? "purple" : "white");
    ctx.save();
    Asteroids.MovingObject.prototype.transformRender.call(this, ctx);
    ctx.stroke();
    ctx.restore();
  };

  Asteroid.prototype.move = function(elapsedSeconds, scale) {
    this.rotation += this.rotationSpeed;
    Asteroids.MovingObject.prototype.move.call(this, elapsedSeconds);
  };

  Asteroid.buildAsteroid = function(dimX, dimY, screenCenter, scale, difficulty) {
    var randomRadius = Math.floor(Math.random() * 80 + 40) * scale;
    var side = Math.floor(Math.random() * 4)
    var XSide = (Math.random() - 0.5) * 2 * dimX * scale;
    var YSide = (Math.random() - 0.5) * 2 * dimX * scale;
    var randomVec = ((Math.random() * 75) + 25) * scale * difficulty;
    var randomDir = (Math.random() * 2 * Math.PI)
    var randomCoords = Asteroid.generateCoords(randomRadius);
    var randomRotation = Math.random() * 0.02 - 0.01;
    return new Asteroid([XSide,YSide], randomVec, randomDir, randomRadius, randomCoords, randomRotation);
  };

  Asteroid.starterAsteroid = function(dimX, dimY, screenCenter, scale, difficulty) {
    var asteroid = Asteroid.buildAsteroid(dimX,dimY,screenCenter,scale,difficulty);
    if (Math.random() >= 0.5) { //50% chance of transforming centerX or centerY
      asteroid.centerX = (1 - (Math.random() * 0.5)) * dimX/2;
      if (Math.random() >= 0.5) {
        asteroid.centerX *= -1;
      }
    } else {
      asteroid.centerY = (1 - (Math.random() * 0.5)) * dimY/2;
      if (Math.random() >= 0.5) {
        asteroid.centerY *= -1;
      }
    }
    asteroid.pos = [asteroid.centerX,asteroid.centerY];
    return asteroid;
  }

  Asteroid.randomAsteroid = function(dimX, dimY, screenCenter, scale, difficulty) {
    var asteroid = Asteroid.buildAsteroid(dimX,dimY,screenCenter,scale,difficulty);
    if (Math.random() >= 0.5) { //50% chance of transforming centerX or centerY
      asteroid.centerX = -screenCenter[0] * scale - (asteroid.radius);
      if (Math.random() >= 0.5) {
        asteroid.centerX = (dimX - screenCenter[0]) * scale + (asteroid.radius);
      }
    } else {
      asteroid.centerY = -screenCenter[1] * scale - (asteroid.radius);
      if (Math.random() >= 0.5) {
        asteroid.centerY = (dimY - screenCenter[1]) * scale + (asteroid.radius);
      }
    }
    asteroid.pos = [asteroid.centerX,asteroid.centerY];
    return asteroid;
  }

  Asteroid.generateCoords= function(radius) {
    var coordinates = [];
    var angles = new Array(_.random(7,14));
    for (i = 0; i < angles.length; i++ ) {
      angles[i] = (2 * Math.PI * i / angles.length + Math.random() * 0.2);
    };
    angles.sort();

    angles.forEach(function(ang){
      var x = radius * Math.cos(ang) * (0.5 + (Math.random() * 1));
      var y = radius * Math.sin(ang) * (0.5 + (Math.random() * 1));
      coordinates.push([x, y]);
    });
    return coordinates;
  };

  Asteroid.prototype.fragmentAsteroid = function(bullet, shipSize) {
    var asteroid = this;
    var vert = this.transformedCoords();

    var numVert = vert.length;
    vert.push(vert[0]);

    var babies = [];
    var newFragment = [];

    var intersection = bullet.pos;
    var bulletSlope = Math.tan(bullet.angle);
    var bulletIntercept = intersection[1] - intersection[0] * bulletSlope;

    var foundIntersect = false;

    for (var i = numVert - 1, j = numVert; i >= 0; j = i--) { //walking through vertices
      edgeSlope = (vert[i][1] - vert[j][1]) / (vert[i][0] - vert[j][0]);
      edgeIntercept = (vert[i][0] * vert[j][1] - vert[j][0] * vert[i][1]) / (vert[i][0] - vert[j][0]);
      var xIntersect = (bulletIntercept - edgeIntercept)/(edgeSlope - bulletSlope);

      if ((xIntersect >= vert[i][0] && xIntersect <= vert[j][0]) ||
        (xIntersect <= vert[i][0] && xIntersect >= vert[j][0])) {  //this side intersects
        var intersect = [xIntersect, edgeSlope * xIntersect + edgeIntercept];

        if (foundIntersect) { //this means a fragment has been started. End the new fragment
          newFragment.push.apply(newFragment, vert.splice(j,1, intersect));
          newFragment.push(intersect);
          babies.push(newFragment);
          newFragment = [];
        } else {
          vert.splice(j,0, intersect, intersect); //two copies: one to be appended by vert, one for fragment
        }
        foundIntersect = !foundIntersect;
      }
      if (foundIntersect) {
        newFragment.push.apply(newFragment, vert.splice(j,1));
      }
    }
    babies.push(vert);
    return this.babyAsteroids(babies, shipSize);
  };

  Asteroid.prototype.babyAsteroids = function(fragments, shipSize) {
    var that = this;
    var fragArea = Asteroid.area(this.coordinates);
    var babies = [];

    fragments.forEach(function(fragment) {
      var area = Asteroid.area(fragment);
      var fragmentX = _.map(fragment, function(coord) { return coord[0]}).sort();
      var fragmentY = _.map(fragment, function(coord) { return coord[1]}).sort();

      var centerX = _.reduce(fragmentX, function(memo, num){ return memo + num; }, 0)/ fragment.length;
      var centerY = _.reduce(fragmentY, function(memo, num){ return memo + num; }, 0)/ fragment.length;

      fragment = _.map(fragment, function(coord) {
        return [coord[0] - centerX, coord[1] - centerY];
      })

      var xSpan = Math.abs(_.last(fragmentX) - fragmentX[0]);
      var ySpan = Math.abs(_.last(fragmentY) - fragmentY[0]);

      var radius = Math.max(xSpan, ySpan);
      var angle = Math.atan2((centerY - that.centerY), (centerX - that.centerX));// + that.angle;
      var vel = ((area < shipSize) ? that.vel * 0.2 : that.vel);

      babies.push(new Asteroid([centerX, centerY], vel, angle, radius, fragment, that.rotationSpeed / 2));
    });
    return babies;
  };

  Asteroid.area = function(coordinates) {
    area = 0;
    for (var i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
      area += coordinates[i][0] * coordinates[j][1] - coordinates[i][1] * coordinates[j][0];
    }
    return Math.abs(area / 2);
  };


})(this)