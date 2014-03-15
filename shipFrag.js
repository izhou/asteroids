(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var shipFrag = Asteroids.shipFrag = function(shipPos, shipAngle, radius, coordinates, pos, scale, shipVel) {
    this.shipPos = shipPos;
    this.shipAngle = shipAngle;
    this.shipVel = shipVel;
    this.pos = pos;//CENTROID THAT NEEDS TO BE RECALCULATED
    this.scale = scale;
    this.vel = 30 * (Math.random() * 0.9 + 0.1) * scale;
    this.angle =  Math.random() * Math.PI - Math.PI/2 + Math.atan2(( pos[1] - shipPos[1]), (pos[0]- shipPos[0])); //CALC BASED ON CENTROID RELATIVE TO INIT SHIP POS
    this.coordinates = coordinates;//GENERALLY A TRIANGLE
    this.radius = radius; //SHOULD BE RETURNED AS 1/2 THE PRIOR
    this.rotation = shipAngle;

    Asteroids.MovingObject.call(this, this.pos, this.vel, this.angle, this.coordinates, this.radius, shipFrag.COLOR, this.rotation);
    this.rotationSpeed = Math.random() * 0.06 - 0.03;
  };
  shipFrag.COLOR = "#ADFF2F";
  shipFrag.inherits(Asteroids.MovingObject);

  shipFrag.prototype.move = function(elapsedSeconds) {
    this.centerX += Math.cos(this.shipAngle) * this.shipVel * elapsedSeconds / 10;
    this.centerY += Math.sin(this.shipAngle) * this.shipVel * elapsedSeconds / 10;

    Asteroids.MovingObject.prototype.move.call(this, elapsedSeconds);
  }

  shipFrag.prototype.shatter = function() {
    var f = this;
    var fragments = [];
    var newCoords = [];
    var centerTriangle = [];
    this.coordinates.forEach(function(coord, index, array) {
      var shatterCoord = [];
      _.without(array, coord).forEach(function(oppCoord) {
        shatterCoord.push([(coord[0] + oppCoord[0])/2, (coord[1] + oppCoord[1])/2]);
      })
      centerTriangle.push(_.reduce(_.without(array, coord), function(memo, oppCoord) {
        return [memo[0] + oppCoord[0]/2, memo[1] + oppCoord[1]/2];
      }, [0,0]));
      shatterCoord.push(coord);
      newCoords.push(shatterCoord);
    });
    newCoords.push(centerTriangle);
    newCoords.forEach(function(transCoord) {
      var coordSum = _.reduce(transCoord, function(mem, coord) {
        return [mem[0] + Math.floor(coord[0]), mem[1] + Math.floor(coord[1])];
        }, [0,0]);
      var centroid = [0.625 * ((coordSum[0] > 0) ? 1 : -1), coordSum[1] / 3];
      var coords = _.map(transCoord, function(coord) {
        return [(coord[0] + centroid[0]), (coord[1] - centroid[1])];
      });
      var cosRotation = Math.cos(f.rotation);
      var sinRotation = Math.sin(f.rotation);
      var newPos = [f.pos[0] - centroid[0] * cosRotation + centroid[1] * sinRotation, f.pos[1] - centroid[1] * cosRotation - centroid[0] * sinRotation]
      fragments.push(new shipFrag(f.shipPos, f.rotation, f.radius /2, coords, newPos, f.scale, f.shipVel));
    });
    return fragments;
  }
})(this);
