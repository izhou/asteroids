(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(ship, game, scale) {
    this.ship = ship;
    var shipFront = ship.transformedCoords()[0];
    this.game = game;
    this.coordinates = _.map(Bullet.COORDS, function(coord) {
      return [coord[0] * scale, coord[1] * scale];
    })
    this.vel = Bullet.VEL * scale;
    Asteroids.MovingObject.call(this, shipFront, this.vel, ship.angle, this.coordinates, Bullet.RADIUS, Bullet.COLOR, ship.angle);
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.VEL = -500;
  Bullet.COORDS = [[-3,-1],[-3,1],[3,1],[3,-1]];
  Bullet.RADIUS = 6;
  Bullet.COLOR = "red";

  Bullet.fireBullet = function(game, scale) {
    if (!game.ship.isDead) {
      return new Bullet(game.ship, game, scale);  
    }
  }

  Bullet.prototype.isCollidedWith = function(otherObject) {
    if (this.isInBounds(otherObject)) {
      var poly = otherObject.transformedCoords();
      return Asteroids.MovingObject.isWithin([this.pos], poly);
    } else {
      return false;
    }
  };

})(this)