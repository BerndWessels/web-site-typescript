/* tslint:disable:no-string-literal */
/**
 * This is a directive that helps you dynamically create table layouts with row and col span.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the class constructor.
   *
   * @type {string[]} Dependencies to be injected.
   */
  directive.$inject = ['$parse', 'dragDropService'];
  /**
   * This is the directive constructor that takes the injected dependencies.
   *
   * @param $parse Injected parse service dependency.
   * @param dragDropService Injected drag drop service dependency.
   * @returns {ng.IDirective}
   */
  function directive($parse: ng.IParseService, dragDropService: components.dragDrop.IDragDropService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'A',
      require: '^tableLayout',
      link: link
    };
    /**
     * This is the directives link functions.
     *
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
      // process the drag-enter event.
      instanceElement.on('dragenter', (eventObject: JQueryEventObject): any => {
        if (!controller.editMode) {
          return;
        }
        if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
          return;
        }
        var data: components.tableLayout.ITableCellContent = dragDropService.getData();
        if (!data) {
          return;
        }
        if (controller.allowContent(controller.layout, data)) {
          return;
        }
        // reset the dragging indicator classes.
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
          dragEvent.preventDefault();
        }
      });
      // process the drag-over event.
      instanceElement.on('dragover', (eventObject: JQueryEventObject): any => {
        if (!controller.editMode) {
          return;
        }
        if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
          return;
        }
        var data: any = dragDropService.getData();
        if (!data) {
          return;
        }
        if (controller.allowContent(controller.layout, data)) {
          return;
        }
        // set the dragging indicator class.
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
          var tableRowIndex: number = (<any>scope).layoutCell.y;
          var tableColIndex: number = (<any>scope).layoutCell.x;
          if (controller.layout.tableRows[tableRowIndex][tableColIndex]) {
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
            dragEvent.preventDefault();
          } else {
            instanceElement.addClass('drag-over-all');
            dragEvent.preventDefault();
          }
        }
      });
      // process the drag-leave event.
      var data: components.tableLayout.ITableCellContent;
      instanceElement.on('dragleave', (eventObject: JQueryEventObject): any => {
        if (!controller.editMode) {
          return;
        }
        if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
          return;
        }
        data = dragDropService.getData();
        if (!data) {
          return;
        }
        if (controller.allowContent(controller.layout, data)) {
          return;
        }
        // reset the dragging indicator classes.
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
          dragEvent.preventDefault();
        }
      });
      // process the drop event.
      instanceElement.on('drop', (eventObject: JQueryEventObject): any => {
        if (!controller.editMode) {
          return;
        }
        if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
          return;
        }
        data = dragDropService.getData();
        if (!data) {
          return;
        }
        if (controller.allowContent(controller.layout, data)) {
          return;
        }
        // reset the dragging indicator and call the controller.
        var dragEvent: DragEvent = <any> eventObject;
        if (dragEvent.dataTransfer.effectAllowed === 'move') {
          instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
          data = dragDropService.getData();
          var side: string = calcSide(instanceElement, eventObject);
          scope.$apply((): void => {
            controller.drop((<any>scope).layoutCell.y, (<any>scope).layoutCell.x, side, data);
          });
          dragEvent.preventDefault();
        }
      });
      // process the click event.
      instanceElement.on('click', (eventObject: JQueryEventObject): any => {
        if (!controller.editMode) {
          return;
        }
        // select or deselect the cell.
        scope.$apply((): void => {
          var deselect: boolean = eventObject.ctrlKey;
          var selectCell: components.tableLayout.ITableCell = {
            id: (<any>scope).layoutCell.tableCell.id,
            rowSpan: (<any>scope).layoutCell.tableCell.rowSpan,
            colSpan: (<any>scope).layoutCell.tableCell.colSpan,
            content: (<any>scope).layoutCell.tableCell.content
          };
          if (controller.selectCell) {
            controller.selectCell(controller.layout, deselect ? null : selectCell);
          } else {
            controller.layout.selectedCell = deselect ? null : selectCell;
          }
        });
        eventObject.preventDefault();
        eventObject.stopPropagation();
      });
    }
  }

  /**
   * This calculates the nearest side to the dragging cursor.
   *
   * @param instanceElement
   * @param eventObject
   * @returns {any}
   */
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
  }

  // register the directive.
  angular.module('tableLayout').directive('tableLayoutDrop', directive);
})();
