"use strict";

exports.create = function (dependencies, options) {
    if(!dependencies || !dependencies.gameService || !dependencies.socketIo || !dependencies.Player || !dependencies.underscore) return null;
    if(!options || !options.port) return null;

    var Player = dependencies.Player;
    var gameService = dependencies.gameService;
    var socketIo = dependencies.socketIo;
    var _ = dependencies.underscore;
    var socket;
    var activeGames = [];

    function joinGame (game, playerRealName, socket) {
        console.log('player %j joined game %s', game, playerRealName);
        var player;
        var activeGame = activeGames[game.id];

        if (!activeGame) {
            activeGames[game.id] = game;
        }

        player = _.where(activeGame.players, {realName: playerRealName});
        if (!player) {
            player = Player.create(playerRealName);
            activeGame.players.push(player);
        }
        player.socket = socket;

        return activeGame;
    }

    function broadcastToGame(gameId, event, message) {
        var activeGame = activeGames[gameId];
        console.log('broadcasting message to players: ');
        _.each(activeGame.players, function (player) {
            console.log('\n%j\n', player);
            player.socket.emit(event, message);
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

                clientSocket.on('join game', function (data) {
                    console.log("[SERVER] a player joined the game: %j", data);

                    gameService.findGameWithId("game."+data.gameId, function (findResult) {
                        var player;
                        if (findResult.success) {
                            joinGame(findResult.game, data.playerName, clientSocket);
                            broadcastToGame(findResult.game.id,'joined game', { status: 200, success: true, game: findResult.game });
                        } else {
                            clientSocket.emit('joined game', { status: 404 ,success: false, message: 'could not find specified game'});
                        }
                    });
                });
            });
        }
    };
};