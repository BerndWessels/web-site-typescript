/* tslint:disable:no-string-literal */
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
    directive.$inject = ['$parse', 'dragDropService'];
    /**
     * This is the directive constructor that takes the injected dependencies.
     *
     * @param $parse Injected parse service dependency.
     * @param dragDropService Injected drag drop service dependency.
     * @returns {ng.IDirective}
     */
    function directive($parse, dragDropService) {
        return {
            restrict: 'A',
            require: '^tableLayout',
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
            // process the drag-enter event.
            instanceElement.on('dragenter', function (eventObject) {
                if (!controller.editMode) {
                    return;
                }
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                var data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                // reset the dragging indicator classes.
                var dragEvent = eventObject;
                if (dragEvent.dataTransfer.effectAllowed === 'move') {
                    instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
                    dragEvent.preventDefault();
                }
            });
            // process the drag-over event.
            instanceElement.on('dragover', function (eventObject) {
                if (!controller.editMode) {
                    return;
                }
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                var data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                // set the dragging indicator class.
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
            // process the drag-leave event.
            var data;
            instanceElement.on('dragleave', function (eventObject) {
                if (!controller.editMode) {
                    return;
                }
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                // reset the dragging indicator classes.
                var dragEvent = eventObject;
                if (dragEvent.dataTransfer.effectAllowed === 'move') {
                    instanceElement.removeClass('drag-over-left drag-over-top drag-over-right drag-over-bottom drag-over-all');
                    dragEvent.preventDefault();
                }
            });
            // process the drop event.
            instanceElement.on('drop', function (eventObject) {
                if (!controller.editMode) {
                    return;
                }
                if (dragDropService.getType() !== $parse(instanceAttributes['tableLayoutDrop'])(scope)) {
                    return;
                }
                data = dragDropService.getData();
                if (controller.allowContent(controller.layout, data)) {
                    return;
                }
                // reset the dragging indicator and call the controller.
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
            // process the click event.
            instanceElement.on('click', function (eventObject) {
                if (!controller.editMode) {
                    return;
                }
                // select or deselect the cell.
                scope.$apply(function () {
                    var deselect = eventObject.ctrlKey;
                    if (controller.selectCell) {
                        controller.selectCell(controller.layout, deselect ? null : scope.cell);
                    }
                    else {
                        controller.layout.selectedCell = deselect ? null : angular.copy(scope.cell);
                    }
                });
                eventObject.preventDefault();
                eventObject.stopPropagation();
            });
        }
    }
    /**
     * This calculates the nearest side to the dragging cursor.
     *
     * @param instanceElement
     * @param eventObject
     * @returns {any}
     */
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
    // register the directive.
    angular.module('tableLayout').directive('tableLayoutDrop', directive);
})();
//# sourceMappingURL=table-layout-drop.directive.js.map