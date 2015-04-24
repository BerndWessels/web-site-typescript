((): void => {
  'use strict';
  directive.$inject = ['$timeout'];
  function directive($timeout: ng.ITimeoutService): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'EAC',
      require: '^tableLayout',
      scope: false,
      link: link,
      template: '<div>{{cell.id}}</div>'
    };
    function link(scope: ng.IScope,
                  instanceElement: ng.IAugmentedJQuery,
                  instanceAttributes: ng.IAttributes,
                  controller: components.tableLayout.ITableLayoutController,
                  transclude: ng.ITranscludeFunction): void {
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
