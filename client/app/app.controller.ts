/**
 * This is the application's controller.
 */
module app {
  'use strict';
  /**
   * This is the structure of the application controller.
   */
  interface IAppController {
    fullName: string;
    lastName: string;
  }
  /**
   * This is the controller for the application.
   */
  class AppController implements IAppController {
    /**
     * This is the dependency injection for the class constructor.
     *
     * @type {string[]} Dependencies to be injected.
     */
    static $inject: string[] = [];
    /**
     * @inheritdoc
     */
    fullName: string;
    /**
     * @inheritdoc
     */
    lastName: string;
    /**
     * This is the constructor that takes the injected dependencies.
     */
    constructor() {
      var vm: IAppController = this;
      vm.fullName = 'Bernd';
      vm.lastName = 'Wessels';
    }
  }
  // register the controller.
  angular.module('app').controller('app.AppController', AppController);
}
