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

    optionsModel: any;

    selectedOptions: any;
    options: any;
    filter: string;
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
    static $inject: string[] = ['$scope', 'app.accounts.AccountsService', '$timeout'];
    /**
     * @inheritdoc
     */
    accountSearchFormLayout: components.formLayout.IFormLayout;

    optionsModel: any;

    selectedOptions: any;
    options: any;
    filter: string;

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $scope Injected scope dependency.
     * @param accountsService Injected account service dependency.
     */
    constructor(private $scope: ng.IScope, private accountsService: IAccountsService, private $timeout: ng.ITimeoutService) {
      // use the view model for this controller.
      var vm: IAccountsController = <any>this;


      vm.selectedOptions = [];
      vm.options = [
        {id: 10, name: 'Bernd', email: 'b@w.de'},
        {id: 11, name: 'Bent', email: 'b@w.de'},
        {id: 12, name: 'Werber', email: 'b@w.com'},
        {id: 13, name: 'Wessels', email: 'b@w.com'}
      ];
      vm.filter = '';

      // item.name group by item.email for item in items track by item.id


      vm.optionsModel = {
        // required properties.
        filteredOptions: [],
        selectedOptions: [],
        filter: '',
        // customization.
        options: [],
        timeout: null,
        loadOptions: (): void => {
          if (vm.optionsModel.timeout) {
            $timeout.cancel(vm.optionsModel.timeout);
          }
          vm.optionsModel.timeout = $timeout(_.bind((): void => {
            vm.optionsModel.options = [
              {name: 'Bernd', email: 'b@w.de'},
              {name: 'Bent', email: 'b@w.de'},
              {name: 'Werber', email: 'b@w.de'},
              {name: 'Wessels', email: 'b@w.de'}
            ];
            vm.optionsModel.filterOptions();
          }, this), 1000);
        },
        filterOptions: (): void => {
          vm.optionsModel.filteredOptions = _.filter(vm.optionsModel.options, _.bind((option: any): any => {
            if (option.name.toLowerCase().indexOf(vm.optionsModel.filter.toLowerCase()) > -1) {
              if (!_.some(vm.optionsModel.selectedOptions, (exclude: any): boolean => {
                  return exclude.name === option.name;
                })) {
                return true;
              }
            }
            return false;
          }, this));
        }
      };

      $scope.$watch((): any => {
          return vm.optionsModel.filter;
        },
        (newValue: any, oldValue: any): void => {
          if (newValue !== oldValue) {
            vm.optionsModel.loadOptions();
          }
        });
      $scope.$watch((): any => {
          return vm.optionsModel.selectedOptions.length;
        },
        (newValue: any, oldValue: any): void => {
          if (newValue !== oldValue) {
            vm.optionsModel.filterOptions();
          }
        });

      // activate the controller.
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
