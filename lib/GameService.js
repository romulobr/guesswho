"use strict";

exports.create = function (dependencies) {
    if(!dependencies || !dependencies.redisClient || !dependencies.Game) return  null;

    var redisClient = dependencies.redisClient,
        Game = dependencies.Game;

    return {
        createGameWithId: function (id, callback) {
            var game = Game.create(id);
            redisClient.set('game.'+id, JSON.stringify(game), callback);
        }
    };
};