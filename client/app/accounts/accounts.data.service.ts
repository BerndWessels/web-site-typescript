/**
 * This is the accounts feature.
 */
module app.accounts {
  'use strict';
  /**
   * This is the structure of the accounts feature data service.
   */
  export interface IAccountsDataService {
    /**
     * This will get an account search form layout for a given identifier.
     * @param id The form layout identifier.
     */
    getAccountSearchFormLayout: (id: number) => ng.IPromise<components.formLayout.IFormLayout>;
  }
  /**
   * This is the data service for the accounts feature.
   */
  class AccountsDataService implements IAccountsDataService {
    /**
     * This is the dependency injection for the class constructor.
     *
     * @type {string[]} Dependencies to be injected.
     */
    static $inject: string[] = ['$q'];

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $q Injected promise service dependency.
     */
    constructor(private $q: ng.IQService) {
      // use the view model for this controller.
      // var vm: IAccountsController = <any>this;
    }

    /**
     * This returns an empty table layout with a given cell type. todo Only needed for FAKE data. Can be removed later.
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
     * @inheritdoc
     */
    getAccountSearchFormLayout(id: number): ng.IPromise<components.formLayout.IFormLayout> {
      // return the form layout from an API call. // todo API instead of FAKE here please.
      var deferredResult: ng.IDeferred<components.formLayout.IFormLayout> = this.$q.defer<components.formLayout.IFormLayout>();
      var formLayout: components.formLayout.IFormLayout = {
        editMode: false,
        layout: this.getEmptyTableLayout('fieldset'),
        fieldSets: [
          {
            id: 1,
            template: components.formLayout.fieldsetTemplate,
            data: {legend: 'One', layout: this.getEmptyTableLayout('field')}
          },
          {
            id: 2,
            template: components.formLayout.fieldsetTemplate,
            data: {legend: 'Two', layout: this.getEmptyTableLayout('field')}
          }
        ],
        fields: [
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
        ],
        selected: null
      };
      // todo FAKE delayed response.
      setTimeout((): void => {
        deferredResult.resolve(formLayout);
      }, 2000);
      return deferredResult.promise;
    }
  }

  // register the feature.
  angular.module('app').service('app.accounts.AccountsDataService', AccountsDataService);
}
