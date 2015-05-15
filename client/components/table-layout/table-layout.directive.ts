((): void => {
  'use strict';
  directive.$inject = [];
  function directive(): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'EAC',
      scope: {
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
      scope.$watch((): any => {
        return instanceElement.innerWidth();
      }, (newValue: any, oldValue: any) => {
        if (newValue) {
          controller.update(newValue);
        }
      });
    }
  }

  angular.module('tableLayout').directive('tableLayout', directive);
})();
