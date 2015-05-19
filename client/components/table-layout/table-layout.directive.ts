((): void => {
  'use strict';
  directive.$inject = ['$interval'];
  function directive($interval: ng.IIntervalService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'EAC',
      scope: {
        editMode: '=',
        layout: '=',
        compileCellTemplate: '=',
        selectCell: '=',
        allowContent: '=',
        addedContent: '=',
        removedContent: '='
      },
      bindToController: true,
      link: link,
      controller: 'tableLayout.TableLayoutController',
      controllerAs: 'vm',
      template: components.tableLayout.tableLayoutTemplate
    };
    function link(scope: ng.IScope,
                  instanceElement: ng.IAugmentedJQuery,
                  instanceAttributes: ng.IAttributes,
                  controller: components.tableLayout.ITableLayoutController,
                  transclude: ng.ITranscludeFunction): void {
      scope.$watch((): any => {
        return controller.layout ? controller.layout.tableRows.toString() : null;
      }, (newValue: any, oldValue: any) => {
        if (newValue) {
          controller.update(instanceElement.innerWidth());
        }
      });
      scope.$watch((): any => {
        return controller.layout ? controller.layout.selectedCell : null;
      }, (newValue: any, oldValue: any) => {
        if (newValue && oldValue && newValue.id === oldValue.id && newValue.colSpan && newValue.rowSpan) {
          var tableCell: components.tableLayout.ITableCell = controller.getTableCell(newValue.id);
          controller.updateSelectedSpan(
            newValue.colSpan - tableCell.colSpan,
            newValue.rowSpan - tableCell.rowSpan
          );
        }
      }, true);
      var width: number = 0;
      var interval: ng.IPromise<any> = $interval((): void => {
        var newWidth: number = instanceElement.innerWidth();
        if (width !== newWidth) {
          width = newWidth;
          controller.update(width);
        }
      }, 100);
      scope.$on('$destroy', (): void => {
        $interval.cancel(interval);
      });
    }
  }

  angular.module('tableLayout').directive('tableLayout', directive);
})();
