var components;
(function (components) {
    var tableLayout;
    (function (tableLayout) {
        'use strict';
        var TableLayoutController = (function () {
            function TableLayoutController() {
                console.log();
            }
            TableLayoutController.prototype.getTableCell = function (id) {
                return _.find(this.layout.tableCells, function (tableCell) {
                    return tableCell.id === id;
                });
            };
            TableLayoutController.prototype.update = function (tableWidth) {
                var _this = this;
                if (tableWidth <= 0) {
                    return;
                }
                this.tableWidth = tableWidth;
                this.rows = [];
                var renderedCells = [];
                this.numCols = 0;
                this.layout.tableRows.forEach(function (tableRow) {
                    var row = [];
                    tableRow.forEach(function (tableCellId) {
                        if (tableCellId === null) {
                            row.push(null);
                        }
                        else if (renderedCells.indexOf(tableCellId) === -1) {
                            renderedCells.push(tableCellId);
                            row.push(_this.getTableCell(tableCellId));
                        }
                    }, _this);
                    _this.numCols = _this.numCols > tableRow.length ? _this.numCols : tableRow.length;
                    _this.colWidth = Math.floor((tableWidth - (_this.numCols * 2)) / _this.numCols);
                    _this.rows.push(row);
                }, this);
            };
            TableLayoutController.prototype.insertCol = function (tableColIndex) {
                var _this = this;
                // remember cells with already extended colSpan.
                var extendedCells = [];
                // iterate through all rows.
                this.layout.tableRows.forEach(function (tableRow, y) {
                    // dropping at the start/end is always a simple insert/append.
                    if (tableColIndex === 0 || tableColIndex === tableRow.length) {
                        tableRow.splice(tableColIndex, 0, null);
                    }
                    else {
                        // if we are in the middle of a spanned cell we have to extend it.
                        var prevTableCellId = tableRow[tableColIndex - 1];
                        var thisTableCellId = tableRow[tableColIndex];
                        if (prevTableCellId && thisTableCellId && _this.getTableCell(prevTableCellId) === _this.getTableCell(thisTableCellId)) {
                            // make sure we only increase the colSpan once.
                            if (extendedCells.indexOf(thisTableCellId) === -1) {
                                extendedCells.push(thisTableCellId);
                                _this.getTableCell(thisTableCellId).colSpan++;
                            }
                            tableRow.splice(tableColIndex, 0, thisTableCellId);
                        }
                        else {
                            // insert a new empty cell at the drop index.
                            tableRow.splice(tableColIndex, 0, null);
                        }
                    }
                }, this);
            };
            TableLayoutController.prototype.insertRow = function (tableRowIndex) {
                var _this = this;
                // remember cells with already extended colSpan.
                var extendedCells = [];
                // insert the new row.
                this.layout.tableRows.splice(tableRowIndex, 0, []);
                // dropping at the start/end is always a simple insert/append.
                if (tableRowIndex === 0 || tableRowIndex === this.layout.tableRows.length - 1) {
                    for (var x = 0; x < this.numCols; x++) {
                        this.layout.tableRows[tableRowIndex].push(null);
                    }
                }
                else {
                    // iterate through all cols.
                    this.layout.tableRows[tableRowIndex + 1].forEach(function (tableCellId, x) {
                        // if we are in the middle of a spanned cell we have to extend it.
                        var prevTableCellId = tableRowIndex > 0 ? _this.layout.tableRows[tableRowIndex - 1][x] : null;
                        if (tableCellId && tableCellId === prevTableCellId) {
                            // make sure we only increase the colSpan once.
                            if (extendedCells.indexOf(tableCellId) === -1) {
                                extendedCells.push(tableCellId);
                                _this.getTableCell(tableCellId).rowSpan++;
                            }
                            _this.layout.tableRows[tableRowIndex].push(tableCellId);
                        }
                        else {
                            // insert a new empty cell at the drop index.
                            _this.layout.tableRows[tableRowIndex].push(null);
                        }
                    }, this);
                }
            };
            TableLayoutController.prototype.drop = function (tableRowIndex, colIndex, side, data) {
                // add the new table cell to the layout. todo: change id from number to timestamp.
                this.layout.tableCells.push({ rowSpan: 1, colSpan: 1, id: data });
                // transform the colIndex into a tableColIndex.
                var tableColIndex = 0;
                var x = 0;
                while (x <= colIndex) {
                    if ((tableRowIndex === 0 || this.layout.tableRows[tableRowIndex - 1][tableColIndex] === null || this.layout.tableRows[tableRowIndex - 1][tableColIndex] !== this.layout.tableRows[tableRowIndex][tableColIndex])) {
                        x++;
                    }
                    var tableCellId = this.layout.tableRows[tableRowIndex][tableColIndex];
                    tableColIndex += tableCellId ? this.getTableCell(tableCellId).colSpan : 1;
                }
                tableColIndex--;
                switch (side) {
                    case 'left':
                        while (tableColIndex > 0 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null && this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex][tableColIndex - 1]) {
                            tableColIndex--;
                        }
                        // check if we drop at the start.
                        if (tableColIndex === 0) {
                            // insert a new column before the drop column.
                            this.insertCol(tableColIndex);
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex][tableColIndex] = data;
                        }
                        else if (this.layout.tableRows[tableRowIndex][tableColIndex - 1] === null) {
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex][tableColIndex - 1] = data;
                        }
                        else {
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
                        }
                        else if (this.layout.tableRows[tableRowIndex][tableColIndex + 1] === null) {
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex][tableColIndex + 1] = data;
                        }
                        else {
                            // append a new column after the drop column.
                            this.insertCol(tableColIndex + 1);
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex][tableColIndex + 1] = data;
                        }
                        break;
                    case 'top':
                        while (tableColIndex > 0 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null && this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex][tableColIndex - 1]) {
                            tableColIndex--;
                        }
                        // check if we drop at the start.
                        if (tableRowIndex === 0) {
                            // insert a new row before the drop row.
                            this.insertRow(tableRowIndex);
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex][tableColIndex] = data;
                        }
                        else if (this.layout.tableRows[tableRowIndex - 1][tableColIndex] === null) {
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex - 1][tableColIndex] = data;
                        }
                        else {
                            // insert a new row before the drop row.
                            this.insertRow(tableRowIndex);
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex][tableColIndex] = data;
                        }
                        break;
                    case 'bottom':
                        while (tableColIndex > 0 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null && this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex][tableColIndex - 1]) {
                            tableColIndex--;
                        }
                        while (tableRowIndex < this.layout.tableRows.length - 1 && this.layout.tableRows[tableRowIndex][tableColIndex] !== null && this.layout.tableRows[tableRowIndex][tableColIndex] === this.layout.tableRows[tableRowIndex + 1][tableColIndex]) {
                            tableRowIndex++;
                        }
                        // check if we drop at the end.
                        if (tableRowIndex === this.layout.tableRows.length - 1) {
                            // append a new row after the drop row.
                            this.insertRow(tableRowIndex + 1);
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex + 1][tableColIndex] = data;
                        }
                        else if (this.layout.tableRows[tableRowIndex + 1][tableColIndex] === null) {
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex + 1][tableColIndex] = data;
                        }
                        else {
                            // append a new row after the drop row.
                            this.insertRow(tableRowIndex + 1);
                            // set the new cell at the drop position.
                            this.layout.tableRows[tableRowIndex + 1][tableColIndex] = data;
                        }
                        break;
                }
                this.update(this.tableWidth);
            };
            TableLayoutController.prototype.remove = function (tableCellId) {
                var _this = this;
                this.layout.tableRows.forEach(function (tableRow) {
                    tableRow.forEach(function (id, x) {
                        if (tableCellId === id) {
                            tableRow[x] = null;
                        }
                    }, _this);
                }, this);
                this.compact();
                this.update(this.tableWidth);
            };
            TableLayoutController.prototype.compact = function () {
                var _this = this;
                var removeRows = [];
                this.layout.tableRows.forEach(function (tableRow, y) {
                    var isEmpty = true;
                    tableRow.forEach(function (id, x) {
                        if (id !== null) {
                            isEmpty = false;
                        }
                    }, _this);
                    if (isEmpty) {
                        removeRows.push(y);
                    }
                }, this);
                var removeCols = [];
                this.layout.tableRows[0].forEach(function (id, x) {
                    var isEmpty = true;
                    _this.layout.tableRows.forEach(function (tableRow) {
                        if (tableRow[x] !== null) {
                            isEmpty = false;
                        }
                    }, _this);
                    if (isEmpty) {
                        removeCols.push(x);
                    }
                }, this);
                removeRows.forEach(function (y) {
                    _this.layout.tableRows.splice(y, 1);
                });
                removeCols.forEach(function (x) {
                    _this.layout.tableRows.forEach(function (tableRow) {
                        tableRow.splice(x, 1);
                    }, _this);
                });
            };
            TableLayoutController.$inject = [];
            return TableLayoutController;
        })();
        angular.module('tableLayout').controller('tableLayout.TableLayoutController', TableLayoutController);
    })(tableLayout = components.tableLayout || (components.tableLayout = {}));
})(components || (components = {}));
//# sourceMappingURL=table-layout.controller.js.map