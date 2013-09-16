"use strict";

var expect = require('expect.js');
var Game = require('../lib/Game.js');

describe('game', function () {
  it('is created using an uniqueId', function () {
    var game = Game.create('uniqueId');
    expect(game.id).to.be('uniqueId');
  });

  it('starts with an empty list of players', function () {
    var game = Game.create();
    expect(game.playerCount()).to.be(0);
    expect(game.players.length).to.be(0);
  });

});