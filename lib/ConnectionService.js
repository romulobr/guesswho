"use strict";

exports.create = function (dependencies, options) {
    if(!dependencies || !dependencies.gameService || !dependencies.socketIo || !dependencies.Player || !dependencies.underscore) return null;
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

    function joinGame (activeGame, playerRealName, socket) {
        var player;
        console.log("Active game: %s", activeGame.id);

        player = _.where(activeGame.players, {realName: playerRealName});
        if (player.length === 0) {
            player = Player.create(playerRealName);
            activeGame.players.push(player);
        } else {
            player = player[0];
        }
        console.log('players in active game %s', activeGame.players.length);
        player.socket = socket;
        console.log('active games: %j', _.keys(activeGames));
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
            socket.on('connection', function (clientSocket) {
                console.log('[SERVER] connection created');
                clientSocket.on('disconnect', function (data) {
                    console.log('[SERVER] client disconnected');
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

                        } else {
                            clientSocket.emit('join fail', { message: 'could not find specified game'});
                        }
                    });
                });
            });
        }
    };
};