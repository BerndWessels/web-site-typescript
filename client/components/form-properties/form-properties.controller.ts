/**
 * This is a components that helps you dynamically create forms with row and column span.
 */
module components.formProperties {
  'use strict';
  /**
   * This is the structure of the form properties controller.
   */
  interface IFormPropertiesController {
    /**
     * This is a flag that enables the table layout to be edited by the user.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     */
    editMode: boolean;
    /**
     * This is the form layout.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     */
    layout: components.tableLayout.ITableLayout;
    /**
     * These are the field sets for this form.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     */
    fieldSets: components.formLayout.IFieldSet[];
    /**
     * These are the fields for this form.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     */
    fields: components.formLayout.IField[];
    /**
     * This is the selected field in this form.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     */
    selected: components.tableLayout.ISelected;
    /**
     * This is the switch to group the fields by category.
     */
    groupFields: boolean;
    /**
     * These are the fields grouped by category.
     */
    groupedFields: any;
    /**
     * This will add a new field set.
     */
    addFieldSet(): void;
  }
  /**
   * This is the controller for the form properties directive.
   */
  class FormPropertiesController implements IFormPropertiesController {
    /**
     * This is the dependency injection for the class constructor.
     *
     * @type {string[]} Dependencies to be injected.
     */
    static $inject: string[] = ['$scope', '$compile'];
    /**
     * @inheritdoc
     */
    editMode: boolean;
    /**
     * @inheritdoc
     */
    layout: components.tableLayout.ITableLayout;
    /**
     * @inheritdoc
     */
    fieldSets: components.formLayout.IFieldSet[];
    /**
     * @inheritdoc
     */
    fields: components.formLayout.IField[];
    /**
     * @inheritdoc
     */
    selected: components.tableLayout.ISelected;
    /**
     * @inheritdoc
     */
    groupFields: boolean = false;
    /**
     * @inheritdoc
     */
    groupedFields: any;

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $scope Injected scope dependency.
     * @param $compile Injected compile dependency.
     */
    constructor(private $scope: ng.IScope, private $compile: ng.ICompileService) {
      // use the view model for this controller.
      var vm: FormPropertiesController = <FormPropertiesController>this;
      // group the fields.
      this.$scope.$watch((): any => {
        return this.fields;
      }, (newValue: any, oldValue: any) => {
        vm.groupedFields = _.chain(vm.fields)
          .groupBy((field: components.formLayout.IField): string => {
            return field.data.category;
          })
          .pairs()
          .map((item: any): any => {
            return {category: item[0], fields: item[1]};
          })
          .value();
      });
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
     * @inheritdoc
     */
    addFieldSet(): void {
      this.fieldSets.push({
        id: new Date().getTime(),
        template: components.formLayout.fieldsetTemplate,
        data: {
          legend: 'untitled',
          layout: this.getEmptyTableLayout('field')
        }
      });
    }
  }

  // register the controller.
  angular.module('app').controller('formProperties.FormPropertiesController', FormPropertiesController);
}
