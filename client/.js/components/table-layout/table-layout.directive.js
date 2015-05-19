(function () {
    'use strict';
    directive.$inject = ['$interval'];
    function directive($interval) {
        return {
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
            var width = 0;
            var interval = $interval(function () {
                var newWidth = instanceElement.innerWidth();
                if (width !== newWidth) {
                    width = newWidth;
                    controller.update(width);
                }
            }, 100);
            scope.$on('$destroy', function () {
                $interval.cancel(interval);
            });
        }
    }
    angular.module('tableLayout').directive('tableLayout', directive);
})();
//# sourceMappingURL=table-layout.directive.js.map