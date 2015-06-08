/**
 * This is a component that helps you dynamically create table layouts with row and col span.
 */
module components.tableLayout {
  'use strict';
  /**
   * This is the structure of the table layout.
   */
  export interface ITableLayout {
    /**
     * This is the type of cells that can be dragged into this table layout.
     */
    cellType: string;
    /**
     * This is a copy of the currently selected cell.
     */
    selectedCell: ITableCell;
    /**
     * This is a list of all cells used in this table layout.
     */
    tableCells: ITableCell[];
    /**
     * This is the layout in form of a 2d matrix of ids.
     */
    tableRows: number[][];
  }
  /**
   * This is the structure of the layout cell.
   */
  export interface ILayoutCell {
    /**
     * This is the x position in the layout.
     */
    x: number;
    /**
     * This is the y position in the layout.
     */
    y: number;
    /**
     * This is the table cell within the layout cell.
     */
    tableCell: ITableCell;
  }
  /**
   * This is the structure of the table cell.
   */
  export interface ITableCell {
    /**
     * This is the automatically generated table cell identifier.
     *
     * It is the 'new Date().getTime()' from when it was created.
     */
    id: number;
    /**
     * This is the content of the table cell.
     */
    content: ITableCellContent;
    /**
     * This is the number of rows this table cell will span.
     */
    rowSpan: number;
    /**
     * This is the number of columns this table cell will span.
     */
    colSpan: number;
  }
  /**
   * This is the structure of the table cell content.
   *
   * It is usually extended for the specific use-case.
   */
  export interface ITableCellContent {
    /**
     * This is the use-case generated table cell content identifier.
     */
    id: number;
    /**
     * This is the html template of the table cell content.
     */
    template: string;
  }
  /**
   * This is the structure to expose the selected cell via binding.
   */
  export interface ISelected {
    /**
     * This is the selected cell.
     */
    cell: ITableCell;
    /**
     * This ins the selected layout.
     */
    layout: ITableLayout;
  }
  /**
   * This is the structure of the table layout controller.
   */
  export interface ITableLayoutController {
    /**
     * This is a flag that enables the table layout to be edited by the user.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     */
    editMode: boolean;
    /**
     * This is the table layout data.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     */
    layout: ITableLayout;
    /**
     * This is the collection of cell elements which height needs to be measured.
     */
    cellElements: ng.IAugmentedJQuery[];
    /**
     * This external callback will be called when the user selects a cell.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param cell The selected cell.
     */
    selectCell(layout: ITableLayout, cell: ITableCell): void;
    /**
     * This external callback will be called to determine if content can be dropped.
     *
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param content The content to be dropped.
     */
    allowContent(layout: ITableLayout, content: ITableCellContent): boolean;
    /**
     * This external callback will be called when content has been dropped into this table layout.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param cell The newly created cell.
     */
    addedContent(layout: ITableLayout, cell: ITableCell): void;
    /**
     * This external callback will be called when content has been dragged out of this table layout.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param cell The cell that will be removed.
     */
    removedContent(layout: ITableLayout, cell: ITableCell): void;
    /**
     * This external callback is called to render cell content by an external scope.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param element The element into which the content should be rendered.
     */
    compileCellTemplate(element: JQuery): void;
    /**
     * This is called to synchronize the current layout.
     *
     * @param tableWidth The width in pixel of the table layout.
     */
    update(tableWidth: number): void;
    /**
     * This is called to update the heights of all layout cells.
     */
    updateCells(): void;
    /**
     * This is called when content is dropped into the layout.
     *
     * @param rowIndex The row index the content has been dropped on.
     * @param colIndex The column index the content has been dropped on.
     * @param side The side the content has been dropped on.
     * @param content The content that has been dropped.
     */
    drop(rowIndex: number, colIndex: number, side: string, content: ITableCellContent): void;
    /**
     * This is called when a cell is dragged out of the layout.
     *
     * @param tableCellId The identifer of the cell that will be removed.
     */
    remove(tableCellId: number): void;
    /**
     * This is called when the row or column span of the selected cell has changed.
     *
     * @param newColSpan The change in column span.
     * @param newRowSpan The change in row span.
     */
    updateSelectedSpan(newColSpan: number, newRowSpan: number): void;
    /**
     * This is called to get the cell for a given  cell id.
     *
     * @param id The cell identifier.
     */
    getTableCell(id: number): ITableCell;
  }
  /**
   * This is the controller for the table layout directive.
   */
  class TableLayoutController implements ITableLayoutController {
    /**
     * This is the dependency injection for the class constructor.
     *
     * @type {string[]} Dependencies to be injected.
     */
    static $inject: string[] = ['$scope', '$timeout'];
    /**
     * @inheritdoc
     */
    editMode: boolean;
    /**
     * @inheritdoc
     */
    layout: ITableLayout;
    /**
     * @inheritdoc
     */
    cellElements: ng.IAugmentedJQuery[] = [];
    /**
     * @inheritdoc
     */
    selectCell: (layout: ITableLayout, cell: ITableCell) => void;
    /**
     * @inheritdoc
     */
    allowContent: (layout: ITableLayout, content: ITableCellContent) => boolean;
    /**
     * @inheritdoc
     */
    addedContent: (layout: ITableLayout, cell: ITableCell) => void;
    /**
     * @inheritdoc
     */
    removedContent: (layout: ITableLayout, cell: ITableCell) => void;
    /**
     * @inheritdoc
     */
    compileCellTemplate: (element: JQuery) => void;
    /**
     * The render-matrix.
     */
    layoutCells: ILayoutCell[];
    /**
     * The render-matrix row tops.
     */
    rowTops: number[] = [];
    /**
     * The render-matrix row heights.
     */
    rowHeights: number[] = [];
    /**
     * The calculated number of columns in the layout.
     */
    numCols: number;
    /**
     * The calculated column width for this layout.
     */
    colWidth: number;
    /**
     * The given table width of this layout.
     */
    tableWidth: number;
    /**
     * The calculated height of this layout.
     */
    tableHeight: number;

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $scope Injected scope dependency.
     * @param $timeout Injected timeout dependency.
     */
    constructor(private $scope: ng.IScope, private $timeout: ng.ITimeoutService) {
    }

