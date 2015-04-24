var components;
(function (components) {
    var dragDrop;
    (function (dragDrop) {
        'use strict';
        var DragDropService = (function () {
            function DragDropService() {
                this.type = '';
                this.data = null;
            }
            DragDropService.prototype.getType = function () {
                return this.type;
            };
            DragDropService.prototype.setType = function (type) {
                this.type = type;
            };
            DragDropService.prototype.getData = function () {
                return this.data;
            };
            DragDropService.prototype.setData = function (data) {
                this.data = data;
            };
            return DragDropService;
        })();
        angular.module('dragDrop').service('dragDropService', DragDropService);
    })(dragDrop = components.dragDrop || (components.dragDrop = {}));
})(components || (components = {}));
//# sourceMappingURL=drag-drop.service.js.map