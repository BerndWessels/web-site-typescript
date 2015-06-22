/**
 * This is a directive that lets you select multiple values from an input field.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the run function.
   * @type {string[]} Dependencies to be injected.
   */
  run.$inject = ['$templateCache'];
  /**
   * This is run function that takes the injected dependencies.
   * @param $templateCache The injected template cache dependency.
   *
   */
  function run($templateCache: ng.ITemplateCacheService): void {
    $templateCache.put('select-input-input', components.selectInput.selectInputTemplate);
    $templateCache.put('select-input-selected-options', components.selectInput.selectInputSelectedOptionsTemplate);
    $templateCache.put('select-input-filtered-options', components.selectInput.selectInputFilteredOptionsTemplate);
    $templateCache.put('select-input-filtered-options-only', components.selectInput.selectInputFilteredOptionsOnlyTemplate);
  }

  // register the run function.
  angular.module('selectInput').run(run);
})();
