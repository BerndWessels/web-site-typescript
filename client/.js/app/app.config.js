(function () {
    'use strict';
    config.$inject = ['$locationProvider', '$compileProvider'];
    function config($locationProvider, $compileProvider) {
        $locationProvider.html5Mode(true);
        $compileProvider.debugInfoEnabled(true); // todo: Switch on in development builds.
    }
    angular.module('app').config(config);
})();
//# sourceMappingURL=app.config.js.map