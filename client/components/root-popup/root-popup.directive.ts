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
      replace: true,
      restrict: 'E',
      require: '^rootPopupTarget',
      scope: true,
      link: link,
      template: '<root-popup-compiled ng-transclude></root-popup-compiled>',
      transclude: true
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
                  controller: ng.INgModelController,
                  transclude: ng.ITranscludeFunction): void {
      // detach the popup element from its current parent.
      instanceElement.detach();
      // attach it to the document body.
      instanceElement.appendTo('body');
      // save energy.
      var previousOffset: JQueryCoordinates = {left: 0, top: 0};
      var previousHeight: number = 0;
      // monitor the relative element for positioning.
      var interval: number = setInterval((): void => {
        // get the relative element.
        var relativeElement: ng.IAugmentedJQuery = (<any>controller).getRelativeElement();
        // make sure it is already set.
        if (relativeElement) {
          // get the relative element's position.
          var offset: JQueryCoordinates = relativeElement.offset();
          var height: number = relativeElement.height();
          // save energy.
          if (offset.left !== previousOffset.left || offset.top !== previousOffset.top || height !== previousHeight) {
            previousOffset = offset;
            previousHeight = height;
            // update the link element's position.
            instanceElement.css({
              display: 'block',
              top: offset.top + ((<any>instanceAttributes).top ? 0 : relativeElement.outerHeight()),
              left: offset.left,
              width: relativeElement.outerWidth()
            });
          }
        }
      }, 100);
      // cleanup.
      scope.$on('$destroy', (): void => {
        clearInterval(interval);
      });
    }
  }

  // register the directive.
  angular.module('rootPopup').directive('rootPopup', directive);
})();
