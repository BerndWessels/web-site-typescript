/* tslint:disable:max-line-length */
module app.trial {
'use strict';
  export var trialTemplate: string = '<!--<form><fieldset><legend>Legend</legend><div class="form-group form-group-sm"><label for="textInput">Text Input</label><div class="input-group input-group-sm"><span class="input-group-btn"><button type="button" class="btn btn-default" ng-click="trialCtrl.open($event)"><i class="glyphicon glyphicon-calendar"></i></button></span><input type="text" id="textInput" class="form-control" placeholder="text input"><span class="input-group-addon" id="basic-addon2">@example.com</span></div></div><div class="form-group"><div class="input-group"><label for="textInput">Text Input</label><input type="text" id="textInput" class="form-control" placeholder="text input"></div></div><div class="form-group form-group-lg"><div class="input-group input-group-lg"><label for="textInput">Text Input</label><input type="text" id="textInput" class="form-control" placeholder="text input"></div></div></fieldset></form><hr/>--><label>binding</label><input type="text" ng-model="trialCtrl.name"/><label>rowspan</label><input type="number" ng-model="trialCtrl.tableLayout.selectedCell.rowSpan" min="1"/><label>colspan</label><input type="number" ng-model="trialCtrl.tableLayout.selectedCell.colSpan" min="1"/><hr/><table-layout layout="trialCtrl.tableLayout" select-cell="trialCtrl.selectCell" allow-content="trialCtrl.allowContent"              added-content="trialCtrl.addedContent"              removed-content="trialCtrl.removedContent"              style="display: block; width: 400px; box-sizing: border-box;"></table-layout><hr/><ul><li ng-repeat="fieldSet in trialCtrl.fieldSets" draggable="true" drag-effect="\'move\'" drag-type="\'fieldset\'"      drag-data="fieldSet">    {{fieldSet.id}}</li></ul><hr/><ul><li ng-repeat="field in trialCtrl.fields" draggable="true" drag-effect="\'move\'" drag-type="\'field\'"      drag-data="field"><label>{{field.data.label}}</label><input type="text" ng-model="field.data.value"></li></ul><ul><li ng-repeat="field in trialCtrl.usedFields">    {{field.id}} - {{field.type}}</li></ul>';
}
