/* tslint:disable:max-line-length */
var components;
(function (components) {
    var tableLayout;
    (function (tableLayout) {
        'use strict';
        tableLayout.tableLayoutTemplate = '<table ng-class="{\'edit-mode\': vm.editMode}"><tbody><tr ng-repeat="row in vm.rows track by $index"><td ng-repeat="cell in row track by $index" colspan="{{cell.colSpan}}" rowspan="{{cell.rowSpan}}"        ng-class="{selected: cell !== null && cell.id === vm.layout.selectedCell.id}"        table-layout-drop="vm.layout.cellType"><table-layout-cell ng-style="{\'width\': cell ? (cell.colSpan * vm.colWidth) + (cell.colSpan - 1) : vm.colWidth}"                         draggable="{{vm.editMode}}" drag-start="dragStart" drag-effect="\'move\'" drag-type="vm.layout.cellType"                         drag-data="cell.content"></table-layout-cell></td></tr></tbody></table><!--<hr/><table><tbody><tr ng-repeat="tableRow in vm.layout.tableRows track by $index"><td ng-repeat="tableCellId in tableRow track by $index"><table-cell>        {{tableCellId}}</table-cell></td></tr></tbody></table>-->';
    })(tableLayout = components.tableLayout || (components.tableLayout = {}));
})(components || (components = {}));
//# sourceMappingURL=table-layout.template.html.js.map