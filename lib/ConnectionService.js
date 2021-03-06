"use strict";

exports.create = function (dependencies, options) {
    if(!dependencies || !dependencies.gameService || !dependencies.socketIo || !dependencies.Player || !dependencies.underscore) {
        console.log('could not create connnection service, dependencies: %j', dependencies);
        return null;
    }
    if(!options || !options.port) return null;

    var Player = dependencies.Player;
    var gameService = dependencies.gameService;
    var socketIo = dependencies.socketIo;
    var _ = dependencies.underscore;
    var socket;
    var activeGames = {};

    function playerNames(activeGame) {
        var names = [];
        _.each(activeGame.players, function (player) {
            names.push({realName: player.realName, fictionalName: player.fictionalName});
        });
        console.log("[%s] player names: %j", activeGame.players.length, names);
        return names;
    }

    function getActiveGame(game){
        console.log("getting active game for game %j:", game);
        var active = activeGames[game.id];
        if (!active) {
            activeGames[game.id] = game;
            active = activeGames[game.id];
        }
        if(!active.players) {
            active.players = [];
        }
        console.log("found active game: %s", active);
        return active;
    }

    function removeDisconnectedPlayer (session) {
        if (session.activeGame) {
            session.activeGame.players = _.without(session.activeGame.players , session.player);
        }
    }

    function findPlayer (activeGame, realName) {
        return _.findWhere(activeGame.players, {realName: realName});
    }

    function joinGame (activeGame, realName, socket) {
        var player = findPlayer(activeGame, realName);
        if (!player){
            player = Player.create(realName, socket);
            activeGame.players.push(player);
        }
        player.socket = socket;
    }

    function broadcastToGame(activeGame, event, message, senderPlayerName) {
        console.log('broadcasting message to players: ');
        _.each(activeGame.players, function (player) {
            if(senderPlayerName != player.realName){
                player.socket.emit(event, message);
            }
        });
    }

    return {
        disconnect: function () {
            if (socket && socket.connected) { socket.disconnect(); }
        },
        listen: function () {
            socket = socketIo.listen(options.port);
            // socket.configure(function () {
            //     socket.set("transports", ["xhr-polling"]);
            //     socket.set("polling duration", 10);
            // });
            socket.on('connection', function (clientSocket) {
                var session = {};
                console.log('[SERVER] connection created');

                clientSocket.on('disconnect', function (data) {
                    console.log('[SERVER] client disconnected: %j', session.playerName);
                    removeDisconnectedPlayer(session);
                    broadcastToGame(session.activeGame, 'player disconnect', {playerRealName: session.playerName}, session.playerName);
                });

                clientSocket.on('change name', function (data) {
                    console.log('[SERVER] player assigned a name: %j', data);
                    var game = session.activeGame;
                    var player = findPlayer(game, data.realName);
                    if (player) {
                        player.fictionalName = data.newName;
                        broadcastToGame(game, 'name change', {realName: player.realName, fictionalName: player.fictionalName}, player.realName);
                    };
                });

                clientSocket.on('join game', function (data) {
                    console.log("[SERVER] a player joined the game: %j", data);
                    gameService.findGameWithId("game."+data.gameId, function (findResult) {
                        var activeGame;
                        if (findResult.success) {
                            activeGame = getActiveGame(findResult.game);
                            joinGame(activeGame, data.playerName, clientSocket);
                            clientSocket.emit('join success', { players: playerNames(activeGame)});
                            broadcastToGame(activeGame, 'new player', { players: playerNames(activeGame)}, data.playerName);
                            session.activeGame = activeGame;
                            session.playerName = data.playerName;
                        } else {
                            clientSocket.emit('join fail', { message: 'could not find specified game'});
                        }
                    });
                });
            });
        }
    };
};