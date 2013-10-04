var App = App || {};
App.createSocket = function (viewModel, socketUrl) {

    return new function () {
        var self = this;
        //console.log('connecting to: ' + socketUrl);
        self.socket = io.connect();

        self.socket.on('join success', function (data) {
            console.log("You joined the game: "+JSON.stringify(data));
            viewModel.updatePlayers(data.players);
            viewModel.connected(true);
        });

        self.socket.on('new player', function (data) {
            viewModel.message("Another player has joined the game!");
            console.log("Another player has joined the game: "+JSON.stringify(data));
            viewModel.updatePlayers(data.players);
        });

        self.socket.on('join fail', function (data) {
            viewModel.message("Couldn't join the game" + data.message);
            console.log("Couldn't join the game" + JSON.stringify(data.message));
        });

        self.socket.on('connect', function () {
            console.log('[CLIENT] connected: '+ socketUrl);
            self.socket.emit('join game',{ gameId:viewModel.gameName(), playerName:viewModel.playerName() });
        });

        self.socket.on('player disconnect', function (data) {
            viewModel.message(data.playerRealName+" has left the game.");
            console.log('A player disconnected:'+ data.playerRealName);
            viewModel.removePlayer(data.playerRealName);
        });

        return self;
    }
};