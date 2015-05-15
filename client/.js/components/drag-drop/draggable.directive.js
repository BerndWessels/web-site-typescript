/* tslint:disable:no-string-literal */
(function () {
    'use strict';
    directive.$inject = ['$parse', 'dragDropService'];
    function directive($parse, dragDropService) {
        return {
            priority: -1000,
            restrict: 'A',
            link: link
        };
        function link(scope, instanceElement, instanceAttributes) {
            instanceElement.on('dragstart', function (eventObject) {
                var dragEvent = eventObject;
                var dragEffect = $parse(instanceAttributes['dragEffect'])(scope);
                var dragType = $parse(instanceAttributes['dragType'])(scope);
                var dragData = $parse(instanceAttributes['dragData'])(scope);
                var dragStart = $parse(instanceAttributes['dragStart'])(scope);
                dragEvent.dataTransfer.effectAllowed = dragEffect;
                dragEvent.dataTransfer.setData('text', '');
                dragDropService.setType(dragType);
                dragDropService.setData(dragData);
                if (dragStart) {
                    dragStart(dragEffect, dragType, dragData, instanceElement);
                }
                eventObject.stopPropagation();
                return false;
            });
            instanceElement.on('dragend', function (eventObject) {
                var dragEffect = $parse(instanceAttributes['dragEffect'])(scope);
                var dragType = $parse(instanceAttributes['dragType'])(scope);
                var dragData = $parse(instanceAttributes['dragData'])(scope);
                var dragEnd = $parse(instanceAttributes['dragEnd'])(scope);
                dragDropService.setType(null);
                dragDropService.setData(null);
                if (dragEnd) {
                    dragEnd(dragEffect, dragType, dragData, instanceElement);
                }
                eventObject.stopPropagation();
                return false;
            });
        }
    }
    angular.module('dragDrop').directive('draggable', directive);
})();
//# sourceMappingURL=draggable.directive.js.map