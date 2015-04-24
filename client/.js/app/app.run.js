(function () {
    'use strict';
    run.$inject = ['$rootScope'];
    function run($rootScope) {
        $rootScope.$on('$routeChangeError', function () {
            console.log('routeChangeError');
        });
    }
    angular.module('app').run(run);
})();
//# sourceMappingURL=app.run.js.map