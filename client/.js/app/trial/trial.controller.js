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
                this.tableLayout = this.getEmptyTableLayout('fieldset');
                vm.name = 'Trial';
                vm.fieldSets = [
                    {
                        id: 1,
                        template: components.formLayout.fieldsetTemplate,
                        data: { legend: 'One', layout: vm.getEmptyTableLayout('field') }
                    },
                    {
                        id: 2,
                        template: components.formLayout.fieldsetTemplate,
                        data: { legend: 'Two', layout: vm.getEmptyTableLayout('field') }
                    }
                ];
                vm.addFieldSet = function () {
                    vm.fieldSets.push({
                        id: new Date().getTime(),
                        template: components.formLayout.fieldsetTemplate,
                        data: { legend: 'untitled', layout: vm.getEmptyTableLayout('field') }
                    });
                };
                vm.fields = [
                    { id: 1, template: components.formLayout.fieldTemplate, data: { category: 'Odd', label: 'One', value: '1' } },
                    { id: 2, template: components.formLayout.fieldTemplate, data: { category: 'Even', label: 'Two', value: '2' } },
                    { id: 3, template: components.formLayout.fieldTemplate, data: { category: 'Odd', label: 'Three', value: '3' } },
                    { id: 4, template: components.formLayout.fieldTemplate, data: { category: 'Even', label: 'Four', value: '4' } },
                    { id: 5, template: components.formLayout.fieldTemplate, data: { category: 'Odd', label: 'Five', value: '5' } },
                    { id: 6, template: components.formLayout.fieldTemplate, data: { category: 'Even', label: 'Six', value: '6' } },
                    { id: 7, template: components.formLayout.fieldTemplate, data: { category: 'Odd', label: 'Seven', value: '7' } },
                    { id: 8, template: components.formLayout.fieldTemplate, data: { category: 'Even', label: 'Eight', value: '8' } },
                    { id: 9, template: components.formLayout.fieldTemplate, data: { category: 'Odd', label: 'Nine', value: '9' } },
                    { id: 10, template: components.formLayout.fieldTemplate, data: { category: 'Even', label: 'Ten', value: '10' } },
                ];
                vm.groupedFields = _.chain(vm.fields).groupBy(function (field) {
                    return field.data.category;
                }).pairs().map(function (item) {
                    return { category: item[0], fields: item[1] };
                }).value();
            }
            TrialController.prototype.getEmptyTableLayout = function (cellType) {
                return {
                    cellType: cellType,
                    selectedCell: null,
                    tableCells: [],
                    tableRows: [[null]]
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