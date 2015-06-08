/**
 * This is the application's run function.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the run function.
   * @type {string[]} Dependencies to be injected.
   */
  run.$inject = ['$rootScope'];
  /**
   * This is run function that takes the injected dependencies.
   * @param $rootScope The injected root scope dependency.
   *
   */
  function run($rootScope: ng.IRootScopeService): void {
    // handle any route change errors.
    $rootScope.$on('$routeChangeError', (): void => {
      console.log('routeChangeError');
    });
  }

  // register the run function.
  angular.module('app').run(run);
})();
