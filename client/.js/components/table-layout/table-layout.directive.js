(function () {
    'use strict';
    directive.$inject = [];
    function directive() {
        return {
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
        function link(scope, instanceElement, instanceAttributes, controller, transclude) {
            scope.$watch(function () {
                return controller.layout ? controller.layout.tableRows.toString() : null;
            }, function (newValue, oldValue) {
                if (newValue) {
                    controller.update(instanceElement.innerWidth());
                }
            });
            scope.$watch(function () {
                return controller.layout ? controller.layout.selectedCell : null;
            }, function (newValue, oldValue) {
                if (newValue && oldValue && newValue.id === oldValue.id && newValue.colSpan && newValue.rowSpan) {
                    var tableCell = controller.getTableCell(newValue.id);
                    controller.updateSelectedSpan(newValue.colSpan - tableCell.colSpan, newValue.rowSpan - tableCell.rowSpan);
                }
            }, true);
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