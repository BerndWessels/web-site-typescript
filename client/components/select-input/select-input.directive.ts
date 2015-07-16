/**
 * This is a directive that lets you select multiple values from an input field.
 */
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
  directive.$inject = ['$templateCache', '$parse', '$timeout'];
  /**
   * This is the directive constructor that takes the injected dependencies.
   * @param $templateCache Injected window service dependency.
   * @param $parse Injected parse service dependency.
   * @returns {ng.IDirective}
   */
  function directive($templateCache: ng.ITemplateCacheService, $parse: ng.IParseService, $timeout: ng.ITimeoutService): ng.IDirective {

    var hashKey: number = 9999;

    return <ng.IDirective> {
      replace: true,
      restrict: 'E',
      require: 'ngModel',
      scope: {
        options: '@',
        filter: '=',
        useExternalFilter: '@',
        multiple: '@',
        listSelected: '@',
        placeholderSource: '@placeholder',
        alwaysAllowPlaceholder: '@',
        addNewOption: '=',
        selectedOptionsLimit: '@',
        selectedOptionsLimitText: '@'
      },
      link: link,
      template: template
    };

    function parseOptionsExpression(optionsExp: string, scope: ng.IScope): any {

      var NG_OPTIONS_REGEXP: RegExp = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?(?:\s+disable\s+when\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/;
      // 1: value expression (valueFn)
      // 2: label expression (displayFn)
      // 3: group by expression (groupByFn)
      // 4: disable when expression (disableWhenFn)
      // 5: array item variable name
      // 6: object item key variable name
      // 7: object item value variable name
      // 8: collection expression
      // 9: track by expression

      var match: RegExpMatchArray = optionsExp.match(NG_OPTIONS_REGEXP);
      if (!(match)) {
        console.log('iexp', 'Expected expression in form of "_select_ (as _label_)? for (_key_,)?_value_ in _collection_" but got ' + optionsExp);
        return null;
      }

      // extract the parts from the ngOptions expression

      // the variable name for the value of the item in the collection
      var valueName: string = match[5] || match[7];
      // the variable name for the key of the item in the collection
      var keyName: string = match[6];

      // an expression that generates the viewValue for an option if there is a label expression
      var selectAs: string = / as /.test(match[0]) && match[1];
      // an expression that is used to track the id of each object in the options collection
      var trackBy: string = match[9];
      // an expression that generates the viewValue for an option if there is no label expression
      var valueFn: any = $parse(match[2] ? match[1] : valueName);
      var selectAsFn: any = selectAs && $parse(selectAs);
      var viewValueFn: any = selectAsFn || valueFn;
      var trackByFn: any = trackBy && $parse(trackBy);

      // get the value by which we are going to track the option
      // if we have a trackFn then use that (passing scope and locals)
      // otherwise just hash the given viewValue
      var getTrackByValue: any = trackBy ?
        function (viewValue: any, locals: any): any {
          return trackByFn(scope, locals);
        } :
        function getHashOfValue(viewValue: any): any {
          return hashKey++;
        };
      var displayFn: any = $parse(match[2] || match[1]);
      var groupByFn: any = $parse(match[3] || '');
      var disableWhenFn: any = $parse(match[4] || '');
      var valuesFn: any = $parse(match[8]);

      var locals: any = {};
      var getLocals: any = keyName ? function (value: any, key: any): any {
        locals[keyName] = key;
        locals[valueName] = value;
        return locals;
      } : function (value: any): any {
        locals[valueName] = value;
        return locals;
      };


      function Option(selectValue: any, viewValue: any, label: any, group: any, disabled: any): void {
        this.selectValue = selectValue;
        this.viewValue = viewValue;
        this.label = label;
        this.group = group;
        this.disabled = disabled;
      }

      return {
        trackBy: trackBy,
        getWatchables: (<any>$parse)(valuesFn, function (values: any): any {
          // create a collection of things that we would like to watch (watchedArray)
          // so that they can all be watched using a single $watchCollection
          // that only runs the handler once if anything changes
          var watchedArray: any = [];
          values = values || [];

          Object.keys(values).forEach(function getWatchable(key: any): any {
            var locals: any = getLocals(values[key], key);
            var selectValue: any = getTrackByValue(values[key], locals);
            watchedArray.push(selectValue);

            // only need to watch the displayFn if there is a specific label expression
            if (match[2]) {
              var label: any = displayFn(scope, locals);
              watchedArray.push(label);
            }

            // only need to watch the disableWhenFn if there is a specific disable expression
            if (match[4]) {
              var disableWhen: any = disableWhenFn(scope, locals);
              watchedArray.push(disableWhen);
            }
          });
          return watchedArray;
        }),

        getOptions: function (): any {

          var optionItems: any = [];
          var selectValueMap: any = {};

          // the option values were already computed in the `getWatchables` fn,
          // which must have been called to trigger `getOptions`
          var optionValues: any = valuesFn(scope) || [];

          var keys: any = Object.keys(optionValues);
          keys.forEach(function getOption(key: any): void {

            // ignore "angular" properties that start with $ or $$
            if (key.charAt(0) === '$') {
              return;
            }

            var value: any = optionValues[key];
            var locals: any = getLocals(value, key);
            var viewValue: any = viewValueFn(scope, locals);
            var selectValue: any = getTrackByValue(viewValue, locals);
            var label: any = displayFn(scope, locals);
            var group: any = groupByFn(scope, locals);
            var disabled: any = disableWhenFn(scope, locals);
            var optionItem: any = new Option(selectValue, viewValue, label, group, disabled);

            optionItems.push(optionItem);
            selectValueMap[selectValue] = optionItem;
          });

          return {
            items: optionItems,
            selectValueMap: selectValueMap,
            getOptionFromViewValue: function (value: any): any {
              return selectValueMap[getTrackByValue(value, getLocals(value))];
            },
            getViewValueFromOption: function (option: any): any {
              // if the viewValue could be an object that may be mutated by the application,
              // we need to make a copy and not return the reference to the value on the option.
              return trackBy ? angular.copy(option.viewValue) : option.viewValue;
            }
          };
        }
      };
    }

    /**
     *
     * @param templateElement
     * @param templateAttributes
     */
    function template(templateElement: ng.IAugmentedJQuery, templateAttributes: ng.IAttributes): string {
      // the selected options are the first in the control.
      var selectedOptionsTemplate: string = templateAttributes.hasOwnProperty('selectedOptionsTemplate') ?
        templateAttributes['selectedOptionsTemplate'] : 'select-input-selected-options';
      // there are also selected options in a popup if the count is limited.
      var selectedOptionsPopupTemplate: string = templateAttributes.hasOwnProperty('selectedOptionsPopupTemplate') ?
        templateAttributes['selectedOptionsPopupTemplate'] : 'select-input-selected-options-popup';
      // the filtered options are in the dropdown below the control.
      var filteredOptionsTemplate: string = templateAttributes.hasOwnProperty('filteredOptionsTemplate') ?
        templateAttributes['filteredOptionsTemplate'] : 'select-input-filtered-options' + (templateAttributes.hasOwnProperty('addNewOption') ? '' : '-only');
      // the input is after the selected options.
      return '<select-input-compiled root-popup-target ng-click="click($event);">' +
        $templateCache.get(selectedOptionsTemplate) +
        $templateCache.get('select-input-input') +
        '<root-popup arrow align tabindex="-1" open="openLimited" id="{{limitedPopupId}}">' +
        '<select-input-selected-options>' +
        $templateCache.get(selectedOptionsPopupTemplate) +
        '</select-input-selected-options>' +
        '</root-popup>' +
        '<root-popup align tabindex="-1" open="open">' +
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
      // create internal ids.
      (<any>scope).limitedPopupId = 'select-input-' + new Date().getTime();
      // setup the options for binding.
      (<any>scope).filteredOptions = [];
      (<any>scope).selectedOptions = [];
      // initialize optional bindings.
      if (!scope.hasOwnProperty('selectedOptionsLimit')) {
        (<any>scope).selectedOptionsLimit = 9999;
      }
      if (!scope.hasOwnProperty('selectedOptionsLimitText')) {
        (<any>scope).selectedOptionsLimitText = 'selected';
      }
      // initialize internal bindings.
      (<any>scope).open = false;
      (<any>scope).openLimited = false;
      // parse the options expression.
      var options: any = parseOptionsExpression(instanceAttributes['options'], scope.$parent);
      // update the options.
      function updateOptions(): void {
        // filter the bound options.
        (<any>scope).filteredOptions = _.filter(options.getOptions().items, (filteredOption: any): boolean => {
          var result: boolean = true;
          // if no external filter then filter internally on the label.
          if ((<any>scope).useExternalFilter !== 'true' && (<any>scope).filter && (<any>scope).filter.length > 0) {
            result = result && _.contains(filteredOption.label.toLowerCase(), (<any>scope).filter.toLowerCase());
          }
          // update the selected flag on the option.
          filteredOption.selected = _.contains(JSON.stringify(controller.$viewValue), JSON.stringify(filteredOption.viewValue));
          // remove already selected options if necessary.
          if ((<any>scope).listSelected !== 'true') {
            result = result && !filteredOption.selected;
          }
          return result;
        });
        // reset the focused index.
        (<any>scope).focusedIndex = 0;
      }

      // initialize the options.
      updateOptions();
      // we will re-render the option elements if the option values or labels change.
      scope.$watch((): any[] => {
        return options.getOptions().items.toString();
      }, (newValue: any, oldValue: any): void => {
        if (newValue !== oldValue) {
          updateOptions();
        }
      });
      // we will re-render the option elements if the option values or labels change.
      scope.$watch('filter', (newValue: any, oldValue: any): void => {
        if (newValue !== oldValue) {
          updateOptions();
        }
      });
      // transform model value to view value.
      controller.$formatters.push((modelValue: any): any => {
        var viewValue: any;
        // turn model values into view values.
        if ((<any>scope).multiple === 'true') {
          // multiple
          viewValue = _.map(modelValue, (modelOption: any): any => {
            return _.find(options.getOptions().items, (viewOption: any): boolean => {
              return JSON.stringify(modelOption) === JSON.stringify(viewOption.viewValue);
            });
          });
        } else {
          // single
          viewValue = [_.find(options.getOptions().items, (viewOption: any): boolean => {
            return JSON.stringify(modelValue) === JSON.stringify(viewOption.viewValue);
          })];
        }
        return viewValue;
      });
      // transform view value to model value.
      controller.$parsers.push((viewValue: any): any => {
        var modelValue: any;
        // this is called after the controller.$viewValue has changed and controller.$commitViewValue() was called.
        if ((<any>scope).multiple === 'true') {
          // multiple
          modelValue = _.map(viewValue, (filteredOption: any): any => {
            return filteredOption.viewValue;
          });
        } else {
          // single
          modelValue = viewValue.length > 0 ? viewValue[0].viewValue : null;
        }
        // make sure the bindings are updated.
        controller.$render();
        return modelValue;
      });
      // update the bindings.
      controller.$render = (): void => {
        (<any>scope).selectedOptions = controller.$viewValue;
        updateOptions();
      };
      // apply the placeholder.
      scope.$watch((): any => {
        return (<any>scope).alwaysAllowPlaceholder === 'true' && (<any>scope).open ? true : (<any>scope).selectedOptions.length === 0;
      }, (newValue: any, oldValue: any): void => {
        (<any>scope).placeholder = newValue ? (<any>scope).placeholderSource : '';
      });
      // limited.
      (<any>scope).onFocusLimited = (eventObject: JQueryEventObject): any => {
        $timeout((): void => {
          (<any>scope).open = false;
          (<any>scope).openLimited = true;
          instanceElement.addClass('focus');
        });
      };
      // limit.
      (<any>scope).onFocusLimit = (eventObject: JQueryEventObject): any => {
        $timeout((): void => {
          (<any>scope).open = false;
          (<any>scope).openLimited = true;
          instanceElement.addClass('focus');
        });
      };
      // limit.
      (<any>scope).onKeyDownLimit = (eventObject: JQueryEventObject): any => {
        if (!eventObject) {
          return;
        }
        // move focus to the first selected option.
        if (eventObject.keyCode === 9 && eventObject.shiftKey === false) {
          var selector: string = '#' + (<any>scope).limitedPopupId + ' selected-option';
          angular.element(document.querySelector(selector)).focus();
          eventObject.preventDefault();
          eventObject.stopPropagation();
        }
      };
      // limit.
      (<any>scope).onFocusLimited = (eventObject: JQueryEventObject): any => {
        $timeout((): void => {
          console.log();
        });
      };
      // limit.
      (<any>scope).onBlurLimited = (eventObject: JQueryEventObject): any => {
        $timeout((): void => {
          var relatedTarget: Element = document.activeElement;
          if (relatedTarget) {
            // find the origin of the element that receives the focus.
            var parent: Node = relatedTarget.parentNode;
            while ((<any>parent).tagName &&
            (<any>parent).tagName.toLowerCase() !== 'body' &&
            (<any>parent).tagName.toLowerCase() !== 'select-input-compiled' &&
            (<any>parent).tagName.toLowerCase() !== 'select-input-selected-options') {
              parent = parent.parentNode;
            }
            // only close the drop-down if the focus moved out of our control.
            if ((<any>parent) !== instanceElement[0] &&
              (
                !(<any>parent).tagName ||
                (<any>parent).tagName.toLowerCase() !== 'select-input-selected-options'
              )
            ) {
              instanceElement.removeClass('focus');
              (<any>scope).openLimited = false;
              (<any>scope).filter = '';
            }
          } else {
            instanceElement.removeClass('focus');
            (<any>scope).openLimited = false;
            (<any>scope).filter = '';
          }
        });
      };
      // limit.
      (<any>scope).onKeyDownLimited = (eventObject: JQueryEventObject, index: number): any => {
        if (!eventObject) {
          return;
        }
        // allow tab to the next element.
        if (eventObject.keyCode === 9) {
          if (eventObject.shiftKey === true && !angular.element(eventObject.target).prev()[0]) {
            // redirect to the limit element.
            instanceElement.find('selected-option').focus();
            eventObject.preventDefault();
            eventObject.stopPropagation();
            return;
          }
          // select the next element.
          if (eventObject.shiftKey === false && !angular.element(eventObject.target).next()[0]) {
            // redirect tab from the last element to the input.
            instanceElement.find('input').focus();
            eventObject.preventDefault();
            eventObject.stopPropagation();
            return;
          }
          return;
        }
        // the event came from a selected option.
        switch (eventObject.keyCode) {
          // escape closes the popup.
          case 27:
            (<any>scope).openLimited = false;
            instanceElement.find('input').focus();
            break;
          case 46:
          case 8:
            // remove the selected option.
            (<any>scope).deselectOption(index, true);
            // select the previous element.
            if (angular.element(eventObject.target).prev()[0]) {
              angular.element(eventObject.target).prev()[0].focus();
            } else if (angular.element(eventObject.target).next()[0]) {
              angular.element(eventObject.target).next()[0].focus();
            } else {
              // focus the input element.
              instanceElement.find('input').focus();
            }
            // prevent navigation.
            eventObject.preventDefault();
            eventObject.stopPropagation();
            break;
        }
      };
      // setting the focus will open the drop-down.
      (<any>scope).onFocus = (eventObject: JQueryEventObject): any => {
        $timeout((): void => {
          (<any>scope).open = true;
          (<any>scope).openLimited = false;
          instanceElement.addClass('focus');
        });
      };
      // resetting the focus will close the drop-down.
      (<any>scope).onBlur = (eventObject: JQueryEventObject): any => {
        $timeout((): void => {
          var relatedTarget: Element = document.activeElement;
          if (relatedTarget) {
            // find the origin of the element that receives the focus.
            var parent: Node = relatedTarget.parentNode;
            while ((<any>parent).tagName &&
            (<any>parent).tagName.toLowerCase() !== 'body' &&
            (<any>parent).tagName.toLowerCase() !== 'select-input-compiled' &&
            (<any>parent).tagName.toLowerCase() !== 'select-input-filtered-options') {
              parent = parent.parentNode;
            }
            // only close the drop-down if the focus moved out of our control.
            if ((<any>parent) !== instanceElement[0] &&
              (
                !(<any>parent).tagName ||
                (<any>parent).tagName.toLowerCase() !== 'select-input-filtered-options'
              )
            ) {
              instanceElement.removeClass('focus');
              (<any>scope).open = false;
              (<any>scope).openLimited = false;
              (<any>scope).filter = '';
            }
          } else {
            instanceElement.removeClass('focus');
            (<any>scope).open = false;
            (<any>scope).openLimited = false;
            (<any>scope).filter = '';
          }
        });
      };
      // this is the index of the focused option in the drop-down.
      (<any>scope).focusedIndex = 0;
      // handle key down events.
      (<any>scope).onKeyDown = (eventObject: JQueryEventObject, index: number): any => {
        if (!eventObject) {
          return;
        }
        // escape closes the popup.
        if (eventObject.keyCode === 27) {
          if ((<any>scope).open) {
            (<any>scope).open = false;
            (<any>scope).openLimited = false;
            (<any>scope).filter = '';
          }
        } else {
          // any other key opens it.
          (<any>scope).open = true;
          (<any>scope).openLimited = false;
        }
        // add-new-option mode.
        var addNewOptionAdjustment: number = (<any>scope).addNewOption ? 1 : 0;
        // handle common key events.
        switch (eventObject.keyCode) {
          case 40:
            // move the focus down.
            /* jshint expr: true */
            (<any>scope).focusedIndex < (<any>scope).filteredOptions.length - 1 + addNewOptionAdjustment ? (<any>scope).focusedIndex++ : angular.noop();
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
            if ((<any>scope).addNewOption && (<any>scope).focusedIndex === 0) {
              (<any>scope).addNewOption();
            } else {
              (<any>scope).filteredOptions.length > (<any>scope).focusedIndex - addNewOptionAdjustment ? (<any>scope).toggleOption((<any>scope).focusedIndex - addNewOptionAdjustment) : angular.noop();
            }
            break;
        }
        if (index !== undefined) {
          // the event came from a selected option.
          switch (eventObject.keyCode) {
            case 46:
              // remove the selected option.
              (<any>scope).deselectOption(index, true);
              // focus the input element.
              instanceElement.find('input').focus();
              break;
            case 8:
              // remove the selected option.
              (<any>scope).deselectOption(index, true);
              // focus the input element.
              instanceElement.find('input').focus();
              // select the previous element.
              if (angular.element(eventObject.target).prev()[0]) {
                angular.element(eventObject.target).prev()[0].focus();
              }
              // prevent navigation.
              eventObject.preventDefault();
              eventObject.stopPropagation();
              break;
          }
        }
      };
      // focus the input when the element is clicked.
      (<any>scope).click = (eventObject: JQueryEventObject): void => {
        if (eventObject.target === instanceElement[0]) {
          instanceElement.find('input').focus();
        }
      };
      // toggle the selected status of the option and the given index.
      (<any>scope).toggleOption = (index: number): void => {
        // select or deselect the option at the given index.
        (<any>scope).filteredOptions[index].selected ? (<any>scope).deselectOption(index, false) : (<any>scope).selectOption(index);
        // update the focus.
        (<any>scope).focusedIndex = (<any>scope).listSelected === 'true' ? index : 0;
      };
      // select the option and the given index.
      (<any>scope).selectOption = (index: number): void => {
        // multiple selection.
        if ((<any>scope).multiple === 'true') {
          // clone the viewValue.
          var newViewValue: any[] = _.map(controller.$viewValue, (item: any): any => {
            return item;
          });
          // set the new options selected flag.
          var selectedOption: any = (<any>scope).filteredOptions[index];
          selectedOption.selected = true;
          // add the option to the selected options.
          newViewValue.push(selectedOption);
          // set the new view value.
          controller.$setViewValue(newViewValue);
        } else {
          // set the new options selected flag.
          var singleSelectedOption: any = (<any>scope).filteredOptions[index];
          singleSelectedOption.selected = true;
          // set the new view value.
          controller.$setViewValue([singleSelectedOption]);
        }
        // update the filtered options.
        updateOptions();
        // reset the filter if necessary.
        if ((<any>scope).listSelected !== 'true') {
          (<any>scope).filter = '';
        }
        // focus the input element.
        instanceElement.find('input').focus();
      };
      // deselect the option at the given index.
      (<any>scope).deselectOption = (index: number, fromSelected: boolean): void => {
        // get the option to be deselected.
        var deselectedOption: any = fromSelected ? controller.$viewValue[index] : (<any>scope).filteredOptions[index];
        // reset the selected flag.
        deselectedOption.selected = false;
        // clone the viewValue and remove the deselected option.
        var newViewValue: any[] = _.without(controller.$viewValue, _.find(controller.$viewValue, (selectedOption: any): boolean => {
          return JSON.stringify(selectedOption.viewValue) === JSON.stringify(deselectedOption.viewValue);
        }));
        // set the new view value.
        controller.$setViewValue(newViewValue);
        // update the filtered options.
        updateOptions();
        // focus the input element.
        if (!fromSelected) {
          instanceElement.find('input').focus();
        }
      };
    }
  }

  // register the directive.
  angular.module('selectInput').directive('selectInput', directive);
})
();
