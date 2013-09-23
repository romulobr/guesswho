"use strict";
var express = require('express'),
    redis = require('redis'),
    socketIo = require('socket.io'),
    _ = require('underscore'),
    Game = require('./lib/Game'),
    Player = require('./lib/Player'),
    GameService = require('./lib/GameService'),
    ConnectionService = require('./lib/ConnectionService'),
    port = 7001,
    app = express(),
    allowCrossDomain = function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    },
    redisClient = redis.createClient(),
    gameService = GameService.create({redisClient: redisClient, Game: Game}),
    connectionServiceDependencies = {gameService:gameService, Player: Player, socketIo: socketIo, underscore: _},
    connectionService = ConnectionService.create(connectionServiceDependencies, {port:port});

    connectionService.listen();

app.use("/", express.static(__dirname + '/public'));
app.use(express.logger());
app.use(express.bodyParser());

app.configure(function () {
    app.use(allowCrossDomain);
});

app.post('/game', function (req, res) {
  console.log("%j", req.body);
  gameService.createGameWithId(req.body.gameName, function (response) {
      res.json({status:response.status});
  });
});

app.listen(3000);
console.log('%j\n', app.routes);
