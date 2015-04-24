((): void => {
  'use strict';
  config.$inject = ['$routeProvider'];
  function config($routeProvider: ng.route.IRouteProvider): void {
    $routeProvider.when(
      '/', {
        template: app.appTemplate,
        controller: app.AppController,
        controllerAs: 'vm'
      }
    ).when(
      '/trial', {
        template: app.trial.trialTemplate,
        controller: app.trial.TrialController,
        controllerAs: 'vm'
      }
    );
  }

  angular.module('app').config(config);
})();
