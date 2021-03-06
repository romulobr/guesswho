"use strict";
var expect = require('expect.js'),
    sinon = require('sinon'),
    _ = require('underscore');

var GameService = require('../lib/GameService.js'),
    Game = require('../lib/Game.js');

describe('Game Service', function () {

    var fakeRedisClient = {};
    var dependencies = {redisClient: fakeRedisClient, Game: Game};
    var service = GameService.create(dependencies);

    it('is not created without dependencies', function () {
        dependencies = null;
        service = GameService.create(dependencies);
        expect(service).to.be(null);
    });

    it('is created properly', function () {
        dependencies = {redisClient: fakeRedisClient, Game: Game};
        service = GameService.create(dependencies);
        expect(service).to.be.an('object');
    });

    describe('when creating a game,', function (done) {
        var gameId = 'newGame';
        afterEach(function () {
            fakeRedisClient.exists.restore();
            fakeRedisClient.set.restore();
        });

        before( function (done) {
                fakeRedisClient.set = function (key, value, callback) {
                callback();
            };
            done();
        });

        describe('given an unique id,', function (done) {

            before(function (done) {
                fakeRedisClient.exists = function (key, callback) {
                    callback(null, 0);
                };
                done();
            });

            it('creates a game on redis', function (done) {
                fakeRedisClient.set = function (key, value, callback) {
                    callback('OK');
                };

                var redisSetSpy = sinon.spy(fakeRedisClient, 'set'),
                redisExistsSpy = sinon.spy(fakeRedisClient, 'exists'),
                game = Game.create('game.'+gameId),

                gameCreationCallback = function (result) {
                    expect(redisExistsSpy.calledWith('game.'+gameId)).to.be(true);
                    expect(redisSetSpy.calledWith('game.'+gameId, JSON.stringify(game))).to.be(true);
                    expect(result.status === 'OK');
                    done();
                };

                service.createGameWithId(gameId, gameCreationCallback);
            });
        });

        describe('given non unique id,', function (done) {

            before(function (done) {
                fakeRedisClient.exists = function (key, callback) {
                    if (key === 'game.newGame') {
                        callback(null, 1);
                    } else {
                        callback(null, 0);
                    }
                };
                fakeRedisClient.set = function (key, value, callback) {
                    callback('OK');
                };
                done();
            });

            it('creates a game on redis', function (done) {

                var redisSetSpy = sinon.spy(fakeRedisClient, 'set'),
                redisExistsSpy = sinon.spy(fakeRedisClient, 'exists'),
                game = Game.create('game.'+gameId+'1'),

                gameCreationCallback = function (result) {
                    expect(redisExistsSpy.calledWith('game.'+gameId)).to.be(true);
                    expect(redisSetSpy.calledWith('game.'+gameId+'1', JSON.stringify(game))).to.be(true);
                    expect(redisExistsSpy.calledWith('game.'+gameId+'1')).to.be(true);
                    expect(result.status === 'OK');
                    done();
                };

                service.createGameWithId(gameId, gameCreationCallback);
            });
        });


    });

    describe('given an existing game', function () {
        var existingGameKey = 'existingGame';
        before(function (done) {
            fakeRedisClient.set = function (key, value, callback) {
                callback('OK');
            };

            fakeRedisClient.exists = function (key, callback) {
                if (key === existingGameKey) {
                    callback(null, 1);
                } else {
                    callback(null, 0);
                }
            };

            fakeRedisClient.get = function (key, callback) {
                callback(null, JSON.stringify(Game.create(key)));
            };
            done();
        });

         it('finds a game by id', function (done) {
             service.findGameWithId(existingGameKey, function (result) {
                 expect(result.game.id).to.be(existingGameKey);
                 done();
            });
         });
    });

});