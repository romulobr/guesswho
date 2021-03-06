"use strict";
var expect = require('expect.js'),
    sinon = require('sinon'),
    _ = require('underscore'),
    socketIo = require('socket.io'),
    socketIoClient = require('socket.io-client');

var ConnectionService = require('../lib/ConnectionService.js');
var Game = require('../lib/Game.js');
var Player = require('../lib/Player.js');

describe('Socket.io connection service', function () {
    var existingGameKey = 'someGameKey';
    var defaultPort = 7033;
    var serverUrl = 'http://localhost'+":"+defaultPort;
    var playerName = 'regular name';
    var gameService;
    var dependencies;
    var service;
    var options;

    beforeEach(function () {
        options = {port: defaultPort};
        gameService = { findGameWithId: function (id, callback) {
            callback({success:true, game: Game.create(existingGameKey)});
        }};
        dependencies = {gameService: gameService, socketIo: socketIo, Player: Player, underscore:_};
    });

    it('is not created without dependencies', function () {
        service = ConnectionService.create(null, options);
        expect(service).to.be(null);
    });

    it('is not created without options', function () {
        service = ConnectionService.create(dependencies, null);
        expect(service).to.be(null);
    });

    it('is created properly', function () {
        service = ConnectionService.create(dependencies, options);
        expect(service).to.be.an('object');
    });

    describe('when active,', function () {
        var clientSocket;
        before(function () {
            dependencies = {gameService: gameService, socketIo: socketIo, Player: Player, underscore:_};
            service = ConnectionService.create(dependencies, options);
            service.listen();
        });
        afterEach(function () {
            if (clientSocket) { clientSocket.disconnect();}
        });


        it('allows player to join a game', function (done) {
            var socket = socketIoClient.connect(serverUrl);

            socket.on('join success', function (data) {
                done();
            });
            socket.on('connect', function () {
                console.log('[CLIENT] connected');
                socket.emit('join game',{ gameId:existingGameKey, playerName:playerName });
            });
        });
    });
});