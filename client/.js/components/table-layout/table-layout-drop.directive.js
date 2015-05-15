/* tslint:disable:no-string-literal */
(function () {
    'use strict';
    directive.$inject = ['$parse', 'dragDropService'];
    function directive($parse, dragDropService) {
        return {
            restrict: 'A',
            require: '^tableLayout',
            link: link
        };
        function link(scope, instanceElement, instanceAttributes, controller, transclude) {
            instanceElement.on('dragenter', function (eventObject) {
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                var data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                var dragEvent = eventObject;
                if (dragEvent.dataTransfer.effectAllowed === 'move') {
                    instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
                    dragEvent.preventDefault();
                }
            });
            instanceElement.on('dragover', function (eventObject) {
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                var data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                var dragEvent = eventObject;
                if (dragEvent.dataTransfer.effectAllowed === 'move') {
                    instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
                    var tableRowIndex = scope.$parent.$index;
                    var tableColIndex = controller.colIndexToTableColIndex(tableRowIndex, scope.$index);
                    if (controller.layout.tableRows[tableRowIndex][tableColIndex]) {
                        var side = calcSide(instanceElement, eventObject);
                        switch (side) {
                            case 'left':
                                instanceElement.addClass('drag-over-left');
                                break;
                            case 'top':
                                instanceElement.addClass('drag-over-top');
                                break;
                            case 'right':
                                instanceElement.addClass('drag-over-right');
                                break;
                            case 'bottom':
                                instanceElement.addClass('drag-over-bottom');
                                break;
                        }
                        dragEvent.preventDefault();
                    }
                    else {
                        instanceElement.addClass('drag-over-all');
                        dragEvent.preventDefault();
                    }
                }
            });
            var data;
            instanceElement.on('dragleave', function (eventObject) {
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                var dragEvent = eventObject;
                if (dragEvent.dataTransfer.effectAllowed === 'move') {
                    instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
                    dragEvent.preventDefault();
                }
            });
            instanceElement.on('drop', function (eventObject) {
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                var dragEvent = eventObject;
                if (dragEvent.dataTransfer.effectAllowed === 'move') {
                    instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
                    data = dragDropService.getData();
                    var side = calcSide(instanceElement, eventObject);
                    scope.$apply(function () {
                        controller.drop(scope.$parent.$index, scope.$index, side, data);
                    });
                    dragEvent.preventDefault();
                }
            });
            instanceElement.on('click', function (eventObject) {
                scope.$apply(function () {
                    controller.layout.selectedCell = angular.copy(scope.cell);
                });
                eventObject.preventDefault();
                eventObject.stopPropagation();
            });
        }
    }
    function calcSide(instanceElement, eventObject) {
        var mouseX = eventObject.clientX;
        var mouseY = eventObject.clientY;
        var rectObject = instanceElement[0].getBoundingClientRect();
        var left = (mouseX - rectObject.left) / rectObject.width;
        var right = (rectObject.right - mouseX) / rectObject.width;
        var top = (mouseY - rectObject.top) / rectObject.height;
        var bottom = (rectObject.bottom - mouseY) / rectObject.height;
        instanceElement.css({ 'borderLeft': '', 'borderTop': '', 'borderRight': '', 'borderBottom': '' });
        if (left < right && left < top && left < bottom) {
            return 'left';
        }
        if (top < left && top < right && top < bottom) {
            return 'top';
        }
        if (right < left && right < top && right < bottom) {
            return 'right';
        }
        if (bottom < left && bottom < top && bottom < right) {
            return 'bottom';
        }
    }
    ;
    angular.module('tableLayout').directive('tableLayoutDrop', directive);
})();
//# sourceMappingURL=table-layout-drop.directive.js.map