    /**
     * @inheritdoc
     */
    getTableCell(id: number): ITableCell {
      return _.find(this.layout.tableCells, (tableCell: ITableCell) => {
        return tableCell.id === id;
      });
    }

    /**
     * @inheritdoc
     */
    update(tableWidth: number): void {
      // the layout matrix flattens row and col spans,
      // while the render matrix excludes spanned cells.
      if (!this.layout || tableWidth <= 0) {
        return;
      }
      // remember the new table width.
      this.tableWidth = tableWidth;
      // reset the render-matrix.
      this.layoutCells = <ILayoutCell[]> [];
      var renderedCells: number[] = [];
      this.numCols = 0;
      // go through every layout row.
      var y: number = 0;
      this.layout.tableRows.forEach((tableRow: number[]) => {
        // go through every layout cell.
        var x: number = 0;
        tableRow.forEach((tableCellId: number) => {
          if (tableCellId === null) {
            // empty layout cells transform into empty render cells.
            this.layoutCells.push({
              y: y,
              x: x,
              tableCell: null
            });
            x++;
          } else if (renderedCells.indexOf(tableCellId) === -1) {
            // remember already rendered layout cells.
            renderedCells.push(tableCellId);
            // get the table cell.
            var tableCell: ITableCell = this.getTableCell(tableCellId);
            // each layout cell will only be transformed into a render cell once.
            this.layoutCells.push({
              y: y,
              x: x,
              tableCell: tableCell
            });
            x++;
          } else if (renderedCells.indexOf(tableCellId) !== -1) {
            // ignore already rendered layout cells.
            x++;
          }
        }, this);
        // calculate the maximum number of columns.
        this.numCols = this.numCols > x ? this.numCols : x;
        // calculate the resulting column width.
        this.colWidth = Math.floor((tableWidth - this.numCols) / this.numCols);
        y++;
      }, this);
      // calculate the top and height for each layout cell.
      this.updateCells();
    }

