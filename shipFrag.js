(function(root) {
  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var shipFrag = Asteroids.shipFrag = function(pos, radius, angle, startPoint, transCoords) {
    var that = this;
    this.pos = pos;
    this.startPoint = startPoint;
    this.radius = radius / 2;
    console.log(this.radius);
    this.transCoords = transCoords || shipFrag.COORDS;
    this.coordinates =_.map(this.transCoords, function(coord) {
      return [coord[0] * radius, coord[1] * radius];
    })
    this.vel = 2;
    this.angle = angle;
    this.rotation = angle;

    Asteroids.MovingObject.call(this, this.pos, this.vel, this.angle, this.coordinates, this.radius , shipFrag.COLOR, this.rotation);
  };


  shipFrag.COLOR = "#ADFF2F";
  shipFrag.COORDS = [[-1.25,0],[1.25,1],[1.25,-1]];

  shipFrag.inherits(Asteroids.MovingObject);

  shipFrag.prototype.fragment = function() {
    fragments = [];
    // fragments.push(new shipFrag(this.pos, this.radius, this.angle, this.startPoint, [[1.25,-1],[1.25,0],[0,-0.5]]));
    fragments.push(new shipFrag(this.pos, this.radius, this.angle, this.startPoint, [[0,-0.5], [1.25,0], [0,0.5]]));
    // fragments.push(new shipFrag(this.pos, this.radius, this.angle, this.startPoint, [[1.25,0], [0,0.5], [1.25,1]]));
    // fragments.push(new shipFrag(this.pos, this.radius, this.angle, this.startPoint, [[0,-0.5], [0,0.5], [-1.25,0]]));
    console.log(fragments);
    return fragments;

  };



})(this)
