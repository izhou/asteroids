(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(ship, game) {
    this.ship = ship;
    var shipFront = ship.transformedCoords()[0];
    this.game = game;
    Asteroids.MovingObject.call(this, shipFront, Bullet.VEL, ship.angle, Bullet.COORDS, Bullet.RADIUS, Bullet.COLOR, ship.angle);
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.VEL = -500;
  Bullet.COORDS = [[-1,-1],[-1,1],[6,1],[6,-1]];
  Bullet.RADIUS = 6;
  Bullet.COLOR = "red";

  Bullet.fireBullet = function(game) {
    return new Bullet(game.ship, game)
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