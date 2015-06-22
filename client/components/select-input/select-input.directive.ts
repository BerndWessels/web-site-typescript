/**
 * This is a directive that lets you select multiple values from an input field.
 */
/* tslint:disable:no-string-literal */
/* tslint:disable:max-line-length */
((): void => {
  'use strict';
  /**
   * This is the dependency injection for the class constructor.
   * @type {string[]} Dependencies to be injected.
   */
  directive.$inject = ['$templateCache', '$parse'];
  /**
   * This is the directive constructor that takes the injected dependencies.
   * @param $templateCache Injected window service dependency.
   * @param $parse Injected parse service dependency.
   * @returns {ng.IDirective}
   */
  function directive($templateCache: ng.ITemplateCacheService, $parse: ng.IParseService): ng.IDirective {

    var NG_OPTIONS_REGEXP: RegExp = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
    // -------------------------------------------- "item.name group by item.email for item in options track by item.id"
    // 1: value expression (valueFn) --------------- item.name
    // 2: label expression (displayFn) -------------------------------- item.email
    // 3: group by expression (groupByFn)
    // 4: disable when expression (disableWhenFn)
    // 5: array item variable name --------------------------------------------------- item
    // 6: object item key variable name
    // 7: object item value variable name
    // 8: collection expression -------------------------------------------------------------- options
    // 9: track by expression --------------------------------------------------------------------------------- item.id

    /**
     *
     * @param optionsExp
     * @param selectElement
     * @param scope
     * @returns {{trackBy: (T|string), getWatchables: any, getOptions: (function(): {items: Array, selectValueMap: {}, getOptionFromViewValue: (function(any): any), getViewValueFromOption: (function(any): any)})}}
     */
    function parseOptionsExpression(optionsExp: string): any {

      var match: any = optionsExp.match(NG_OPTIONS_REGEXP);
      if (!(match)) {
        console.log('Expected expression in form of _select_ (as _label_)? for (_key_,)?_value_ in _collection_ but got ' + optionsExp);
        return;
      }

      console.log(match);
    }

    return <ng.IDirective> {
      replace: true,
      restrict: 'E',
      require: 'ngModel',
      scope: true,
      link: link,
      template: template
    };

    /**
     *
     * @param templateElement
     * @param templateAttributes
     */
    function template(templateElement: ng.IAugmentedJQuery, templateAttributes: ng.IAttributes): string {
      //
      parseOptionsExpression(templateAttributes['options']);
      // the selected options are the first in the control.
      var selectedOptionsTemplate: string = templateAttributes.hasOwnProperty('selectedOptionsTemplate') ?
        templateAttributes['selectedOptionsTemplate'] : 'select-input-selected-options';
      // the filtered options are in the dropdown below the control.
      var filteredOptionsTemplate: string = templateAttributes.hasOwnProperty('filteredOptionsTemplate') ?
        templateAttributes['filteredOptionsTemplate'] : 'select-input-filtered-options';
      // the input is after the selected options.
      return '<select-input-compiled root-popup-target>' +
        $templateCache.get(selectedOptionsTemplate) +
        $templateCache.get('select-input-input') +
        '<root-popup tabindex="-1" ng-if="focused">' +
        '<select-input-filtered-options>' +
        $templateCache.get(filteredOptionsTemplate) +
        '</select-input-filtered-options>' +
        '</root-popup>' +
        '</select-input-compiled>';
    }

    /**
     * This is the directives link functions.
     * @param scope
     * @param instanceElement
     * @param instanceAttributes
     * @param controller
     * @param transclude
     */
    function link(scope: ng.IScope,
                  instanceElement: ng.IAugmentedJQuery,
                  instanceAttributes: ng.IAttributes,
                  controller: ng.INgModelController,
                  transclude: ng.ITranscludeFunction): void {
      // transfer the id attribute to the input element.
      if (instanceAttributes.hasOwnProperty('id')) {
        var id: any = instanceElement.attr('id');
        instanceElement.removeAttr('id');
        instanceElement.find('input').attr('id', id);
      }
      // use the model as is, since we have a pretty complex use-case.
      controller.$formatters.push((modelValue: any): any => {
        (<any>scope).model = modelValue;
        return modelValue;
      });
      // catch the focus on the outer element.
      instanceElement.on('focus', (eventObject: JQueryEventObject): any => {
        if (eventObject.relatedTarget) {
          // find the origin of the element that lost the focus.
          var parent: Node = eventObject.relatedTarget.parentNode;
          while ((<any>parent).tagName.toLowerCase() !== 'body' &&
          (<any>parent).tagName.toLowerCase() !== 'select-input-compiled' &&
          (<any>parent).tagName.toLowerCase() !== 'select-input-filtered-options') {
            parent = parent.parentNode;
          }
          // focus the input element when we tabbed into the outer element.
          if ((<any>parent).tagName.toLowerCase() !== 'select-input-compiled' &&
            (<any>parent).tagName.toLowerCase() !== 'select-input-filtered-options') {
            instanceElement.find('input').focus();
          }
        }
      });
      // catch the focus on the outer element.
      instanceElement.on('blur', (eventObject: JQueryEventObject): any => {
        instanceElement.removeClass('focus');
        (<any>scope).focused = false;
        (<any>scope).filter = '';
        scope.$apply();
      });
      // setting the focus will open the drop-down.
      (<any>scope).onFocus = (eventObject: JQueryEventObject): any => {
        if (eventObject.target.tagName.toLowerCase() === 'input') {
          (<any>scope).focused = true;
        }
        instanceElement.addClass('focus');
      };
      // resetting the focus will close the drop-down.
      (<any>scope).onBlur = (eventObject: JQueryEventObject): any => {
        if (eventObject.relatedTarget) {
          // find the origin of the element that receives the focus.
          var parent: Node = eventObject.relatedTarget.parentNode;
          while ((<any>parent).tagName.toLowerCase() !== 'body' &&
          (<any>parent).tagName.toLowerCase() !== 'select-input-compiled' &&
          (<any>parent).tagName.toLowerCase() !== 'select-input-filtered-options') {
            parent = parent.parentNode;
          }
          // only close the drop-down if the focus moved out of our control.
          if ((<any>parent).tagName.toLowerCase() !== 'select-input-compiled' &&
            (<any>parent).tagName.toLowerCase() !== 'select-input-filtered-options') {
            instanceElement.removeClass('focus');
            (<any>scope).focused = false;
            (<any>scope).filter = '';
          }
        } else {
          instanceElement.removeClass('focus');
          (<any>scope).focused = false;
          (<any>scope).filter = '';
        }

      };
      // this is the index of the focused option in the drop-down.
      (<any>scope).focusedIndex = 0;
      // handle key down events.
      (<any>scope).onKeyDown = (eventObject: JQueryEventObject, index: number): any => {
        if (!eventObject) {
          return;
        }
        // the event came from the input control.
        if (index === undefined) {
          switch (eventObject.keyCode) {
            case 40:
              // move the focus down.
              /* jshint expr: true */
              (<any>scope).focusedIndex < (<any>scope).model.filteredOptions.length - 1 ? (<any>scope).focusedIndex++ : angular.noop();
              eventObject.preventDefault();
              break;
            case 38:
              // move the focus up.
              /* jshint expr: true */
              (<any>scope).focusedIndex > 0 ? (<any>scope).focusedIndex-- : angular.noop();
              eventObject.preventDefault();
              break;
            case 13:
              // select the focused option.
              /* jshint expr: true */
              (<any>scope).model.filteredOptions.length > 0 ? (<any>scope).selectOption((<any>scope).focusedIndex) : angular.noop();
          }
        } else {
          // the event came from a selected option.
          switch (eventObject.keyCode) {
            case 46:
              // remove the selected option.
              (<any>scope).model.selectedOptions.splice(index, 1);
              // focus the input element.
              instanceElement.find('input').focus();
              break;
            case 8:
              // remove the selected option.
              (<any>scope).model.selectedOptions.splice(index, 1);
              // focus the input element.
              instanceElement.find('input').focus();
              // select the previous element.
              if (angular.element(eventObject.target).prev()) {
                angular.element(eventObject.target).prev().focus();
              }
              // prevent navigation.
              eventObject.preventDefault();
              break;
          }
        }
      };
      // select the option and the given index.
      (<any>scope).selectOption = (index: number): void => {
        // add the option to the selected options.
        (<any>scope).model.selectedOptions.push((<any>scope).model.filteredOptions[index]);
        // reset the filter.
        (<any>scope).model.filter = '';
        // reset the focus.
        (<any>scope).focusedIndex = 0;
        // focus the input element.
        instanceElement.find('input').focus();
      };
    }
  }

  // register the directive.
  angular.module('selectInput').directive('selectInput', directive);
})();
