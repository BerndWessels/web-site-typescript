/**
 * This is a components that helps you dynamically create forms with row and column span.
 */
module components.formLayout {
  'use strict';
  /**
   * This is the structure of the used fields.
   */
  export interface IUsedField {
    /**
     * This is the identifier of the used field.
     */
    id: number;
    /**
     * This is the type of the used field.
     */
      type: string;
  }
  /**
   * This is the structure of the field set data.
   */
  export interface IFieldSetData {
    /**
     * This is the legend of the field set.
     */
    legend: string;
    /**
     * This is the field layout within the field set.
     */
    layout: components.tableLayout.ITableLayout;
  }
  /**
   * This is the structure of a field set.
   */
  export interface IFieldSet extends components.tableLayout.ITableCellContent {
    /**
     * This is the data specific to a field set.
     */
    data: IFieldSetData;
  }
  /**
   * This is the structure of the field data.
   */
  export interface IFieldData {
    /**
     * This is the category of the field.
     */
    category: string;
    /**
     * This is the label of the field.
     */
    label: string;
    /**
     * This is the value of the field.
     */
    value: string; // todo : not here - extend to allow multiple types like ITextFieldData, INumericFieldData, ...
  }
  /**
   * This is the structure of a field.
   */
  export interface IField extends components.tableLayout.ITableCellContent {
    /**
     * This is the data specific to a field.
     */
    data: IFieldData;
  }
  /**
   *
   */
  export interface IFormLayout {
    /**
     * This is a flag that enables the table layout to be edited by the user.
     */
    editMode: boolean;
    /**
     * This is the form layout.
     */
    layout: components.tableLayout.ITableLayout;
    /**
     * These are the field sets for this form.
     */
    fieldSets: components.formLayout.IFieldSet[];
    /**
     * These are the fields for this form.
     */
    fields: components.formLayout.IField[];
    /**
     * This is the selected field in this form.
     */
    selected: components.tableLayout.ISelected;
  }

  /**
   * This is the structure of the form layout controller.
   */
  interface IFormLayoutController extends IFormLayout {
    /**
     * This is a list of used content (fields and field sets) in this form.
     */
    usedFields: IUsedField[];
    /**
     * This external callback will be called when the user selects a cell.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param cell The selected cell.
     */
    selectCell(layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void;
    /**
     * This external callback will be called to determine if content can be dropped.
     *
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param content The content to be dropped.
     */
    allowContent(layout: components.tableLayout.ITableLayout, content: components.tableLayout.ITableCellContent): boolean;
    /**
     * This external callback will be called when content has been dropped into this table layout.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param cell The newly created cell.
     */
    addedContent(layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void;
    /**
     * This external callback will be called when content has been dragged out of this table layout.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param layout This table layout.
     * @param cell The cell that will be removed.
     */
    removedContent(layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void;
    /**
     * This external callback is called to render cell content by an external scope.
     *
     * It is bound to the controller by the isolate scope attribute binding.
     * @param element The element into which the content should be rendered.
     */
    compileTableLayoutCellTemplate(element: JQuery): void;
  }
  /**
   * This is the controller for the form layout directive.
   */
  class FormLayoutController implements IFormLayoutController {
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
    fieldSets: IFieldSet[];
    /**
     * @inheritdoc
     */
    fields: IField[];
    /**
     * @inheritdoc
     */
    selected: components.tableLayout.ISelected;
    /**
     * @inheritdoc
     */
    selectCell: (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell) => void;
    /**
     * @inheritdoc
     */
    allowContent: (layout: components.tableLayout.ITableLayout, content: components.tableLayout.ITableCellContent) => boolean;
    /**
     * @inheritdoc
     */
    addedContent: (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell) => void;
    /**
     * @inheritdoc
     */
    removedContent: (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell) => void;
    /**
     * @inheritdoc
     */
    compileTableLayoutCellTemplate: (element: JQuery) => void;
    /**
     * @inheritdoc
     */
    usedFields: IUsedField[];

    /**
     * This is the constructor that takes the injected dependencies.
     *
     * @param $scope Injected scope dependency.
     * @param $compile Injected compile dependency.
     */
    constructor(private $scope: ng.IScope, private $compile: ng.ICompileService) {
      // use the view model for this controller.
      var vm: FormLayoutController = <FormLayoutController>this;
      /**
       * @inheritdoc
       */
      vm.usedFields = [];
      /**
       * @inheritdoc
       */
      vm.compileTableLayoutCellTemplate = (element: JQuery): void => {
        // this is not used in this scenario.
        vm.$compile(element)(vm.$scope);
      };
      /**
       * @inheritdoc
       */
      vm.selectCell = (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void  => {
        if (vm.editMode) {
          // reset the currently selected cell in all layouts.
          vm.layout.selectedCell = null;
          vm.fieldSets.forEach((fieldset: IFieldSet): void => {
            fieldset.data.layout.selectedCell = null;
          });
          // set the newly selected cell and layout.
          var selectedCell: components.tableLayout.ITableCell = cell;
          layout.selectedCell = selectedCell;
          vm.selected = {cell: selectedCell, layout: selectedCell ? layout : null};
        }
      };
      /**
       * @inheritdoc
       */
      vm.allowContent = (layout: components.tableLayout.ITableLayout, content: components.tableLayout.ITableCellContent): boolean => {
        // allow any number of field duplicates to be dropped.
        if (layout.cellType === 'field') {
          return false;
        }
        // do not allow duplicates for field sets.
        return _.some(vm.usedFields, (usedField: IUsedField): boolean => {
          return usedField.id === content.id && usedField.type === layout.cellType;
        });
      };
      /**
       * @inheritdoc
       */
      vm.addedContent = (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void => {
        // add a new field set.
        if (layout.cellType === 'fieldset') {
          var fieldSet: IFieldSet = _.find(vm.fieldSets, {id: cell.content.id});
          // remember the used fields within the new field set.
          if (fieldSet) {
            _.forEach(fieldSet.data.layout.tableCells, (tableCell: components.tableLayout.ITableCell): void => {
              vm.usedFields.push({id: tableCell.content.id, type: 'field'});
            });
          }
        }
        // add the new content to the used fields.
        if (!vm.allowContent(layout, cell.content)) {
          vm.usedFields.push({id: cell.content.id, type: layout.cellType});
        }
      };
      /**
       * @inheritdoc
       */
      vm.removedContent = (layout: components.tableLayout.ITableLayout, cell: components.tableLayout.ITableCell): void => {
        // remove a field set.
        if (layout.cellType === 'fieldset') {
          var fieldSet: IFieldSet = _.find(vm.fieldSets, {id: cell.content.id});
          // remove all used fields withing the removed field set.
          if (fieldSet) {
            _.forEach(fieldSet.data.layout.tableCells, (tableCell: components.tableLayout.ITableCell): void => {
              vm.usedFields = _.without(vm.usedFields, _.findWhere(vm.usedFields, {
                id: tableCell.content.id,
                type: fieldSet.data.layout.cellType
              }));
            });
          }
        }
        // remove the content from the used fields.
        vm.usedFields = _.without(vm.usedFields, _.findWhere(vm.usedFields, {
          id: cell.content.id,
          type: layout.cellType
        }));
      };
    }
  }

// register the controller.
  angular.module('app').controller('formLayout.FormLayoutController', FormLayoutController);
}
