/**
 * This is the application core module to register all dependencies to common components.
 */
((): void => {
  'use strict';
  // register the module and it's dependencies.
  angular.module('app.core', [
    'ngRoute',
    'tableLayout',
    'formLayout',
    'formProperties',
    'dragDrop',
    'ui.bootstrap'
  ]);
})();
