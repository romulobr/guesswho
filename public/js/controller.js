var App = App || {};
App.createController = function (sockets, viewModel) {
    return new function () {
        self = this;
        function loadOptionsInto (viewModel)  {
            var options = App.Options.loadOptions();
            if (options) {
                viewModel.playerName(options.playerName);
                viewModel.gameName(options.gameName);
            }
        };
        self.init = function () {
            self.viewModel = App.createViewModel();
            self.loadOptionsInto(viewModel);
            self.sockets = App.createSocket(App.Options.socketUrl, self.viewModel);
            ko.applyBindings(app.viewModel);
        };
        return self;
    };
};