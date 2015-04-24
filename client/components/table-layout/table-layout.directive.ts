((): void => {
  'use strict';
  directive.$inject = [];
  function directive(): ng.IDirective {
    return <ng.IDirective> {
      restrict: 'EAC',
      scope: {
        layout: '='
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
        return controller.layout.toString(); // todo: split to distingish between selectedCell change and other changes.
      }, (newValue: any, oldValue: any) => {
        if (newValue) {
          controller.update(instanceElement.innerWidth());
        }
      });
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
