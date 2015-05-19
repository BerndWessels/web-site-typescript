var app;
(function (app) {
    var trial;
    (function (trial) {
        'use strict';
        var TrialController = (function () {
            function TrialController($scope, $compile) {
                var _this = this;
                this.$scope = $scope;
                this.$compile = $compile;
                this.editMode = true;
                var vm = this;
                vm.name = 'Bernd';
                // todo: not used in this case.
                vm.compileTableLayoutCellTemplate = function (element) {
                    // $compile(element)($scope);
                    console.log(element);
                };
                vm.selectCell = function (layout, cell) {
                    if (_this.editMode) {
                        _this.tableLayout.selectedCell = null;
                        _this.fieldSets.forEach(function (fieldset) {
                            fieldset.data.layout.selectedCell = null;
                        });
                        var selectedCell = angular.copy(cell);
                        layout.selectedCell = selectedCell;
                        _this.selectedCell = selectedCell;
                    }
                };
                vm.allowContent = function (layout, content) {
                    if (layout.cellType === 'field') {
                        return false;
                    }
                    return _.some(vm.usedFields, function (usedField) {
                        return usedField.id === content.id && usedField.type === layout.cellType;
                    });
                };
                vm.addedContent = function (layout, cell) {
                    if (layout.cellType === 'fieldset') {
                        var fieldSet = _.find(vm.fieldSets, { id: cell.content.id });
                        if (fieldSet) {
                            _.forEach(fieldSet.data.layout.tableCells, function (tableCell) {
                                vm.usedFields.push({ id: tableCell.content.id, type: 'field' });
                            });
                        }
                    }
                    if (!_this.allowContent(layout, cell.content)) {
                        vm.usedFields.push({ id: cell.content.id, type: layout.cellType });
                    }
                };
                vm.removedContent = function (layout, cell) {
                    if (layout.cellType === 'fieldset') {
                        var fieldSet = _.find(vm.fieldSets, { id: cell.content.id });
                        if (fieldSet) {
                            _.forEach(fieldSet.data.layout.tableCells, function (tableCell) {
                                vm.usedFields = _.without(vm.usedFields, _.findWhere(vm.usedFields, {
                                    id: tableCell.content.id,
                                    type: fieldSet.data.layout.cellType
                                }));
                            });
                        }
                    }
                    vm.usedFields = _.without(vm.usedFields, _.findWhere(vm.usedFields, {
                        id: cell.content.id,
                        type: layout.cellType
                    }));
                };
                vm.usedFields = [];
                vm.loadTableLayout();
                vm.name = 'Trial';
                vm.fieldSets = [
                    {
                        id: 1,
                        template: components.formLayout.fieldsetTemplate,
                        data: { legend: 'One', layout: vm.getEmptyTableLayout() }
                    },
                    {
                        id: 2,
                        template: components.formLayout.fieldsetTemplate,
                        data: { legend: 'Two', layout: vm.getEmptyTableLayout() }
                    }
                ];
                vm.fields = [
                    { id: 1, template: components.formLayout.fieldTemplate, data: { label: 'Een', value: 'Eins' } },
                    { id: 2, template: components.formLayout.fieldTemplate, data: { label: 'Twe', value: 'Zwei' } }
                ];
            }
            TrialController.prototype.getEmptyTableLayout = function () {
                return {
                    cellType: 'field',
                    selectedCell: null,
                    tableCells: [],
                    tableRows: [[null]]
                };
            };
            TrialController.prototype.loadTableLayout = function () {
                this.tableLayout = {
                    cellType: 'fieldset',
                    selectedCell: null,
                    tableCells: [
                    ],
                    tableRows: [
                        [null]
                    ]
                };
            };
            TrialController.$inject = ['$scope', '$compile'];
            return TrialController;
        })();
        trial.TrialController = TrialController;
        angular.module('app').controller('app.trial.TrialController', TrialController);
    })(trial = app.trial || (app.trial = {}));
})(app || (app = {}));
//# sourceMappingURL=trial.controller.js.map