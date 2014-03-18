var fs = require('fs');
var http = require('http');
var path = require('path');

var url = require('url');
var redis = require('redis');

var client = redis.createClient(11021, "barreleye.redistogo.com", {
  auth_pass: process.env.REDIS_AUTH
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
    var newScore = parseFloat(parsedUrl.query.score.replace(' ', '+'));
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

  if (req.method === "GET" && parsedUrl.pathname ==='./getScores') {
    client.zrevrange("scores", 0, 500, 'WITHSCORES', function(err, scores) {
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

console.log('listening on 8192')
server.listen(8192);