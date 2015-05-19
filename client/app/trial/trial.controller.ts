module app.trial {
  'use strict';
  export interface IUsedField {
    id: number;
    type: string;
  }
  export interface ITrialController {
    name: string;
    editMode: boolean;
    tableLayout: components.tableLayout.ITableLayout;
    fieldSets: components.tableLayout.ITableCellContent[];
    fields: components.tableLayout.ITableCellContent[];
    usedFields: IUsedField[];
    selectedCell: components.tableLayout.ITableCell;
    loadTableLayout(): void;
    getEmptyTableLayout(): components.tableLayout.ITableLayout;
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
    fieldSets: components.tableLayout.ITableCellContent[];
    fields: components.tableLayout.ITableCellContent[];
    usedFields: IUsedField[];
    selectedCell: components.tableLayout.ITableCell;
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
          this.fieldSets.forEach((fieldset: components.tableLayout.ITableCellContent): void => {
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
          var fieldSet: components.tableLayout.ITableCellContent = _.find(vm.fieldSets, {id: cell.content.id});
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
          var fieldSet: components.tableLayout.ITableCellContent = _.find(vm.fieldSets, {id: cell.content.id});
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

      vm.loadTableLayout();

      vm.name = 'Trial';
      vm.fieldSets = [
        {
          id: 1,
          template: components.formLayout.fieldsetTemplate,
          data: {legend: 'One', layout: vm.getEmptyTableLayout()}
        },
        {
          id: 2,
          template: components.formLayout.fieldsetTemplate,
          data: {legend: 'Two', layout: vm.getEmptyTableLayout()}
        }
      ];
      vm.fields = [
        {id: 1, template: components.formLayout.fieldTemplate, data: {label: 'Een', value: 'Eins'}},
        {id: 2, template: components.formLayout.fieldTemplate, data: {label: 'Twe', value: 'Zwei'}}
      ];
    }

    getEmptyTableLayout(): components.tableLayout.ITableLayout {
      return <components.tableLayout.ITableLayout> {
        cellType: 'field',
        selectedCell: null,
        tableCells: [],
        tableRows: [[null]]
      };
    }

    loadTableLayout(): void {
      this.tableLayout = <components.tableLayout.ITableLayout> {
        cellType: 'fieldset',
        selectedCell: null,
        tableCells: [
          // {rowSpan: 1, colSpan: 1, id: 11, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 13, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 14, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 21, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 3, colSpan: 2, id: 22, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 31, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 34, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 44, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 51, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 53, template: '<div>{{vm.name}}</div>'},
          // {rowSpan: 1, colSpan: 1, id: 54, template: '<div>{{vm.name}}</div>'}
        ],
        tableRows: [
          [null]
          // [11, null, 13, 14],
          // [21, 22, 22, null],
          // [31, 22, 22, 34],
          // [null, 22, 22, 44],
          // [51, null, 53, 54]
        ]
      };
    }
  }
  angular.module('app').controller('app.trial.TrialController', TrialController);
}
