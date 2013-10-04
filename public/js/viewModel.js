var App = App || {};

App.createViewModel = function () {
    return new function () {
        var self = this;
        self.players = ko.observableArray([]);
        self.connected = ko.observable(false);
        self.message = ko.observable('');
        self.gameName = ko.observable('gameName');
        self.playerName = ko.observable('playerName');

        self.addPlayer = function (player) {
            self.players.push(player);
        };

        self.updatePlayers = function (newPlayers) {
            var oldPlayer;
            _.each(newPlayers, function (newPlayer) {
                oldPlayer = _.findWhere(self.players(), {realName: newPlayer.realName});
                if (!oldPlayer && newPlayer.realName != app.options.playerName) {
                    newPlayer.fictionalName = "change me."
                    self.addPlayer(newPlayer);
                }
            });
        }

        self.removePlayer = function (playerName) {
            self.players.remove( function (player) {
                return player.realName === playerName;
            });
        }

        self.message = function (message) {
            var template = _.template("<div class=\"note\"><%= message %></div>");
            $('body').append(template({message:message}));
            return app;
        }

        self.createGame = function () {
            function validOptions(options) {
                console.log("game name: "+self.gameName());
                console.log("player name: "+self.playerName());
                return self.gameName() && self.playerName();
            };
            if (validOptions(app.options)) {
                $.post('/game', {gameName:self.gameName()}, function (data, textStatus) {
                    self.game = data.game;
                    App.Options.saveOptions(data.game);
                    self.joinGame();
                });
            } else {
                self.message("We need a name and a game name to proceed.");
            }
            return app;
        };

        self.joinGame = function () {
            App.createSocket(App.Options.socketUrl, self);
        };

        return self;
    };
};