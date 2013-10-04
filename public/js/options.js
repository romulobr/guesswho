var App = App || {};

App.Options = {
    socketUrl: window.location.protocol+"//"+window.location.hostname+":7001",
    defaultOptions: {gameName: null, playerName: null},
    loadOptions: function () {
        return store.get('options');
    },
    saveOptions: function (options) {
        return store.set('options', options);
    }
}