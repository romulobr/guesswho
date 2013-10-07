var App = App || {};
App.createSocket = function (viewModel, socketUrl) {

    var client = {
        changeName: function (realName, newName) {
            client.socket.emit('change name', {realName: realName, newName: newName});
        }
    }

    console.log('connecting to: ' + socketUrl);
    client.socket = io.connect(socketUrl);

    client.socket.on('join success', function (data) {
        console.log("You joined the game: "+JSON.stringify(data));
        viewModel.updatePlayers(data.players);
        viewModel.connected(true);
    });

    client.socket.on('new player', function (data) {
        viewModel.message("Another player has joined the game!");
        console.log("Another player has joined the game: "+JSON.stringify(data));
        viewModel.updatePlayers(data.players);
    });

    client.socket.on('join fail', function (data) {
        viewModel.message("Couldn't join the game" + data.message);
        console.log("Couldn't join the game" + JSON.stringify(data.message));
    });

    client.socket.on('connect', function () {
        console.log('[CLIENT] connected: '+ socketUrl);
        client.socket.emit('join game',{ gameId:viewModel.gameName(), playerName:viewModel.playerName() });
    });

    client.socket.on('player disconnect', function (data) {
        viewModel.message(data.playerRealName+" has left the game.");
        console.log('A player disconnected:'+ data.playerRealName);
        viewModel.removePlayer(data.playerRealName);
    });

    client.socket.on('name change', function (data) {
        console.log('A name change event was received for player:'+ data.playerRealName);
        viewModel.updateName(data);
    });

    return client;
};