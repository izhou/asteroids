var fs = require('fs');
var http = require('http');
var path = require('path');

var url = require('url');
var redis = require('redis');


// var client = redis.createClient(6379, "asteroidsdamacy.suhesb.0001.usw2.cache.amazonaws.com");
var client = redis.createClient(11021, "barreleye.redistogo.com", {
  auth_pass: '5da6e19474dd21b8a4cf681f79a3d915'
});

client.on('error', function(err) {
  console.log("Error" + err);
})

var server = http.createServer(function(req, res) {
  var filePath = '.' + req.url;
  var parsedUrl = url.parse(filePath, true);
  
  if (filePath === "./") {
    filePath = './index.html';
  }

  if (req.method === "POST" && parsedUrl.pathname === "./addScore") {
    var newScore = parseInt(parsedUrl.query.score);
    var user = parsedUrl.query.user;
    client.zscore("scores", user, function(err, oldScore) {
      if (err) {
        res.writeHead(500);
      } else {
        if (!oldScore || oldScore < newScore) {
          client.zadd("scores", newScore, user, function(err) {
            if (err) {
              res.writeHead(500);
            } else {
              res.writeHead(200);
            }
          });
        }
      }
      res.end();
    });
    return;
  };

  if (req.method === "GET" && parsedUrl.pathname === "./clear") {
    client.flushall(function(err) {
      if (err) {
        res.writeHead(500);
      } else {
        res.writeHead(200);
      }
      res.end();
    })
    return;
  };

  if (req.method === "GET" && parsedUrl.pathname ==='./scores') {
    var NUM_SCORES = 5;
    console.log(parsedUrl);

    var returnPage = function(page) {
      var min = page * NUM_SCORES;
      client.zrevrange("scores", min, min + NUM_SCORES, 'WITHSCORES', function(err, scores) {
        if (err) {
          res.writeHead(500);
        } else {
          res.writeHead(200);
          scores.splice(0,0,min); //add minimum rank
          console.log(scores); 
          res.write(JSON.stringify(scores));
          res.end();
        }
      });
    }

    var user = parsedUrl.query.user;
    var page = parsedUrl.query.page;

    if (user) {
      console.log(user);
      client.zrevrank("scores", user, function(err, rank) {
        if (err) {
          res.writeHead(500);
          res.end();
          return;
        } else {
          console.log(rank);
          console.log("pageIs"+Math.floor(rank / NUM_SCORES))
          returnPage(Math.floor(rank / NUM_SCORES))
        }
      })
      return;
    };

    if (page) {
      returnPage(page);
      return;
    }

    returnPage(0);
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname ==='./getScores') {
    client.zrevrange("scores", 0, 500, 'WITHSCORES', function(err, scores) {
      if (err) {
        res.writeHead(500);
      } else {
        res.writeHead(200);
        console.log(JSON.stringify(scores));
        res.write(JSON.stringify(scores));
      }
      res.end();
    });
    return;
  }

  if (req.method === "GET" && parsedUrl.pathname ==='./seeScores') {
    client.zrevrange("scores", 0, -1, 'WITHSCORES', function(err, scores) {
      if (err) {
        res.writeHead(500);
      } else {
        res.writeHead(200);
        res.write(JSON.stringify(scores));
      }
      res.end();
    });
    return;
  }

  var fileExt = path.extname(filePath);
  var contentType = 'text/html';
  switch(fileExt) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.wav':
      contentType = 'audio/wav';
      break;
    case '.mp3':
      contentType = 'audio/mp3';
      break;
  }

  fs.exists(filePath, function(exists) {
    if (exists) {
      fs.readFile(filePath, function(err, content) {
        if (err) {
          res.writeHead(404);
          res.end(JSON.stringify(err));
        } else {
          res.writeHead(200, {'Content-Type': contentType});
          res.end(content, 'utf8');
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  })
});

server.listen(8192);