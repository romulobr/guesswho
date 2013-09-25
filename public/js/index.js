function createApp () {
    var defaultOptions = {gameName: null, playerName: null};
    var socketUrl;
    function validOptions(options) {
        return !!options.gameName && !!options.playerName
    };

    var app = {
        options: defaultOptions,
        fields : {gameName: null, playerName: null},
        buttons: {joinGame: null, createGame: null},
        gameStarted: null,
        viewModel: {
            players: ko.observableArray([]),
            addPlayer: function (player) {
                app.viewModel.players.push(player);
            }
        },
        updatePlayers: function (newPlayers) {
            var oldPlayer;
            _.each(newPlayers, function (newPlayer) {
                oldPlayer = _.findWhere(app.viewModel.players(), {realName: newPlayer.realName});
                console.log(JSON.stringify(oldPlayer));
                if (!oldPlayer && newPlayer.realName != app.options.playerName) {
                    newPlayer.fictionalName = "change me."
                    app.viewModel.addPlayer(newPlayer);
                }
            });
        },
        init: function () {
            app.loadOptions()
                .loadFields()
                .loadButtons()
                .optionsToFields()
                .bindEvents()
                .fetchSocketUrl();
            ko.bindingHandlers.fadeVisible = {
                init: function(element, valueAccessor) {
                    // Initially set the element to be instantly visible/hidden depending on the value
                    var value = valueAccessor();
                    $(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
                },
                update: function(element, valueAccessor) {
                    // Whenever the value subsequently changes, slowly fade the element in or out
                    var value = valueAccessor();
                    ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
                }
            };
                ko.applyBindings(app.viewModel);
        },
        flipView: function () {
            $('x-flipbox')[0].toggle();
        },
        populatePlayersList: function (playersName) {

        },
        fetchSocketUrl: function () {
            app.socketUrl = window.location.protocol+"//"+window.location.hostname+":7001";
        },
        showMessage: function (message) {
            var template = _.template("<div class=\"note\"><%= message %></div>");
            $('body').append(template({message:message}));
            return app;
        },
        loadOptions: function () {
            app.options = store.get('options', app);
            if (!app.options) {
                app.options = defaultOptions;
            }
            return app;
        },
        saveOptions: function () {
            store.set('options', app.options);
            return app;
        },
        loadFields: function () {
            app.fields.gameName = $('#game_name_input');
            app.fields.playerName = $('#player_name_input');
            return app;
        },
        loadButtons: function () {
            app.buttons.createGame = $('#create_game_button');
            app.buttons.joinGame = $('#join_game_button');
            return app;
        },
        bindEvents: function () {
            app.buttons.createGame.click(app.createGame);
            app.buttons.joinGame.click(app.joinGame);
            return app;
        },
        optionsToFields : function () {
            if (app.options) {
                app.fields.gameName.val(app.options.gameName);
                app.fields.playerName.val(app.options.playerName);
            }
            return app;
        },
        fieldsToOptions : function () {
            app.loadFields();
            app.options.gameName = app.fields.gameName.val();
            app.options.playerName = app.fields.playerName.val();
            console.log('player name: '+ app.options.playerName);
            console.log('game name: '+ app.options.gameName);
            return app;
        },
        createGame: function () {
            console.log("%j",this);
            app.fieldsToOptions();
            if (validOptions(app.options)) {
                $.post('/game', {gameName:app.options.gameName}, function (data, textStatus) {
                    app.game = data.game;
                    app.saveOptions();
                    app.joinGame();
                });
            } else {
                app.showMessage("We need a name and a game name to proceed.");
            }
            return app;
        },
        joinGame: function () {
            console.log('[CLIENT] connecting to url: '+ app.socketUrl);
            app.fieldsToOptions();
            var socket = io.connect(app.socketUrl);

            socket.on('join success', function (data) {
                app.showMessage("You joined the game"+JSON.stringify(data));
                console.log("A player joined the game"+JSON.stringify(data));
                app.updatePlayers(data.players);
                app.flipView();
            });
            socket.on('new player', function (data) {
                app.showMessage("A player joined the game"+JSON.stringify(data));
                console.log("A player joined the game"+JSON.stringify(data));
                app.updatePlayers(data.players);
            });
            socket.on('join fail', function (data) {
                app.showMessage("Couldn't join the game" + data.message);
                console.log("Couldn't join the game" + JSON.stringify(data.message));
            });
            socket.on('connect', function () {
                console.log('[CLIENT] connected: '+ app.socketUrl);
                socket.emit('join game',{ gameId:app.options.gameName, playerName:app.options.playerName });
            });
            return app;
        }
    };
    app.init();
    return app;
};