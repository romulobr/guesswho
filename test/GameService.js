"use strict";
var expect = require('expect.js'),
    sinon = require('sinon');

var GameService = require('../lib/GameService.js'),
    Game = require('../lib/Game.js'),
    fakeRedisClient= {};

describe('Game Service', function () {

    it('is not created without dependencies', function () {
        var dependencies = null;
        var service = GameService.create(dependencies);
        expect(service).to.be(null);
    });

    it('is created with dependencies', function () {
        var dependencies = {redisClient: fakeRedisClient, Game: Game};
        var service = GameService.create(dependencies);
        expect(service).to.be.an('object');
    });

    it('creates a game on redis given an unique id', function (done) {

        fakeRedisClient.set = function (key, value, callback) {
            callback();
        };
        var spy = sinon.spy(fakeRedisClient, 'set');
        var dependencies = {redisClient: fakeRedisClient, Game: Game},
        service = GameService.create(dependencies),
        gameId = 'newGame',
        game = Game.create(gameId),
        callback = function () {
            expect(spy.calledWith('game.'+gameId, JSON.stringify(game))).to.be(true);
            done();
        };

        service.createGameWithId(gameId, callback);
    });

    it('adds player to a game on redis', function (done) {

        fakeRedisClient.set = function (key, value, callback) {
            callback();
        };
        var spy = sinon.spy(fakeRedisClient, 'set');
        var dependencies = {redisClient: fakeRedisClient, Game: Game},
        service = GameService.create(dependencies),
        gameId = 'newGame',
        game = Game.create(gameId),
        callback = function () {
            expect(spy.calledWith('game.'+gameId, JSON.stringify(game))).to.be(true);
            done();
        };

        service.createGameWithId(gameId, callback);
    });
});