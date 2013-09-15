"use strict";

exports.create = function (dependencies) {
    if(!dependencies || !dependencies.redisClient || !dependencies.Game) return  null;

    var redisClient = dependencies.redisClient,
        Game = dependencies.Game;

    function findAvailableIndex(id, index, callback) {
        index = index || 0;
        var gameId = index === 0 ? ('game.' + id) : ('game.' + id) + index;

        redisClient.exists(gameId, function (error, exists) {
            if (exists === 0){
                callback(index);
            }
            else {
                findAvailableIndex(id, index+1, callback);
            }
        });
    }
    return {
        createGameWithId: function (id, callback) {
            findAvailableIndex(id, 0, function (index) {
                var gameId = index === 0 ? ('game.' + id) : ('game.' + id) + index;
                var game = Game.create(gameId);
                redisClient.set(gameId, JSON.stringify(game), callback);
                console.log('persisting game: %j', game);
            });
        }
    };
};