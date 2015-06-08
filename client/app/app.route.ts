/**
 * This is the application's route function.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the run function.
   * @type {string[]} Dependencies to be injected.
   */
  config.$inject = ['$routeProvider'];
  /**
   * This is the route function that takes the injected dependencies.
   * @param $routeProvider The injected route provider dependency.
   */
  function config($routeProvider: ng.route.IRouteProvider): void {
    // handle route changes.
    $routeProvider.when(
      '/', {
        template: app.appTemplate,
        controller: 'app.AppController',
        controllerAs: 'appCtrl'
      }
    ).when(
      '/accounts', {
        template: app.accounts.accountsTemplate,
        controller: 'app.accounts.AccountsController',
        controllerAs: 'accountsCtrl'
      }
    );
  }

  // register the route function.
  angular.module('app').config(config);
})();
