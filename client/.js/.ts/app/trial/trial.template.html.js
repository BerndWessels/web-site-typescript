/* tslint:disable:max-line-length */
var app;
(function (app) {
    var trial;
    (function (trial) {
        'use strict';
        trial.trialTemplate = '<label>binding</label><input type="text" ng-model="vm.name" /><label>rowspan</label><input type="number" ng-model="vm.tableLayout.selectedCell.rowSpan" min="1" /><label>colspan</label><input type="number" ng-model="vm.tableLayout.selectedCell.colSpan" min="1" /><hr/><table-layout layout="vm.tableLayout" style="display: block; width: 400px; box-sizing: border-box;"></table-layout><hr/><ul><li ng-repeat="outer in vm.outers" draggable="true" drag-effect="\'move\'" drag-type="\'tableLayoutCell\'" drag-data="outer">    {{outer.id}}</li></ul>';
    })(trial = app.trial || (app.trial = {}));
})(app || (app = {}));
//# sourceMappingURL=trial.template.html.js.map