var App = App || {};

App.createViewModel = function () {
    var viewModel = {
        players : ko.observableArray([]),
        connected : ko.observable(false),
        message : ko.observable(''),
        gameName : ko.observable('gameName'),
        playerName : ko.observable('playerName'),

        addPlayer : function (player) {
            viewModel.players.push(player);
        },

        updateName : function (player) {
            console.log('updating name'+ player.fictionalName);
            oldPlayer = _.findWhere(viewModel.players(), {realName: player.realName});
            oldPlayer.fictionalName(player.fictionalName);
        },

        updatePlayers : function (newPlayers) {
            var oldPlayer;
            _.each(newPlayers, function (newPlayer) {
                oldPlayer = _.findWhere(viewModel.players(), {realName: newPlayer.realName});
                if (!oldPlayer && newPlayer.realName != viewModel.playerName()) {
                    newPlayer.fictionalName = ko.observable("change me.")
                    newPlayer.fictionalName.subscribe(function (newValue) {
                        viewModel.client.changeName(this.realName,newValue);
                    }, newPlayer);
                    viewModel.addPlayer(newPlayer);
                }
            });
        },

        removePlayer : function (playerName) {
            viewModel.players.remove( function (player) {
                return player.realName === playerName;
            });
        },

        message : function (message) {
            var template = _.template("<div class=\"note\"><%= message %></div>");
            $('body').append(template({message:message}));
        },

        createGame : function () {
            function validOptions() {
                console.log("game name: "+viewModel.gameName());
                console.log("player name: "+viewModel.playerName());
                return viewModel.gameName() && viewModel.playerName();
            };
            if (validOptions()) {
                $.post('/game', {gameName:viewModel.gameName()}, function (data, textStatus) {
                    viewModel.game = data.game;
                });
            } else {
                viewModel.message("We need a name and a game name to proceed.");
            }
        },

        joinGame : function () {
            viewModel.createGame();
            viewModel.client = App.createSocket(viewModel,App.Options.socketUrl);
            App.Options.save({gameName: viewModel.gameName(), playerName: viewModel.playerName()});
            $('x-flipbox')[0].toggle();
        },

        back : function () {
            viewModel.client && viewModel.client.connection && viewModel.client.connection.end();
            $('x-flipbox')[0].toggle();
        }
    };
    return viewModel;
};