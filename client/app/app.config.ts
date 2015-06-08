/**
 * This is the application's configuration function.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the configuration function.
   *
   * @type {string[]} Dependencies to be injected.
   */
  config.$inject = ['$locationProvider', '$compileProvider'];
  /**
   * This is the configuration function that takes the injected dependencies.
   *
   * @param $locationProvider The injected location provider dependency.
   * @param $compileProvider The injected compile provider dependency.
   */
  function config($locationProvider: ng.ILocationProvider, $compileProvider: ng.ICompileProvider): void {
    // enable HTML5 routing.
    $locationProvider.html5Mode(true);
    // disable debug information in production.
    $compileProvider.debugInfoEnabled(true); // todo: Switch on in development builds.
  }

  // register the configuration function.
  angular.module('app').config(config);
})();
