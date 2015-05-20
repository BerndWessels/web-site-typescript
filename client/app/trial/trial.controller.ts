module app.trial {
  'use strict';
  export interface IUsedField {
    id: number;
    type: string;
  }
  export interface IFieldSetData {
    // category: string;
    legend: string;
    layout: components.tableLayout.ITableLayout;
  }
  export interface IFieldSet extends components.tableLayout.ITableCellContent {
    data: IFieldSetData;
  }
  export interface IFieldData {
    category: string;
    label: string;
    value: string; // todo : not here - extend to allow multiple types like ITextFieldData, INumericFieldData, ...
  }
  export interface IField extends components.tableLayout.ITableCellContent {
    data: IFieldData;
  }
  export interface ITrialController {
    name: string;
    editMode: boolean;
    tableLayout: components.tableLayout.ITableLayout;
    fieldSets: IFieldSet[];
    fields: IField[];
    groupedFields: any;
    usedFields: IUsedField[];
    selectedCell: components.tableLayout.ITableCell;
    addFieldSet(): void;
    getEmptyTableLayout(cellType: string): components.tableLayout.ITableLayout;
    compileTableLayoutCellTemplate(element: JQuery): void;
    selectCell(layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void;
    allowContent(layout: components.tableLayout.ITableLayout, content: components.tableLayout.ITableCellContent): boolean;
    addedContent(layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void;
    removedContent(layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void;
  }
  export class TrialController implements ITrialController {
    static $inject: string[] = ['$scope', '$compile'];
    name: string;
    editMode: boolean = true;
    tableLayout: components.tableLayout.ITableLayout;
    fieldSets: IFieldSet[];
    fields: IField[];
    groupedFields: any;
    usedFields: IUsedField[];
    selectedCell: components.tableLayout.ITableCell;
    addFieldSet: () => void;
    compileTableLayoutCellTemplate: (element: JQuery) => void;
    selectCell: (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell) => void;
    allowContent: (layout: components.tableLayout.ITableLayout, content: components.tableLayout.ITableCellContent) => boolean;
    addedContent: (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell) => void;
    removedContent: (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell) => void;

    constructor(private $scope: ng.IScope, private $compile: ng.ICompileService) {
      var vm: ITrialController = <any>this;

      vm.name = 'Bernd';

      // todo: not used in this case.
      vm.compileTableLayoutCellTemplate = (element: JQuery): void => {
        // $compile(element)($scope);
        console.log(element);
      };
      vm.selectCell = (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void => {
        if (this.editMode) {
          this.tableLayout.selectedCell = null;
          this.fieldSets.forEach((fieldset: IFieldSet): void => {
            fieldset.data.layout.selectedCell = null;
          });
          var selectedCell: components.tableLayout.ITableCell = angular.copy(cell);
          layout.selectedCell = selectedCell;
          this.selectedCell = selectedCell;
        }
      };

      vm.allowContent = (layout: components.tableLayout.ITableLayout, content: components.tableLayout.ITableCellContent): boolean => {
        if (layout.cellType === 'field') {
          return false;
        }
        return _.some(vm.usedFields, (usedField: IUsedField): boolean => {
          return usedField.id === content.id && usedField.type === layout.cellType;
        });
      };
      vm.addedContent = (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void => {
        if (layout.cellType === 'fieldset') {
          var fieldSet: IFieldSet = _.find(vm.fieldSets, {id: cell.content.id});
          if (fieldSet) {
            _.forEach(fieldSet.data.layout.tableCells, (tableCell: components.tableLayout.ITableCell): void => {
              vm.usedFields.push({id: tableCell.content.id, type: 'field'});
            });
          }
        }
        if (!this.allowContent(layout, cell.content)) {
          vm.usedFields.push({id: cell.content.id, type: layout.cellType});
        }
      };
      vm.removedContent = (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void => {
        if (layout.cellType === 'fieldset') {
          var fieldSet: IFieldSet = _.find(vm.fieldSets, {id: cell.content.id});
          if (fieldSet) {
            _.forEach(fieldSet.data.layout.tableCells, (tableCell: components.tableLayout.ITableCell): void => {
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
          data: {legend: 'One', layout: vm.getEmptyTableLayout('field')}
        },
        {
          id: 2,
          template: components.formLayout.fieldsetTemplate,
          data: {legend: 'Two', layout: vm.getEmptyTableLayout('field')}
        }
      ];
      vm.addFieldSet = (): void => {
        vm.fieldSets.push({
          id: new Date().getTime(),
          template: components.formLayout.fieldsetTemplate,
          data: {legend: 'untitled', layout: vm.getEmptyTableLayout('field')}
        });
      };
      vm.fields = [
        {id: 1, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'One', value: '1'}},
        {id: 2, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Two', value: '2'}},
        {id: 3, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'Three', value: '3'}},
        {id: 4, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Four', value: '4'}},
        {id: 5, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'Five', value: '5'}},
        {id: 6, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Six', value: '6'}},
        {id: 7, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'Seven', value: '7'}},
        {id: 8, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Eight', value: '8'}},
        {id: 9, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'Nine', value: '9'}},
        {id: 10, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Ten', value: '10'}},
      ];
      vm.groupedFields = _.chain(vm.fields)
        .groupBy((field: IField): string => {
          return field.data.category;
        })
        .pairs()
        .map((item: any): any => {
          return {category: item[0], fields: item[1]};
        })
        .value();
    }

    getEmptyTableLayout(cellType: string): components.tableLayout.ITableLayout {
      return <components.tableLayout.ITableLayout> {
        cellType: cellType,
        selectedCell: null,
        tableCells: [],
        tableRows: [[null]]
      };
    }

  }
  angular.module('app').controller('app.trial.TrialController', TrialController);
}
