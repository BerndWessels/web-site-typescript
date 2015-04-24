((): void => {
  'use strict';
  directive.$inject = ['dragDropService'];
  function directive(dragDropService: components.dragDrop.IDragDropService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'A',
      require: '^tableLayout',
      link: link
    };
    function link(scope: ng.IScope,
                  instanceElement: ng.IAugmentedJQuery,
                  instanceAttributes: ng.IAttributes,
                  controller: components.tableLayout.ITableLayoutController,
                  transclude: ng.ITranscludeFunction): void {
      instanceElement.on('dragenter', (eventObject: JQueryEventObject): any => {
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom');
          event.preventDefault();
        }
      });
      instanceElement.on('dragover', (eventObject: JQueryEventObject): any => {
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom');
          var side: string = calcSide(instanceElement, eventObject);
          switch (side) {
            case 'left':
              instanceElement.addClass('drag-over-left');
              break;
            case 'top':
              instanceElement.addClass('drag-over-top');
              break;
            case 'right':
              instanceElement.addClass('drag-over-right');
              break;
            case 'bottom':
              instanceElement.addClass('drag-over-bottom');
              break;
          }
          event.preventDefault();
        }
      });
      instanceElement.on('dragleave', (eventObject: JQueryEventObject): any => {
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom');
          event.preventDefault();
        }
      });
      instanceElement.on('drop', (eventObject: JQueryEventObject): any => {
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom');
          var data: any = dragDropService.getData();
          var side: string = calcSide(instanceElement, eventObject);
          scope.$apply((): void => {
            controller.drop((<any>scope).$parent.$index, (<any>scope).$index, side, data);
          });
          event.preventDefault();
        }
      });
      instanceElement.on('click', (eventObject: JQueryEventObject): any => {
        scope.$apply((): void => {
          controller.layout.selectedCell = (<any>scope).cell;
        });
      });
    }
  }

  function calcSide(instanceElement: ng.IAugmentedJQuery, eventObject: JQueryEventObject): string {
    var mouseX: number = eventObject.clientX;
    var mouseY: number = eventObject.clientY;
    var rectObject: ClientRect = instanceElement[0].getBoundingClientRect();
    var left: number = (mouseX - rectObject.left) / rectObject.width;
    var right: number = (rectObject.right - mouseX) / rectObject.width;
    var top: number = (mouseY - rectObject.top) / rectObject.height;
    var bottom: number = (rectObject.bottom - mouseY) / rectObject.height;
    instanceElement.css({'borderLeft': '', 'borderTop': '', 'borderRight': '', 'borderBottom': ''});
    if (left < right && left < top && left < bottom) {
      return 'left';
    }
    if (top < left && top < right && top < bottom) {
      return 'top';
    }
    if (right < left && right < top && right < bottom) {
      return 'right';
    }
    if (bottom < left && bottom < top && bottom < right) {
      return 'bottom';
    }
  };

  angular.module('tableLayout').directive('tableLayoutDrop', directive);
})();
