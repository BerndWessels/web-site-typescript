/**
 * This is the application module.
 */
((): void => {
  'use strict';
  // register the module and it's dependencies.
  angular.module('app', [
    'app.core'
    // todo automatically inject feature modules here.
  ]);
})();