    /**
     * @inheritdoc
     */
    updateCells(): void {
      // initialize row tops and heights for binding.
      this.rowTops = _.range(this.layout.tableRows.length + 1).map((): number => {
        return 0;
      });
      this.rowHeights = _.range(this.layout.tableRows.length + 1).map((): number => {
        return 20;
      });
      // go through all cells with row span 1.
      this.layoutCells.forEach((layoutCell: ILayoutCell, index: number): void => {
        // get the cells content height.
        if (layoutCell.tableCell && layoutCell.tableCell.rowSpan === 1) {
          var cellHeight: number = 20;
          if (this.cellElements[layoutCell.tableCell.id]) {
            cellHeight = this.cellElements[layoutCell.tableCell.id].outerHeight();
            if (cellHeight === 0) {
              this.$timeout((): void => {
                this.updateCells();
              });
            }
          }
          // update the row height.
          this.rowHeights[layoutCell.y] = Math.max(this.rowHeights[layoutCell.y], cellHeight);
        }
      }, this);
      // go through all cells with row span greater than 1.
      this.layoutCells.forEach((layoutCell: ILayoutCell, index: number): void => {
        // get the cells content height.
        if (layoutCell.tableCell && layoutCell.tableCell.rowSpan > 1) {
          var cellHeight: number = 20;
          if (this.cellElements[layoutCell.tableCell.id]) {
            cellHeight = this.cellElements[layoutCell.tableCell.id].outerHeight();
            if (cellHeight === 0) {
              this.$timeout((): void => {
                this.updateCells();
              });
            } else {
              // calculate the total height of the spanned rows.
              var spannedHeight: number = 0;
              for (var y: number = 0; y < layoutCell.tableCell.rowSpan; y++) {
                spannedHeight += this.rowHeights[layoutCell.y + y];
              }
              // increase the height of the spanned rows to accommodate the spanned cell.
              if (spannedHeight < cellHeight) {
                var addHeight: number = Math.ceil((cellHeight - spannedHeight) / layoutCell.tableCell.rowSpan);
                for (y = 0; y < layoutCell.tableCell.rowSpan; y++) {
                  this.rowHeights[layoutCell.y + y] = this.rowHeights[layoutCell.y + y] + addHeight;
                }
              }
            }
          }
        }
      }, this);
      // calculate the row tops.
      for (var r: number = 0; r < this.layout.tableRows.length; r++) {
        this.rowTops[r + 1] = this.rowTops[r] + this.rowHeights[r];
      }
      // set the new height of the layout for binding.
      this.tableHeight = this.rowTops[r - 1] + this.rowHeights[r - 1] + 1;
    }

