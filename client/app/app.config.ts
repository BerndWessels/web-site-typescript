((): void => {
  'use strict';
  config.$inject = ['$locationProvider', '$compileProvider'];
  function config($locationProvider: ng.ILocationProvider, $compileProvider: ng.ICompileProvider): void {
    $locationProvider.html5Mode(true);
    $compileProvider.debugInfoEnabled(true); // todo: Switch on in development builds.
  }

  angular.module('app').config(config);
})();
