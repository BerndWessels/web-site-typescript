/**
 * This is a directive that helps you dynamically create table layouts with row and col span.
 */
(function () {
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
    function directive($interval) {
        return {
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
        function link(scope, instanceElement, instanceAttributes, controller, transclude) {
            // update the render-matrix whenever the layout changes.
            scope.$watch(function () {
                return controller.layout ? controller.layout.tableRows.toString() : null;
            }, function (newValue, oldValue) {
                if (newValue) {
                    controller.update(instanceElement.innerWidth());
                }
            });
            // update the selected cell span whenever it changes.
            scope.$watch(function () {
                return controller.layout ? controller.layout.selectedCell : null;
            }, function (newValue, oldValue) {
                if (newValue && oldValue && newValue.id === oldValue.id && newValue.colSpan && newValue.rowSpan) {
                    var tableCell = controller.getTableCell(newValue.id);
                    controller.updateSelectedSpan(newValue.colSpan - tableCell.colSpan, newValue.rowSpan - tableCell.rowSpan);
                }
            }, true);
            // update the render-matrix whenever the table-layout width changes.
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
    // register the directive.
    angular.module('tableLayout').directive('tableLayout', directive);
})();
//# sourceMappingURL=table-layout.directive.js.map