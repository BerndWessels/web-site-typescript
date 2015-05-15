module components.tableLayout {
  'use strict';
  export interface ITableLayout {
    cellType: string;
    selectedCell: ITableCell;
    tableCells: ITableCell[];
    tableRows: number[][];
  }
  export interface ITableCell {
    id: number;
    content: ITableCellContent;
    rowSpan: number;
    colSpan: number;
  }
  export interface ITableCellContent {
    id: number;
    template: string;
    data: any;
  }
  export interface ITableLayoutController {
    layout: ITableLayout;
    rows: ITableCell[][];
    selectCell: (layout: ITableLayout, cell: ITableCell) => boolean;
    allowContent: (layout: ITableLayout, content: ITableCellContent) => boolean;
    addedContent: (layout: ITableLayout, cell: ITableCell) => void;
    removedContent: (layout: ITableLayout, cell: ITableCell) => void;
    update(tableWidth: number): void;
    drop(rowIndex: number, colIndex: number, side: string, data: any): void;
    remove(tableCellId: number): void;
    updateSelectedSpan(diffColSpan: number, diffRowSpan: number): void;
    getTableCell(id: number): ITableCell;
    getTemplateScope(): ng.IScope;
    compileCellTemplate(element: JQuery): void;
    colIndexToTableColIndex(tableRowIndex: number, colIndex: number): number;
  }
  class TableLayoutController implements ITableLayoutController {
    static $inject: string[] = ['$scope'];
    layout: ITableLayout;
    rows: ITableCell[][];
    selectCell: (layout: ITableLayout, cell: ITableCell) => boolean;
    allowContent: (layout: ITableLayout, content: ITableCellContent) => boolean;
    addedContent: (layout: ITableLayout, cell: ITableCell) => void;
    removedContent: (layout: ITableLayout, cell: ITableCell) => void;
    compileCellTemplate: (element: JQuery) => void;
    numCols: number;
    colWidth: number;
    tableWidth: number;

    constructor(private $scope: ng.IScope) {
      console.log();
    }

    getTemplateScope(): ng.IScope {
      return this.$scope.$parent;
    }

    getTableCell(id: number): ITableCell {
      return _.find(this.layout.tableCells, (tableCell: ITableCell) => {
        return tableCell.id === id;
      });
    }

    update(tableWidth: number): void {
      if (tableWidth <= 0) {
        return;
      }
      if (!this.layout) {
        return;
      }
      this.tableWidth = tableWidth;
      this.rows = <ITableCell[][]> [];
      var renderedCells: number[] = [];
      this.numCols = 0;
      this.layout.tableRows.forEach((tableRow: number[]) => {
        var row: ITableCell[] = [];
        tableRow.forEach((tableCellId: number) => {
          if (tableCellId === null) {
            row.push(null);
          } else if (renderedCells.indexOf(tableCellId) === -1) {
            renderedCells.push(tableCellId);
            row.push(this.getTableCell(tableCellId));
          }
        }, this);
        this.numCols = this.numCols > tableRow.length ? this.numCols : tableRow.length;
        this.colWidth = Math.floor((tableWidth - (this.numCols * 2)) / this.numCols);
        this.rows.push(row);
      }, this);
    }

    insertCol(tableColIndex: number): void {
      // remember cells with already extended colSpan.
      var extendedCells: number[] = [];
      // iterate through all rows.
      this.layout.tableRows.forEach((tableRow: number[], y: number) => {
        // dropping at the start/end is always a simple insert/append.
        if (tableColIndex === 0 || tableColIndex === tableRow.length) {
          tableRow.splice(tableColIndex, 0, null);
        } else {
          // if we are in the middle of a spanned cell we have to extend it.
          var prevTableCellId: number = tableRow[tableColIndex - 1];
          var thisTableCellId: number = tableRow[tableColIndex];
          if (prevTableCellId && thisTableCellId &&
            this.getTableCell(prevTableCellId) === this.getTableCell(thisTableCellId)) {
            // make sure we only increase the colSpan once.
            if (extendedCells.indexOf(thisTableCellId) === -1) {
              extendedCells.push(thisTableCellId);
              this.getTableCell(thisTableCellId).colSpan++;
            }
            tableRow.splice(tableColIndex, 0, thisTableCellId);
          } else {
            // insert a new empty cell at the drop index.
            tableRow.splice(tableColIndex, 0, null);
          }
        }
      }, this);
    }

    insertRow(tableRowIndex: number): void {
      // remember cells with already extended colSpan.
      var extendedCells: number[] = [];
      // insert the new row.
      this.layout.tableRows.splice(tableRowIndex, 0, []);
      // dropping at the start/end is always a simple insert/append.
      if (tableRowIndex === 0 || tableRowIndex === this.layout.tableRows.length - 1) {
        for (var x: number = 0; x < this.numCols; x++) {
          this.layout.tableRows[tableRowIndex].push(null);
        }
      } else {
        // iterate through all cols.
        this.layout.tableRows[tableRowIndex + 1].forEach((tableCellId: number, x: number) => {
          // if we are in the middle of a spanned cell we have to extend it.
          var prevTableCellId: number = tableRowIndex > 0 ? this.layout.tableRows[tableRowIndex - 1][x] : null;
          if (tableCellId && tableCellId === prevTableCellId) {
            // make sure we only increase the colSpan once.
            if (extendedCells.indexOf(tableCellId) === -1) {
              extendedCells.push(tableCellId);
              this.getTableCell(tableCellId).rowSpan++;
            }
            this.layout.tableRows[tableRowIndex].push(tableCellId);
          } else {
            // insert a new empty cell at the drop index.
            this.layout.tableRows[tableRowIndex].push(null);
          }
        }, this);
      }
    }

    colIndexToTableColIndex(tableRowIndex: number, colIndex: number): number {
      // transform the colIndex into a tableColIndex.
      var tableColIndex: number = 0;
      var x: number = 0;
      while (x <= colIndex) {
        if (
          (
          tableRowIndex === 0 ||
          this.layout.tableRows[tableRowIndex - 1][tableColIndex] === null ||
          this.layout.tableRows[tableRowIndex - 1][tableColIndex] !== this.layout.tableRows[tableRowIndex][tableColIndex]
          )
        ) {
          x++;
        }
        var tableCellId: number = this.layout.tableRows[tableRowIndex][tableColIndex];
        tableColIndex += tableCellId ? this.getTableCell(tableCellId).colSpan : 1;
      }
      return --tableColIndex;
    }

    drop(tableRowIndex: number, colIndex: number, side: string, content: any): void {
      // add the new table cell to the layout. todo: change id from number to timestamp.
      var newCell: ITableCell = {
        id: new Date().getTime(),
        content: content,
        rowSpan: 1,
        colSpan: 1
      };
      this.layout.tableCells.push(newCell);
      // add it to the used fields if possible.
      if (this.addedContent) {
        this.addedContent(this.layout, newCell);
      }
      // transform the colIndex into a tableColIndex.
      var tableColIndex: number = this.colIndexToTableColIndex(tableRowIndex, colIndex);
      // check if we are dropping onto an empty cell.
      if (this.layout.tableRows[tableRowIndex][tableColIndex]) {
        // choose the algorithm for the drop side.
        switch (side) {
          case 'left':
            // left align the drop position.
            while (tableColIndex > 0 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null &&
            this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex][tableColIndex - 1]) {
              tableColIndex--;
            }
            // check if we drop at the start.
            if (tableColIndex === 0) {
              // insert a new column before the drop column.
              this.insertCol(tableColIndex);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex] = newCell.id;
              // check if the cell at the drop position is not empty.
            } else if (this.layout.tableRows[tableRowIndex][tableColIndex - 1] === null) {
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex - 1] = newCell.id;
            } else {
              // insert a new column before the drop column.
              this.insertCol(tableColIndex);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex] = newCell.id;
            }
            break;
          case 'right':
            // check if we drop at the end.
            if (tableColIndex === this.layout.tableRows[tableRowIndex].length) {
              // append a new column after the drop column.
              this.insertCol(tableColIndex + 1);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex + 1] = newCell.id;
              // check if the cell at the drop position is not empty.
            } else if (this.layout.tableRows[tableRowIndex][tableColIndex + 1] === null) {
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex + 1] = newCell.id;
            } else {
              // append a new column after the drop column.
              this.insertCol(tableColIndex + 1);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex + 1] = newCell.id;
            }
            break;
          case 'top':
            // left align the drop position.
            while (tableColIndex > 0 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null &&
            this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex][tableColIndex - 1]) {
              tableColIndex--;
            }
            // check if we drop at the start.
            if (tableRowIndex === 0) {
              // insert a new row before the drop row.
              this.insertRow(tableRowIndex);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex] = newCell.id;
              // check if the cell at the drop position is not empty.
            } else if (this.layout.tableRows[tableRowIndex - 1][tableColIndex] === null) {
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex - 1][tableColIndex] = newCell.id;
            } else {
              // insert a new row before the drop row.
              this.insertRow(tableRowIndex);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex][tableColIndex] = newCell.id;
            }
            break;
          case 'bottom':
            // left align the drop position.
            while (tableColIndex > 0 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null &&
            this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex][tableColIndex - 1]) {
              tableColIndex--;
            }
            // bottom align the drop position.
            while (tableRowIndex < this.layout.tableRows.length - 1 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null &&
            this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex + 1][tableColIndex]) {
              tableRowIndex++;
            }
            // check if we drop at the end.
            if (tableRowIndex === this.layout.tableRows.length - 1) {
              // append a new row after the drop row.
              this.insertRow(tableRowIndex + 1);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex + 1][tableColIndex] = newCell.id;
              // check if the cell at the drop position is not empty.
            } else if (this.layout.tableRows[tableRowIndex + 1][tableColIndex] === null) {
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex + 1][tableColIndex] = newCell.id;
            } else {
              // append a new row after the drop row.
              this.insertRow(tableRowIndex + 1);
              // set the new cell at the drop position.
              this.layout.tableRows[tableRowIndex + 1][tableColIndex] = newCell.id;
            }
            break;
        }
      } else {
        this.layout.tableRows[tableRowIndex][tableColIndex] = newCell.id;
      }
      this.update(this.tableWidth);
    }

    remove(tableCellId: number): void {
      var tableCell: ITableCell = this.getTableCell(tableCellId);
      tableCell.colSpan = 1;
      tableCell.rowSpan = 1;
      if (this.layout.selectedCell && this.layout.selectedCell.id === tableCell.id) {
        this.layout.selectedCell = null;
      }
      this.layout.tableRows.forEach((tableRow: number[]): void => {
        tableRow.forEach((id: number, x: number): void => {
          if (tableCellId === id) {
            tableRow[x] = null;
          }
        }, this);
      }, this);
      _.remove(this.layout.tableCells, (cell: ITableCell): boolean => {
        return cell.id === tableCellId;
      });
      // remove it from the used fields if possible.
      if (this.removedContent) {
        this.removedContent(this.layout, tableCell);
      }
      this.compact();
      this.update(this.tableWidth);
    }

    compact(): void {
      var removeRows: number[] = [];
      this.layout.tableRows.forEach((tableRow: number[], y: number): void => {
        var isEmpty: boolean = true;
        tableRow.forEach((id: number, x: number): void => {
          if (id !== null) {
            isEmpty = false;
          }
        }, this);
        if (isEmpty) {
          removeRows.push(y);
        }
      }, this);
      var removeCols: number[] = [];
      this.layout.tableRows[0].forEach((id: number, x: number): void => {
        var isEmpty: boolean = true;
        this.layout.tableRows.forEach((tableRow: number[]): void => {
          if (tableRow[x] !== null) {
            isEmpty = false;
          }
        }, this);
        if (isEmpty) {
          removeCols.push(x);
        }
      }, this);
      removeRows.reverse();
      removeRows.forEach((y: number): void => {
        this.layout.tableRows.splice(y, 1);
      }, this);
      removeCols.reverse();
      removeCols.forEach((x: number): void => {
        this.layout.tableRows.forEach((tableRow: number[]): void => {
          tableRow.splice(x, 1);
        }, this);
      }, this);
      if (this.layout.tableRows.length === 0) {
        this.layout.tableRows.push([null]);
      }
    }

    updateSelectedSpan(diffColSpan: number, diffRowSpan: number): void {
      var tableCell: ITableCell = this.getTableCell(this.layout.selectedCell.id);
      tableCell.colSpan += diffColSpan;
      tableCell.rowSpan += diffRowSpan;
      var tableColIndex: number = null;
      var tableRowIndex: number = null;
      this.layout.tableRows.forEach((tableRow: number[], y: number): void => {
        tableRow.forEach((id: number, x: number): void => {
          if (id === tableCell.id) {
            tableColIndex = tableColIndex === null ? x : tableColIndex;
            tableRowIndex = tableRowIndex === null ? y : tableRowIndex;
          }
        }, this);
      }, this);
      while (diffRowSpan > 0) {
        diffRowSpan--;
        var yInsertIndex: number = tableRowIndex + this.layout.selectedCell.rowSpan - diffRowSpan - 1;
        this.insertRow(yInsertIndex);
        for (var xInsert: number = 0; xInsert < tableCell.colSpan; xInsert++) {
          this.layout.tableRows[yInsertIndex][tableColIndex + xInsert] = tableCell.id;
        }
      }
      while (diffColSpan > 0) {
        diffColSpan--;
        var xInsertIndex: number = tableColIndex + this.layout.selectedCell.colSpan - diffColSpan - 1;
        this.insertCol(xInsertIndex);
        for (var yInsert: number = 0; yInsert < tableCell.rowSpan; yInsert++) {
          this.layout.tableRows[tableRowIndex + yInsert][xInsertIndex] = tableCell.id;
        }
      }
      while (diffRowSpan < 0) {
        diffRowSpan++;
        var yRemoveIndex: number = tableRowIndex + this.layout.selectedCell.rowSpan - diffRowSpan;
        for (var xRemove: number = 0; xRemove < tableCell.colSpan; xRemove++) {
          this.layout.tableRows[yRemoveIndex][tableColIndex + xRemove] = null;
        }
        this.compact();
      }
      while (diffColSpan < 0) {
        diffColSpan++;
        var xRemoveIndex: number = tableColIndex + this.layout.selectedCell.colSpan - diffColSpan;
        for (var yRemove: number = 0; yRemove < tableCell.rowSpan; yRemove++) {
          this.layout.tableRows[tableRowIndex + yRemove][xRemoveIndex] = null;
        }
        this.compact();
      }
    }
  }

  angular.module('tableLayout').controller('tableLayout.TableLayoutController', TableLayoutController);
}
