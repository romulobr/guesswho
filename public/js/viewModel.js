var App = App || {};
App.createViewModel = function () {
    return new function () {
        self = this;
        self.players = ko.observableArray([]);
        self.connected = ko.observable(false);
        self.message = ko.observable('');
        self.gameName = ko.observable('');
        self.playerName = ko.observable('');

        self.addPlayer = function (player) {
            self.players.push(player);
        };

        self.updatePlayers = function (newPlayers) {
            var oldPlayer;
            _.each(newPlayers, function (newPlayer) {
                oldPlayer = _.findWhere(self.players(), {realName: newPlayer.realName});
                console.log(JSON.stringify(oldPlayer));
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
    };
};