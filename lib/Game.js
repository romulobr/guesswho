"use strict";

var create = function (id) {
  return {
    id: id,
    players : [],
    playerCount : function () {
      return this.players.length;
    },
    addPlayer : function (player) {
      this.players.push(player);
    },
    findPlayerByRealName: function (realName) {
      var returnPlayer;

      this.players.forEach(function (player) {
        if(player.realName === realName) {
          returnPlayer = player;
        }
      });

      return returnPlayer;
    }
  };
};

exports.create = create;