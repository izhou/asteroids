(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});

  var Bullet = Asteroids.Bullet = function(ship, game) {
    this.ship = ship;
    this.game = game;
    Asteroids.MovingObject.call(this, ship.pos, Bullet.VEL, ship.angle, Bullet.COORDS, Bullet.RADIUS, Bullet.COLOR, 0);
  }

  Bullet.inherits(Asteroids.MovingObject);

  Bullet.VEL = -500;
  Bullet.COORDS = [[-2,-2],[-2,2],[2,2],[2,-2]];
  Bullet.RADIUS = 2;
  Bullet.COLOR = "#FF4C30";

  Bullet.fireBullet = function(game) {
    return new Bullet(game.ship, game)
  }

  Bullet.prototype.hitAsteroids = function() {
    for (var i = this.game.asteroids.length - 1; i >= 0; i--) {
      if (this.isCollidedWith(this.game.asteroids[i])) {
        aster = this.game.asteroids.splice(i,1)[0];
        // Asteroids.makeBabies(aster);
        return true;
      }
    }
  }

})(this)