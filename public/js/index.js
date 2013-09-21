function createApp () {
    var defaultOptions = {gameName: null, playerName: null};
    function validOptions(options) {
        return !!options.gameName && !!options.playerName
    };
    var app = {
        options: defaultOptions,
        fields : {gameName: null, playerName: null},
        buttons: {joinGame: null, createGame: null},
        gameStarted: null,
        init: function () {
            app.loadOptions()
                .loadFields()
                .loadButtons()
                .optionsToFields()
                .bindEvents();
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
                });
            } else {
                app.showMessage("We need a name and a game name to proceed.");
            }
            return app;
        },
        joinGame: function () {
            return app;
        }
    };
    app.init();
    return app;
};