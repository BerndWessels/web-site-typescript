/* tslint:disable:max-line-length */
module components.tableLayout {
'use strict';
  export var tableLayoutTemplate: string = '<table><tbody><tr ng-repeat="row in vm.rows track by $index"><td ng-repeat="cell in row track by $index" colspan="{{cell.colSpan}}" rowspan="{{cell.rowSpan}}"        table-layout-drop="\'tableLayoutCell\'"><table-layout-cell ng-class="{selected: cell !== null && cell.id === vm.layout.selectedCell.id}"                         ng-style="{\'width\': cell ? cell.colSpan * vm.colWidth : vm.colWidth}"                         draggable="true" drag-start="dragStart" drag-effect="\'move\'" drag-type="\'tableLayoutCell\'"                         drag-data="cell.id"></table-layout-cell></td></tr></tbody></table><hr/><table><tbody><tr ng-repeat="tableRow in vm.layout.tableRows track by $index"><td ng-repeat="tableCellId in tableRow track by $index"><table-cell>        {{tableCellId}}</table-cell></td></tr></tbody></table><hr/><div>{{vm.layout.tableRows}}</div>';
}
