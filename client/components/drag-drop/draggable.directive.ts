/* tslint:disable:no-string-literal */
((): void => {
  'use strict';
  directive.$inject = ['$parse', 'dragDropService'];
  function directive($parse: ng.IParseService, dragDropService: components.dragDrop.IDragDropService): ng.IDirective {
    return <ng.IDirective> {
      priority: -1000,
      restrict: 'A',
      link: link
    };
    function link(scope: ng.IScope,
                  instanceElement: ng.IAugmentedJQuery,
                  instanceAttributes: ng.IAttributes): void {
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

  angular.module('dragDrop').directive('draggable', directive);
})();

