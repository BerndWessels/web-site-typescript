var app;
(function (app) {
    var trial;
    (function (trial) {
        'use strict';
        var TrialController = (function () {
            function TrialController() {
                var vm = this;
                vm.name = 'Trial';
                vm.tableLayout = {
                    selectedCell: null,
                    tableCells: [
                        { rowSpan: 1, colSpan: 1, id: 11 },
                        { rowSpan: 1, colSpan: 1, id: 13 },
                        { rowSpan: 1, colSpan: 1, id: 14 },
                        { rowSpan: 1, colSpan: 1, id: 21 },
                        { rowSpan: 3, colSpan: 2, id: 22 },
                        { rowSpan: 1, colSpan: 1, id: 31 },
                        { rowSpan: 1, colSpan: 1, id: 34 },
                        { rowSpan: 1, colSpan: 1, id: 44 },
                        { rowSpan: 1, colSpan: 1, id: 51 },
                        { rowSpan: 1, colSpan: 1, id: 53 },
                        { rowSpan: 1, colSpan: 1, id: 54 }
                    ],
                    tableRows: [
                        [11, null, 13, 14],
                        [21, 22, 22, null],
                        [31, 22, 22, 34],
                        [null, 22, 22, 44],
                        [51, null, 53, 54]
                    ]
                };
                vm.outers = [{ name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'd' }, { name: 'e' }, { name: 'f' }];
            }
            TrialController.$inject = [];
            return TrialController;
        })();
        trial.TrialController = TrialController;
        angular.module('app').controller('app.trial.TrialController', TrialController);
    })(trial = app.trial || (app.trial = {}));
})(app || (app = {}));
//# sourceMappingURL=trial.controller.js.map