    /**
     * @inheritdoc
     */
    insertCol(tableColIndex: number): void {
      // remember cells with already extended colSpan.
      var extendedCells: number[] = [];
      // iterate through all rows.
      this.layout.tableRows.forEach((tableRow: number[]) => {
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

    /**
     * @inheritdoc
     */
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

    /**
     * @inheritdoc
     */
    drop(tableRowIndex: number, tableColIndex: number, side: string, content: ITableCellContent): void {
      // add the new table cell to the layout.
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
            // right align the tableColIndex to spanned cells.
            if (this.layout.tableRows[tableRowIndex][tableColIndex]) {
              var tableCell: ITableCell = this.getTableCell(this.layout.tableRows[tableRowIndex][tableColIndex]);
              tableColIndex += tableCell.colSpan - 1;
            }
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
        // put the new cell into the empty cell.
        this.layout.tableRows[tableRowIndex][tableColIndex] = newCell.id;
      }
      // update the render-matrix.
      this.update(this.tableWidth);
    }

    /**
     * @inheritdoc
     */
    remove(tableCellId: number): void {
      // reset the row and column span of the cell to be removed.
      var tableCell: ITableCell = this.getTableCell(tableCellId);
      tableCell.colSpan = 1;
      tableCell.rowSpan = 1;
      // reset the selected cell if necessary.
      if (this.layout.selectedCell && this.layout.selectedCell.id === tableCell.id) {
        this.layout.selectedCell = null;
      }
      // remove the cell from the layout-matrix.
      this.layout.tableRows.forEach((tableRow: number[]): void => {
        tableRow.forEach((id: number, x: number): void => {
          if (tableCellId === id) {
            tableRow[x] = null;
          }
        }, this);
      }, this);
      // remove the cell from the used cells.
      _.remove(this.layout.tableCells, (cell: ITableCell): boolean => {
        return cell.id === tableCellId;
      });
      // remove it from the used fields if possible.
      if (this.removedContent) {
        this.removedContent(this.layout, tableCell);
      }
      // compact the layout-matrix.
      this.compact();
      // update the render-matrix.
      this.update(this.tableWidth);
    }

    /**
     * @inheritdoc
     */
    compact(): void {
      // find all empty rows.
      var removeRows: number[] = [];
      this.layout.tableRows.forEach((tableRow: number[], y: number): void => {
        var isEmpty: boolean = true;
        tableRow.forEach((id: number): void => {
          if (id !== null) {
            isEmpty = false;
          }
        }, this);
        if (isEmpty) {
          removeRows.push(y);
        }
      }, this);
      // find all empty columns.
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
      // remove empty rows from the layout-matrix.
      removeRows.reverse();
      removeRows.forEach((y: number): void => {
        this.layout.tableRows.splice(y, 1);
      }, this);
      // remove empty columns from the layout-matrix.
      removeCols.reverse();
      removeCols.forEach((x: number): void => {
        this.layout.tableRows.forEach((tableRow: number[]): void => {
          tableRow.splice(x, 1);
        }, this);
      }, this);
      // make sure there is at least one row with one empty cell.
      if (this.layout.tableRows.length === 0) {
        this.layout.tableRows.push([null]);
      }
    }

    /**
     * @inheritdoc
     */
    updateSelectedSpan(newColSpan: number, newRowSpan: number): void {
      // update the cell's row and column span.
      var tableCell: ITableCell = this.getTableCell(this.layout.selectedCell.id);
      // calculate the diffs.
      var diffColSpan: number = newColSpan - tableCell.colSpan;
      var diffRowSpan: number = newRowSpan - tableCell.rowSpan;
      // update the spans.
      tableCell.colSpan = newColSpan;
      tableCell.rowSpan = newRowSpan;
      // find the cell's row and col index.
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
      // append new rows if necessary.
      while (diffRowSpan > 0) {
        diffRowSpan--;
        var yInsertIndex: number = tableRowIndex + this.layout.selectedCell.rowSpan - diffRowSpan - 1;
        this.insertRow(yInsertIndex);
        for (var xInsert: number = 0; xInsert < tableCell.colSpan; xInsert++) {
          this.layout.tableRows[yInsertIndex][tableColIndex + xInsert] = tableCell.id;
        }
      }
      // append new columns if necessary.
      while (diffColSpan > 0) {
        diffColSpan--;
        var xInsertIndex: number = tableColIndex + this.layout.selectedCell.colSpan - diffColSpan - 1;
        this.insertCol(xInsertIndex);
        for (var yInsert: number = 0; yInsert < tableCell.rowSpan; yInsert++) {
          this.layout.tableRows[tableRowIndex + yInsert][xInsertIndex] = tableCell.id;
        }
      }
      // remove empty rows if necessary.
      while (diffRowSpan < 0) {
        diffRowSpan++;
        var yRemoveIndex: number = tableRowIndex + this.layout.selectedCell.rowSpan - diffRowSpan;
        for (var xRemove: number = 0; xRemove < tableCell.colSpan; xRemove++) {
          this.layout.tableRows[yRemoveIndex][tableColIndex + xRemove] = null;
        }
        this.compact();
      }
      // remove empty columns if necessary.
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

  // register the controller.
  angular.module('tableLayout').controller('tableLayout.TableLayoutController', TableLayoutController);
}
