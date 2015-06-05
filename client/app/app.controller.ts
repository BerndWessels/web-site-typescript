module app {
  'use strict';
  interface IAppController {
    fullName: string;
    lastName: string;
  }
  class AppController implements IAppController {
    static $inject: string[] = [];
    fullName: string;
    lastName: string;

    constructor() {
      var vm: IAppController = this;
      vm.fullName = 'Bernd';
      vm.lastName = 'Wessels';
    }
  }
  angular.module('app').controller('app.AppController', AppController);
}
