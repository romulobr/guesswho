"use strict";
var expect = require('expect.js'),
    sinon = require('sinon');

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
                    callback('0');
                };
                done();
            });

            it('creates a game on redis', function (done) {
                fakeRedisClient.set = function (key, value, callback) {
                    //console.log('calling redis with key: %s', key);
                    callback();
                };

                var redisSetSpy = sinon.spy(fakeRedisClient, 'set'),
                redisExistsSpy = sinon.spy(fakeRedisClient, 'exists'),
                game = Game.create('game.'+gameId),

                gameCreationCallback = function () {
                    expect(redisExistsSpy.calledWith('game.'+gameId)).to.be(true);
                    expect(redisSetSpy.calledWith('game.'+gameId, JSON.stringify(game))).to.be(true);
                    done();
                };

                service.createGameWithId(gameId, gameCreationCallback);
            });
        });

        describe('given non unique id,', function (done) {

            before(function (done) {
                fakeRedisClient.exists = function (key, callback) {
                    //console.log('verifying existence of key: %s', key);
                    if (key === 'game.newGame') {
                        callback('1');
                    } else {
                        callback('0');
                    }
                };
                done();
            });

            it('creates a game on redis', function (done) {
                fakeRedisClient.set = function (key, value, callback) {
                    //console.log('calling redis with key: %s', key);
                    callback();
                };

                var redisSetSpy = sinon.spy(fakeRedisClient, 'set'),
                redisExistsSpy = sinon.spy(fakeRedisClient, 'exists'),
                game = Game.create('game.'+gameId+'1'),

                gameCreationCallback = function () {
                    expect(redisExistsSpy.calledWith('game.'+gameId)).to.be(true);
                    expect(redisSetSpy.calledWith('game.'+gameId+'1', JSON.stringify(game))).to.be(true);
                    expect(redisExistsSpy.calledWith('game.'+gameId+'1')).to.be(true);
                    done();
                };

                service.createGameWithId(gameId, gameCreationCallback);
            });
        });


    });
    // it('find a game based on it\'s id ', function (done) {

    //     fakeRedisClient.set = function (key, value, callback) {
    //         callback();
    //     };
    //     var spy = sinon.spy(fakeRedisClient, 'set');
    //     var dependencies = {redisClient: fakeRedisClient, Game: Game},
    //     service = GameService.create(dependencies),
    //     gameId = 'newGame',
    //     game = Game.create(gameId),
    //     callback = function () {
    //         expect(spy.calledWith('game.'+gameId, JSON.stringify(game))).to.be(true);
    //         done();
    //     };

    //     service.createGameWithId(gameId, callback);
    // });
});