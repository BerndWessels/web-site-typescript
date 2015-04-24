var app;
(function (app) {
    'use strict';
    var AppController = (function () {
        function AppController() {
            var vm = this;
            vm.fullName = 'Bernd';
            vm.lastName = 'Wessels';
        }
        AppController.$inject = [];
        return AppController;
    })();
    app.AppController = AppController;
    angular.module('app').controller('app.AppController', AppController);
})(app || (app = {}));
//# sourceMappingURL=app.controller.js.map