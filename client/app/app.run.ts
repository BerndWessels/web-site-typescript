((): void => {
  'use strict';
  run.$inject = ['$rootScope'];
  function run($rootScope: ng.IRootScopeService): void {
    $rootScope.$on('$routeChangeError', (): void => {
      console.log('routeChangeError');
    });
  }

  angular.module('app').run(run);
})();
