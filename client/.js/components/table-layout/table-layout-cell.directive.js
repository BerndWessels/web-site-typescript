/**
 * This is a directive that helps you dynamically create table layouts with row and col span.
 */
(function () {
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
    function directive($compile, $timeout) {
        return {
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
        function link(scope, instanceElement, instanceAttributes, controller, transclude) {
            // watch the cell content.
            scope.$watch(function () {
                return scope.cell;
            }, function (newValue, oldValue) {
                if (newValue) {
                    // render the cell template.
                    instanceElement.html(newValue.content.template);
                    if (controller.compileCellTemplate) {
                        controller.compileCellTemplate(instanceElement.contents());
                    }
                    else {
                        $compile(instanceElement.contents())(scope);
                    }
                }
                else {
                    // clear the cell content.
                    instanceElement.html('');
                }
            });
            // triggered by an event outside of the angular world.
            scope.dragStart = function () {
                // only in edit mode.
                if (!controller.editMode) {
                    return;
                }
                // let the event finish before messing with the element that triggered it.
                $timeout(function () {
                    // back in the angular world, now remove the cell from the layout.
                    controller.remove(scope.cell.id);
                }, 0);
            };
        }
    }
    // register the directive.
    angular.module('tableLayout').directive('tableLayoutCell', directive);
})();
//# sourceMappingURL=table-layout-cell.directive.js.map