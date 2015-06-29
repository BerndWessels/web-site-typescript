/**
 * This is a directive that lets you popup stuff.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the class constructor.
   * @type {string[]} Dependencies to be injected.
   */
  directive.$inject = [];
  /**
   * This is the directive constructor that takes the injected dependencies.
   * @returns {ng.IDirective}
   */
  function directive(): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'A',
      // scope: true,
      link: link,
      controller: controller,
      template: ''
    };
    /**
     * This is the controller for the directive.
     */
    function controller(): void {
      // share the relative element with the popup.
      this.relativeElement = null;
      this.setRelativeElement = function (relativeElement: ng.IAugmentedJQuery): void {
        this.relativeElement = relativeElement;
      };
      this.getRelativeElement = function (): void {
        return this.relativeElement;
      };
    }

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
                  controller: ng.INgModelController,
                  transclude: ng.ITranscludeFunction): void {
      // set the relative element that will be used to position the popup.
      (<any>controller).setRelativeElement(instanceElement);
    }
  }

  // register the directive.
  angular.module('rootPopup').directive('rootPopupTarget', directive);
})();
