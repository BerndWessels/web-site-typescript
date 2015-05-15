((): void => {
  'use strict';
  directive.$inject = ['$compile', '$timeout'];
  function directive($compile: ng.ICompileService, $timeout: ng.ITimeoutService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'EAC',
      require: '^tableLayout',
      scope: false,
      link: link
    };
    function link(scope: ng.IScope,
                  instanceElement: ng.IAugmentedJQuery,
                  instanceAttributes: ng.IAttributes,
                  controller: components.tableLayout.ITableLayoutController,
                  transclude: ng.ITranscludeFunction): void {
      // watch the cell content.
      scope.$watch((): components.tableLayout.ITableCell => {
        return <components.tableLayout.ITableCell> (<any>scope).cell;
      }, (newValue: components.tableLayout.ITableCell, oldValue: components.tableLayout.ITableCell): void => {
        if (newValue) {
          // render the cell template.
          instanceElement.html(newValue.content.template);
          if (controller.compileCellTemplate) {
            controller.compileCellTemplate(instanceElement.contents());
          } else {
            $compile(instanceElement.contents())(scope);
          }
        } else {
          // clear the cell content.
          instanceElement.html('');
        }
      });
      // triggered by an event outside of the angular world.
      (<any>scope).dragStart = (): void => {
        // let the event finish before messing with the element that triggered it.
        $timeout((): void => {
          // back in the angular world, now remove the cell from the layout.
          controller.remove((<any>scope).cell.id);
        }, 0);
      };
    }
  }

  angular.module('tableLayout').directive('tableLayoutCell', directive);
})();
