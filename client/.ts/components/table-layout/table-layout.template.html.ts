/* tslint:disable:max-line-length */
module components.tableLayout {
'use strict';
  export var tableLayoutTemplate: string = '<table ng-class="{\'edit-mode\': vm.editMode}"><tbody><tr ng-repeat="row in vm.rows track by $index"><td ng-repeat="cell in row track by $index"        colspan="{{cell.colSpan}}"        rowspan="{{cell.rowSpan}}"        ng-class="{selected: cell !== null && cell.id === vm.layout.selectedCell.id}"        table-layout-drop="vm.layout.cellType"><table-layout-cell ng-style="{\'width\': cell ? (cell.colSpan * vm.colWidth) + (cell.colSpan - 1) : vm.colWidth}"                         draggable="{{vm.editMode}}"                         drag-start="dragStart"                         drag-effect="\'move\'"                         drag-type="vm.layout.cellType"                         drag-data="cell.content"></table-layout-cell></td></tr></tbody></table>';
}
