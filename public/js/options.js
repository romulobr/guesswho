var App = App || {};

App.Options = {
    socketUrl: window.location.protocol+"//"+window.location.hostname+":7001",
    defaultOptions: {gameName: null, playerName: null},
    load: function () {
        return store.get('options');
    },
    save: function (options) {
        return store.set('options', options);
    }
}