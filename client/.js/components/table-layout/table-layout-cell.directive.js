(function () {
    'use strict';
    directive.$inject = ['$timeout'];
    function directive($timeout) {
        return {
            restrict: 'EAC',
            require: '^tableLayout',
            scope: false,
            link: link,
            template: '<div>{{cell.id}}</div>'
        };
        function link(scope, instanceElement, instanceAttributes, controller, transclude) {
            // triggered by an event outside of the angular world.
            scope.dragStart = function () {
                // let the event finish before messing with the element that triggered it.
                $timeout(function () {
                    // back in the angular world, now remove the cell from the layout.
                    controller.remove(scope.cell.id);
                }, 0);
            };
        }
    }
    angular.module('tableLayout').directive('tableLayoutCell', directive);
})();
//# sourceMappingURL=table-layout-cell.directive.js.map