/**
 * This is the accounts feature.
 */
module app.accounts {
  'use strict';
  /**
   * This is the structure of the accounts feature controller.
   */
  interface IAccountsController {
    /**
     * This is the layout for the account search form.
     */
    accountSearchFormLayout: components.formLayout.IFormLayout;
  }
  /**
   * This is the controller for the accounts feature controller.
   */
  class AccountsController implements IAccountsController {
    /**
     * This is the dependency injection for the class constructor.
     *
     * @type {string[]} Dependencies to be injected.
     */
    static $inject: string[] = ['$scope', 'app.accounts.AccountsService'];
    /**
     * @inheritdoc
     */
    accountSearchFormLayout: components.formLayout.IFormLayout;

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $scope Injected scope dependency.
     * @param accountsService Injected account service dependency.
     */
    constructor(private $scope: ng.IScope, private accountsService: IAccountsService) {
      // use the view model for this controller.
      // var vm: IAccountsController = <any>this;
      this.activate();
    }

    /**
     * This will activate the controller and initialize it. todo John Papa Route Resolve Guide ?!?!
     */
    activate(): void {
      // initialize the account search form.
      this.accountsService.getAccountSearchFormLayout(1).then((formLayout: components.formLayout.IFormLayout): void => {
        this.accountSearchFormLayout = formLayout;
      });
    }
  }

  // register the feature.
  angular.module('app').controller('app.accounts.AccountsController', AccountsController);
}
