(function(root) {

  var Asteroids = root.Asteroids = (root.Asteroids || {});
 
  var Scoreboard = Asteroids.Scoreboard = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "./getScores", true);
    xhr.send();
    this.scores = this.fetchScores();
    this.currentPage = 0;
    this.numPages = Math.ceil(this.scores.length/ (2 * Scoreboard.PAGE_SIZE));
    
  };

  Scoreboard.PAGE_SIZE = 7;

  Scoreboard.prototype.addScore = function(score) {
    $('#submitScorePanel').hide();
    $('#HighScorePanel').show();
    var s = this;
    var user = document.getElementById("user").value;
    var submitScore = new XMLHttpRequest();
    var address = "./addScore?user=" + user +"&score=" + game.ship.size;
    submitScore.open("post", address, true);
    submitScore.send();
    submitScore.onreadystatechange=function() {
      if (submitScore.readyState == 4 && submitScore.status == 200) {
        s.scores = s.fetchScores();
        s.numPages = Math.ceil(s.scores.length/ (2 * Scoreboard.PAGE_SIZE));

        s.currentPage = s.findPageFor(user);
        s.showScores();
      }
    }
  };

  Scoreboard.prototype.fetchScores = function() {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "./getScores", false);
    xhr.send();
    return JSON.parse(xhr.responseText);
  }

  Scoreboard.prototype.nextPage = function(){
    this.currentPage += 1;
    this.showScores();
  };

  Scoreboard.prototype.prevPage = function() {
    this.currentPage -= 1;
    this.showScores();
  };

  Scoreboard.prototype.findPageFor = function(user) {
    var userRank = _.indexOf(this.scores, user) / 2;
    return Math.floor(userRank / Scoreboard.PAGE_SIZE);
  };

  Scoreboard.prototype.showScores = function() {
    var minRank = this.currentPage * Scoreboard.PAGE_SIZE;
    $('#highScores').html(this.createScoresTable(minRank));
    (this.currentPage < this.numPages - 1) ? $('#fwdButton').show() : $('#fwdButton').hide();
    (this.currentPage > 0) ? $('#backButton').show() : $('#backButton').hide();
  }

  Scoreboard.prototype.createScoresTable = function(minRank) {
    var scoresToShow = this.scores.slice(minRank * 2, (minRank + Scoreboard.PAGE_SIZE ) * 2);
    var scoresLength = scoresToShow.length / 2;
    var table = '<table id = highScoresTable>'
    for (var i = 0; i < scoresLength; i++) {
      var row = '<tr>';
      row += '<td style="text-align:left; width:30px">'+ (minRank + i + 1) +')</td>' 
      row += '<td style="text-align:left; width:170px;">' + scoresToShow.shift() + '</td>';
      row += '<td style = "text-align: right; width:250px">' + scoresToShow.shift() + '</td>';
      row += '</tr>'
      table += row;
    }
    table += '</table>';
    return table;
  }


})(this);
