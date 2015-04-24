/* tslint:disable:max-line-length */
var app;
(function (app) {
    var trial;
    (function (trial) {
        'use strict';
        trial.trialTemplate = '<div draggable="true">{{vm.name}}</div><label>rowspan</label><input type="number" ng-model="vm.tableLayout.selectedCell.rowSpan" /><label>colspan</label><input type="number" ng-model="vm.tableLayout.selectedCell.colSpan" /><hr/><table-layout layout="vm.tableLayout" style="display: block; width: 400px; box-sizing: border-box;"></table-layout><hr/><ul><li ng-repeat="outer in vm.outers" draggable="true" drag-effect="\'move\'" drag-type="\'outer\'" drag-data="outer.name">    {{outer.name}}</li></ul>';
    })(trial = app.trial || (app.trial = {}));
})(app || (app = {}));
//# sourceMappingURL=trial.template.html.js.map