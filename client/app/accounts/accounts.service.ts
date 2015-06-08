/**
 * This is the accounts feature.
 */
module app.accounts {
  'use strict';
  /**
   * This is the structure of the accounts feature service.
   */
  export interface IAccountsService {
    /**
     * This will get an account search form layout for a given identifier.
     * @param id The form layout identifier.
     */
    getAccountSearchFormLayout: (id: number) => ng.IPromise<components.formLayout.IFormLayout>;
  }
  /**
   * This is the service for the accounts feature.
   */
  class AccountsService implements IAccountsService {
    /**
     * This is the dependency injection for the class constructor.
     *
     * @type {string[]} Dependencies to be injected.
     */
    static $inject: string[] = ['$q', 'app.accounts.AccountsDataService'];

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $q Injected promise service dependency.
     * @param accountDataService Injected account data service dependency.
     */
    constructor(private $q: ng.IQService, private accountDataService: IAccountsDataService) {
      // use the view model for this controller.
      // var vm: IAccountsController = <any>this;
    }

    /**
     * This returns an empty table layout with a given cell type.
     * @param cellType
     * @returns {components.tableLayout.ITableLayout}
     */
    getEmptyTableLayout(cellType: string): components.tableLayout.ITableLayout {
      return <components.tableLayout.ITableLayout> {
        cellType: cellType,
        selectedCell: null,
        tableCells: [],
        tableRows: [[null]]
      };
    }

    /**
     * This returns all available account search form fields.
     * @returns {any[]}
     */
    getAccountSearchFormFields(): components.formLayout.IField[] {
      return [
        {id: 1, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'One', value: '1'}},
        {id: 2, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Two', value: '2'}},
        {id: 3, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'Three', value: '3'}},
        {id: 4, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Four', value: '4'}},
        {
          id: 5,
          template: components.formLayout.checkboxFieldTemplate,
          data: {category: 'Odd', label: 'Five', value: '5'}
        },
        {id: 6, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Six', value: '6'}},
        {id: 7, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'Seven', value: '7'}},
        {id: 8, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Eight', value: '8'}},
        {id: 9, template: components.formLayout.fieldTemplate, data: {category: 'Odd', label: 'Nine', value: '9'}},
        {id: 10, template: components.formLayout.fieldTemplate, data: {category: 'Even', label: 'Ten', value: '10'}},
      ];
    }

    /**
     * @inheritdoc
     */
    getAccountSearchFormLayout(id: number): ng.IPromise<components.formLayout.IFormLayout> {
      if (!id) {
        // return an empty form layout if id isn't set.
        var deferredResult: ng.IDeferred<components.formLayout.IFormLayout> = this.$q.defer<components.formLayout.IFormLayout>();
        var formLayout: components.formLayout.IFormLayout = {
          editMode: false,
          layout: this.getEmptyTableLayout('fieldset'),
          fieldSets: [],
          fields: this.getAccountSearchFormFields(),
          selected: null
        };
        deferredResult.resolve(formLayout);
        return deferredResult.promise;
      } else {
        // get the form layout from the data service.
        return this.accountDataService.getAccountSearchFormLayout(id);
      }
    }
  }

  // register the feature.
  angular.module('app').service('app.accounts.AccountsService', AccountsService);
}
