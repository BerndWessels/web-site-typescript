var app;
(function (app) {
    var trial;
    (function (trial) {
        'use strict';
        var TrialController = (function () {
            function TrialController($scope) {
                var vm = this;
                vm.name = 'Trial';
                vm.tableLayout = {
                    selectedCell: null,
                    tableCells: [
                        { rowSpan: 1, colSpan: 1, id: 11, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 13, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 14, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 21, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 3, colSpan: 2, id: 22, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 31, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 34, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 44, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 51, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 53, template: '<div>{{vm.name}}</div>' },
                        { rowSpan: 1, colSpan: 1, id: 54, template: '<div>{{vm.name}}</div>' }
                    ],
                    tableRows: [
                        [11, null, 13, 14],
                        [21, 22, 22, null],
                        [31, 22, 22, 34],
                        [null, 22, 22, 44],
                        [51, null, 53, 54]
                    ]
                };
                vm.outers = [
                    { id: 'a', template: '<div>a - {{vm.name}}</div>' },
                    { id: 'b', template: '<div>b - {{vm.name}}</div>' },
                    { id: 'c', template: '<div>c - {{vm.name}}</div>' }
                ];
            }
            TrialController.$inject = ['$scope'];
            return TrialController;
        })();
        trial.TrialController = TrialController;
        angular.module('app').controller('app.trial.TrialController', TrialController);
    })(trial = app.trial || (app.trial = {}));
})(app || (app = {}));
//# sourceMappingURL=trial.controller.js.map