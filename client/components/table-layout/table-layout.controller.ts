module components.tableLayout {
  'use strict';
  export interface ITableLayout {
    selectedCell: ITableCell;
    tableCells: ITableCell[];
    tableRows: number[][];
  }
  export interface ITableCell {
    rowSpan: number;
    colSpan: number;
    id: number;
  }
  export interface ITableLayoutController {
    layout: ITableLayout;
    rows: ITableCell[][];
    update(tableWidth: number): void;
    drop(rowIndex: number, colIndex: number, side: string, data: any): void;
    remove(tableCellId: number): void;
  }
  class TableLayoutController implements ITableLayoutController {
    static $inject: string[] = [];
    layout: ITableLayout;
    rows: ITableCell[][];
    numCols: number;
    colWidth: number;
    tableWidth: number;

    constructor() {
      console.log();
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

    drop(tableRowIndex: number, colIndex: number, side: string, data: any): void {
      // add the new table cell to the layout. todo: change id from number to timestamp.
      this.layout.tableCells.push({rowSpan: 1, colSpan: 1, id: data});
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
      tableColIndex--;
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
            this.layout.tableRows[tableRowIndex][tableColIndex] = data;
            // check if the cell at the drop position is not empty.
          } else if (this.layout.tableRows[tableRowIndex][tableColIndex - 1] === null) {
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex][tableColIndex - 1] = data;
          } else {
            // insert a new column before the drop column.
            this.insertCol(tableColIndex);
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex][tableColIndex] = data;
          }
          break;
        case 'right':
          // check if we drop at the end.
          if (tableColIndex === this.layout.tableRows[tableRowIndex].length) {
            // append a new column after the drop column.
            this.insertCol(tableColIndex + 1);
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex][tableColIndex + 1] = data;
            // check if the cell at the drop position is not empty.
          } else if (this.layout.tableRows[tableRowIndex][tableColIndex + 1] === null) {
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex][tableColIndex + 1] = data;
          } else {
            // append a new column after the drop column.
            this.insertCol(tableColIndex + 1);
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex][tableColIndex + 1] = data;
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
            this.layout.tableRows[tableRowIndex][tableColIndex] = data;
            // check if the cell at the drop position is not empty.
          } else if (this.layout.tableRows[tableRowIndex - 1][tableColIndex] === null) {
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex - 1][tableColIndex] = data;
          } else {
            // insert a new row before the drop row.
            this.insertRow(tableRowIndex);
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex][tableColIndex] = data;
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
            this.layout.tableRows[tableRowIndex + 1][tableColIndex] = data;
            // check if the cell at the drop position is not empty.
          } else if (this.layout.tableRows[tableRowIndex + 1][tableColIndex] === null) {
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex + 1][tableColIndex] = data;
          } else {
            // append a new row after the drop row.
            this.insertRow(tableRowIndex + 1);
            // set the new cell at the drop position.
            this.layout.tableRows[tableRowIndex + 1][tableColIndex] = data;
          }
          break;
      }
      this.update(this.tableWidth);
    }

    remove(tableCellId: number): void {
      this.layout.tableRows.forEach((tableRow: number[]): void => {
        tableRow.forEach((id: number, x: number): void => {
          if (tableCellId === id) {
            tableRow[x] = null;
          }
        }, this);
      }, this);
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
      removeRows.forEach((y: number): void => {
        this.layout.tableRows.splice(y, 1);
      });
      removeCols.forEach((x: number): void => {
        this.layout.tableRows.forEach((tableRow: number[]): void => {
          tableRow.splice(x, 1);
        }, this);
      });
    }
  }

  angular.module('tableLayout').controller('tableLayout.TableLayoutController', TableLayoutController);
}
