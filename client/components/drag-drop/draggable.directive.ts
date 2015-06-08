/**
 * This is a component that enables drag and drop support.
 */
/* tslint:disable:no-string-literal */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the class constructor.
   * @type {string[]} Dependencies to be injected.
   */
  directive.$inject = ['$parse', 'dragDropService'];
  /**
   * This is the directive constructor that takes the injected dependencies.
   * @param $parse Injected parse service dependency.
   * @param dragDropService Injected drag drop service dependency.
   * @returns {ng.IDirective}
   */
  function directive($parse: ng.IParseService, dragDropService: components.dragDrop.IDragDropService): ng.IDirective {
    return <ng.IDirective> {
      priority: -1000,
      restrict: 'A',
      link: link
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
                  instanceAttributes: ng.IAttributes): void {
      // handle the drag start event.
      instanceElement.on('dragstart', (eventObject: JQueryEventObject): any => {
        var dragEvent: DragEvent = <any> eventObject;
        var dragEffect: string = $parse(instanceAttributes['dragEffect'])(scope);
        var dragType: string = $parse(instanceAttributes['dragType'])(scope);
        var dragData: any = $parse(instanceAttributes['dragData'])(scope);
        var dragStart: (dragEffect: string, dragType: string, dragData: any, dragElement: ng.IAugmentedJQuery) => void =
          $parse(instanceAttributes['dragStart'])(scope);
        dragEvent.dataTransfer.effectAllowed = dragEffect;
        dragEvent.dataTransfer.setData('text', '');
        dragDropService.setType(dragType);
        dragDropService.setData(dragData);
        if (dragStart) {
          dragStart(dragEffect, dragType, dragData, instanceElement);
        }
        eventObject.stopPropagation();
        return false;
      });
      // handle the drag end event.
      instanceElement.on('dragend', (eventObject: JQueryEventObject): any => {
        var dragEffect: string = $parse(instanceAttributes['dragEffect'])(scope);
        var dragType: string = $parse(instanceAttributes['dragType'])(scope);
        var dragData: any = $parse(instanceAttributes['dragData'])(scope);
        var dragEnd: (dragEffect: string, dragType: string, dragData: any, dragElement: ng.IAugmentedJQuery) => void =
          $parse(instanceAttributes['dragEnd'])(scope);
        dragDropService.setType(null);
        dragDropService.setData(null);
        if (dragEnd) {
          dragEnd(dragEffect, dragType, dragData, instanceElement);
        }
        eventObject.stopPropagation();
        return false;
      });
    }
  }

  // register the directive.
  angular.module('dragDrop').directive('draggable', directive);
})();

