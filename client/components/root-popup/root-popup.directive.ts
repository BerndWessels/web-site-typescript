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
      // remember the original parent.
      var parent: JQuery = instanceElement.parent();
      // detach the popup element from its current parent.
      instanceElement.detach();
      // attach it to the document body.
      instanceElement.appendTo('body');
      var top: boolean = instanceAttributes.hasOwnProperty('top');
      var bottom: boolean = instanceAttributes.hasOwnProperty('bottom');
      var left: boolean = instanceAttributes.hasOwnProperty('left');
      var right: boolean = instanceAttributes.hasOwnProperty('right');
      var align: boolean = instanceAttributes.hasOwnProperty('align');
      var arrow: boolean = instanceAttributes.hasOwnProperty('arrow');
      bottom = !top && !bottom && !left && !right;
      // add arrow if necessary.
      if (arrow) {
        instanceElement.addClass('arrow');
        if (top) {
          instanceElement.addClass('top');
        }
        if (bottom) {
          instanceElement.addClass('bottom');
        }
        if (left) {
          instanceElement.addClass('left');
        }
        if (right) {
          instanceElement.addClass('right');
        }
      }
      // save energy.
      var previousTargetOffset: JQueryCoordinates = {left: 0, top: 0};
      var previousTargetWidth: number = 0;
      var previousTargetHeight: number = 0;
      var previousInstanceWidth: number = 0;
      var previousInstanceHeight: number = 0;
      var stabilized: number = 0;
      var interval: number = null;
      // update the popup location and dimensions.
      function update(): void {
        // get the relative element.
        var relativeElement: ng.IAugmentedJQuery = (<any>controller).getRelativeElement();
        // make sure it is already set.
        if (relativeElement) {
          // get the relative element's position and dimensions.
          var targetOffset: JQueryCoordinates = relativeElement.offset();
          var targetWidth: number = relativeElement.outerWidth();
          var targetHeight: number = relativeElement.outerHeight();
          // get the instance element's dimensions.
          var instanceWidth: number = instanceElement.outerWidth(true);
          var instanceHeight: number = instanceElement.outerHeight(true);
          // save energy.
          if (
            targetOffset.left !== previousTargetOffset.left || targetOffset.top !== previousTargetOffset.top ||
            targetWidth !== previousTargetWidth || targetHeight !== previousTargetHeight ||
            instanceWidth !== previousInstanceWidth || instanceHeight !== previousInstanceHeight
          ) {
            // remember previous values.
            previousTargetOffset = targetOffset;
            previousTargetWidth = targetWidth;
            previousTargetHeight = targetHeight;
            previousInstanceWidth = instanceWidth;
            previousInstanceHeight = instanceHeight;
            // update the link element's position.
            if (top) {
              instanceElement.css({
                display: 'block',
                top: targetOffset.top - instanceHeight,
                left: targetOffset.left,
                width: align ? targetWidth : ''
              });
            }
            if (bottom) {
              instanceElement.css({
                display: 'block',
                top: targetOffset.top + targetHeight,
                left: targetOffset.left,
                width: align ? targetWidth : ''
              });
            }
            if (left) {
              instanceElement.css({
                display: 'block',
                top: (
                  targetOffset.top +
                  Math.floor(targetHeight / 2) -
                  Math.floor(instanceHeight / 2)
                ),
                left: targetOffset.left - instanceWidth
              });
            }
            if (right) {
              instanceElement.css({
                display: 'block',
                top: (
                  targetOffset.top +
                  Math.floor(targetHeight / 2) -
                  Math.floor(instanceHeight / 2)
                ),
                left: targetOffset.left + targetWidth
              });
            }
          }
        }
        // 1ms repetition until the popup rendering has stabilized.
        if (stabilized < 10) {
          stabilized++;
        } else if (stabilized === 10) {
          stabilized++;
          instanceElement.css({visibility: 'visible'});
          clearInterval(interval);
          interval = setInterval(update, 100);
        }
      }

      // monitor and update the popup positions and dimensions.
      interval = setInterval(update, 1);

      // cleanup.
      scope.$on('$destroy', (): void => {
        // cleanup.
        clearInterval(interval);
        // put it back where it belongs.
        instanceElement.detach();
        // otherwise it will not work the next time.
        parent.append(instanceElement);
      });
    }
  }

  // register the directive.
  angular.module('rootPopup').directive('rootPopup', directive);
})();
