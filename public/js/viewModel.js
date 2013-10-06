var App = App || {};

App.createViewModel = function () {
    var self = {
        players : ko.observableArray([]),
        connected : ko.observable(false),
        message : ko.observable(''),
        gameName : ko.observable('gameName'),
        playerName : ko.observable('playerName'),

        addPlayer : function (player) {
            self.players.push(player);
        },

        updatePlayers : function (newPlayers) {
            var oldPlayer;
            _.each(newPlayers, function (newPlayer) {
                oldPlayer = _.findWhere(self.players(), {realName: newPlayer.realName});
                if (!oldPlayer && newPlayer.realName != self.playerName()) {
                    newPlayer.fictionalName = "change me."
                    self.addPlayer(newPlayer);
                }
            });
        },

        removePlayer : function (playerName) {
            self.players.remove( function (player) {
                return player.realName === playerName;
            });
        },

        message : function (message) {
            var template = _.template("<div class=\"note\"><%= message %></div>");
            $('body').append(template({message:message}));
        },

        createGame : function () {
            function validOptions() {
                console.log("game name: "+self.gameName());
                console.log("player name: "+self.playerName());
                return self.gameName() && self.playerName();
            };
            if (validOptions()) {
                $.post('/game', {gameName:self.gameName()}, function (data, textStatus) {
                    self.game = data.game;
                    self.joinGame();
                });
            } else {
                self.message("We need a name and a game name to proceed.");
            }
        },

        joinGame : function () {
            App.createSocket(self,App.Options.socketUrl);
            App.Options.save({gameName: self.gameName(), playerName: self.playerName()});
            $('x-flipbox')[0].toggle();
        }
    };
    return self;
};