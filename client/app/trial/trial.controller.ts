module app.trial {
  'use strict';
  export interface ITrialController {
    name: string;
    tableLayout: components.tableLayout.ITableLayout;
    outers: any[];
  }
  export class TrialController implements ITrialController {
    static $inject: string[] = [];
    name: string;
    tableLayout: components.tableLayout.ITableLayout;
    outers: any[];

    constructor() {
      var vm: ITrialController = this;
      vm.name = 'Trial';
      vm.tableLayout = <components.tableLayout.ITableLayout> {
        selectedCell: null, // {rowSpan: 1, colSpan: 1, id: 13},
        tableCells: [
          {rowSpan: 1, colSpan: 1, id: 11},
          {rowSpan: 1, colSpan: 1, id: 13},
          {rowSpan: 1, colSpan: 1, id: 14},
          {rowSpan: 1, colSpan: 1, id: 21},
          {rowSpan: 3, colSpan: 2, id: 22},
          {rowSpan: 1, colSpan: 1, id: 31},
          {rowSpan: 1, colSpan: 1, id: 34},
          {rowSpan: 1, colSpan: 1, id: 44},
          {rowSpan: 1, colSpan: 1, id: 51},
          {rowSpan: 1, colSpan: 1, id: 53},
          {rowSpan: 1, colSpan: 1, id: 54}
        ],
        tableRows: [
          [11, null, 13, 14],
          [21, 22, 22, null],
          [31, 22, 22, 34],
          [null, 22, 22, 44],
          [51, null, 53, 54]
        ]
      };
      vm.outers = [{name: 'a'}, {name: 'b'}, {name: 'c'}, {name: 'd'}, {name: 'e'}, {name: 'f'}];
    }
  }
  angular.module('app').controller('app.trial.TrialController', TrialController);
}
