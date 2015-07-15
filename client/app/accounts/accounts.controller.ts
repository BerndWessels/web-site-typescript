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

    selectedOption: any;
    selectedOptions: any;
    options: any;
    filter: string;
    filterB: string;
    placeholder: string;
    addNewOption(): void;
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

    selectedOption: any;
    selectedOptions: any;
    options: any;
    filter: string;
    filterB: string;
    placeholder: string;
    addNewOption: () => void;

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $scope Injected scope dependency.
     * @param accountsService Injected account service dependency.
     */
    constructor(private $scope: ng.IScope, private accountsService: IAccountsService, private $timeout: ng.ITimeoutService) {
      // use the view model for this controller.
      var vm: IAccountsController = <any>this;

      var dbOptions: any[] = [
        {id: 1, name: 'Option One', email: 'one@option.com'},
        {id: 2, name: 'Option Two', email: 'two@option.com'},
        {id: 3, name: 'Option Three', email: 'three@option.com'},
        {id: 4, name: 'Option Four', email: 'four@option.com'},
        {id: 5, name: 'Option Five', email: 'five@option.com'}
      ];

      vm.selectedOption = {id: 3, name: 'Option Three', email: 'three@option.com'};
      vm.selectedOptions = [
        {id: 5, name: 'Option Five', email: 'five@option.com'},
        {id: 1, name: 'Option One', email: 'one@option.com'},
        {id: 3, name: 'Option Three', email: 'three@option.com'}
      ];
      vm.options = dbOptions;
      vm.filter = '';
      vm.placeholder = 'Username';
      vm.addNewOption = ((): void => {
        alert(vm.filterB);
      }).bind(this);

      $scope.$watch((): any => {
          return vm.filter;
        },
        (newValue: any, oldValue: any): void => {
          if (newValue !== oldValue) {
            vm.options = _.filter(dbOptions, _.bind((option: any): any => {
              if (option.name.toLowerCase().indexOf(vm.filter.toLowerCase()) > -1) {
                // if (!_.some(vm.selectedOptions, (exclude: any): boolean => {
                //    return exclude.name === option.name;
                //   })) {
                //   return true;
                // }
                return true;
              }
              return false;
            }, this));
          }
        });


      vm.optionsModel = {
        // required properties.
        filteredOptions: [],
        selectedOptions: [
          {name: 'Option One', email: 'one@option.com'},
          {name: 'Option Three', email: 'three@option.com'},
          {name: 'Option Five', email: 'five@option.com'}
        ],
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
              {name: 'Option One', email: 'one@option.com'},
              {name: 'Option Two', email: 'two@option.com'},
              {name: 'Option Three', email: 'three@option.com'},
              {name: 'Option Four', email: 'four@option.com'},
              {name: 'Option Five', email: 'five@option.com'}
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
