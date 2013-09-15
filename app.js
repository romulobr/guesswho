"use strict";
var express = require('express'),
    redis = require('redis'),
    Game = require('./lib/Game'),
    GameService = require('./lib/GameService'),
    app = express(),
    allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    },
    redisClient = redis.createClient(),
    gameService = GameService.create({redisClient: redisClient, Game: Game});

app.use("/", express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());
app.configure(function () {
    app.use(allowCrossDomain);
});

app.post('/game', function (req, res) {
  console.log("%j", req.body);
  gameService.createGameWithId(req.body.gameName, function () {
    res.json({success : true});
  });
});

// app.get('/game', function (req, res) {
//   var response = {success : true};
//   console.log("%j", req.body);
//   gameService.findGameById(req.body.gameName, function () {
//     res.json(response);
//   });
// });

app.listen(3000);
console.log('Listening on port 3000\n routes supported:');
console.log('%j\n', app.routes);
