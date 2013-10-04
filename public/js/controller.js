var App = App || {};

App.init = function () {
    myApp = App.createController();
    myApp.init();
}

App.createController = function () {
    return new function () {
        var self = this;
        function loadOptionsInto (viewModel)  {
            var options = App.Options.load();
            if (options && options.playerName && options.gameName ) {
                viewModel.playerName(options.playerName);
                viewModel.gameName(options.gameName);
            }
        };

        self.init = function () {
            self.viewModel = App.createViewModel();
            loadOptionsInto(self.viewModel);
            ko.applyBindings(self.viewModel);
        };
        return self;
    };
};