/**
 * This is a directive that helps you dynamically create table layouts with row and col span.
 */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the class constructor.
   *
   * @type {string[]}
   */
  directive.$inject = ['$compile', '$timeout'];
  /**
   * This is the directive constructor that takes the injected dependencies.
   * @param $compile Injected compile service dependency.
   * @param $timeout Injected timeout service dependency.
   * @returns {ng.IDirective}
   */
  function directive($compile: ng.ICompileService, $timeout: ng.ITimeoutService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'EAC',
      require: '^tableLayout',
      scope: false,
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
      // watch the cell content.
      scope.$watch((): components.tableLayout.ITableCell => {
        return <components.tableLayout.ITableCell> (<any>scope).layoutCell.tableCell;
      }, (newValue: components.tableLayout.ITableCell, oldValue: components.tableLayout.ITableCell): void => {
        if (newValue) {
          // render the cell template.
          instanceElement.html(newValue.content.template);
          if (controller.compileCellTemplate) {
            controller.compileCellTemplate(instanceElement.contents());
          } else {
            $compile(instanceElement.contents())(scope);
          }
          //
          controller.cellElements[(<any>scope).layoutCell.tableCell.id] = instanceElement;
        } else {
          // clear the cell content.
          instanceElement.html('');
        }
      });
      // triggered by an event outside of the angular world.
      (<any>scope).dragStart = (): void => {
        // only in edit mode.
        if (!controller.editMode) {
          return;
        }
        // let the event finish before messing with the element that triggered it.
        $timeout((): void => {
          // back in the angular world, now remove the cell from the layout.
          controller.remove((<any>scope).layoutCell.tableCell.id);
        }, 0);
      };
      // watch the cell content.
      scope.$watch((): number => {
        return instanceElement.height();
      }, (newValue: number, oldValue: number): void => {
        if (!isNaN(newValue)) {
          controller.updateCells();
        }
      });
    }
  }

  // register the directive.
  angular.module('tableLayout').directive('tableLayoutCell', directive);
})();
