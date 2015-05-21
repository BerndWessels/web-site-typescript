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
  directive.$inject = ['$interval'];
  /**
   * This is the directive constructor that takes the injected dependencies.
   *
   * @param $interval Injected interval service dependency.
   * @returns {ng.IDirective}
   */
  function directive($interval: ng.IIntervalService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'EAC',
      scope: {
        editMode: '=',
        layout: '=',
        selectCell: '=',
        allowContent: '=',
        addedContent: '=',
        removedContent: '=',
        compileCellTemplate: '='
      },
      bindToController: true,
      link: link,
      controller: 'tableLayout.TableLayoutController',
      controllerAs: 'vm',
      template: components.tableLayout.tableLayoutTemplate
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
      // update the render-matrix whenever the layout changes.
      scope.$watch((): any => {
        return controller.layout ? controller.layout.tableRows.toString() : null;
      }, (newValue: any, oldValue: any) => {
        if (newValue) {
          controller.update(instanceElement.innerWidth());
        }
      });
      // update the selected cell span whenever it changes.
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
      // update the render-matrix whenever the table-layout width changes.
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

  // register the directive.
  angular.module('tableLayout').directive('tableLayout', directive);
})();
