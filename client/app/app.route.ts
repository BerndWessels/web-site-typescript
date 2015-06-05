((): void => {
  'use strict';
  config.$inject = ['$routeProvider'];
  function config($routeProvider: ng.route.IRouteProvider): void {
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

  angular.module('app').config(config);
})();
