/**
 * This is a directive that helps you dynamically create forms with row and col span.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the class constructor.
   * @type {string[]} Dependencies to be injected.
   */
  directive.$inject = ['$window'];
  /**
   * This is the directive constructor that takes the injected dependencies.
   * @param $window Injected window service dependency.
   * @returns {ng.IDirective}
   */
  function directive($window: ng.IWindowService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'E', // todo AC
      scope: {
        editMode: '=',
        layout: '=',
        fieldSets: '=',
        fields: '=',
        selected: '='
      },
      bindToController: true,
      link: link,
      controller: 'formLayout.FormLayoutController',
      controllerAs: 'vm',
      template: components.formLayout.formLayoutTemplate
    };
    /**
     * This is the directives link functions.
     * @param scope
     * @param instanceElement
     * @param instanceAttributes
     * @param controller
     * @param transclude
     */
    function link(scope: ng.IScope,
                  instanceElement: ng.IAugmentedJQuery,
                  instanceAttributes: ng.IAttributes,
                  controller: components.tableLayout.ITableLayoutController,
                  transclude: ng.ITranscludeFunction): void {
      return;
    }
  }

  // register the directive.
  angular.module('formLayout').directive('formLayout', directive);
})();
