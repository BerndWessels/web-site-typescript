(function () {
    'use strict';
    directive.$inject = [];
    function directive() {
        return {
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
        function link(scope, instanceElement, instanceAttributes, controller, transclude) {
            scope.$watch(function () {
                return controller.layout.toString(); // todo: split to distingish between selectedCell change and other changes.
            }, function (newValue, oldValue) {
                if (newValue) {
                    controller.update(instanceElement.innerWidth());
                }
            });
            scope.$watch(function () {
                return instanceElement.innerWidth();
            }, function (newValue, oldValue) {
                if (newValue) {
                    controller.update(newValue);
                }
            });
        }
    }
    angular.module('tableLayout').directive('tableLayout', directive);
})();
//# sourceMappingURL=table-layout.directive.js.map