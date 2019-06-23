'use strict';
import * as c from 'utils/core';
import * as _ from 'lodash';
import * as f from './float-directive';

function assertInputIsDefined(input, element) {
  if (_.isEmpty(input)) {
    var message = "Input, select or textarea element is not found inside form-group component.";
    console.log(message, element);
    throw({message: message, element: element});
  }
}

function findInputElement(element) {
  const inputElements = ['date-input', 'input', 'select', 'textarea', 'ol', 'tags-input'];
  for (var i = 0; i < inputElements.length; i++) {
    var input = element.find(inputElements[i]);
    if (input.length > 0) {
      return input;
    }
  }
}

const elementNameIn = (element, nameList) => _.includes(nameList, element.tagName.toLowerCase());

function formGroupDirective(template) {
  return {
    restrict: "E",
    require: "^form",
    scope: {
      label: "@label",
      errormessage: "&errormessage"
    },
    template: template,
    transclude: true,
    link: function(scope, element, attributes, form) {

      var input = findInputElement(element);
      assertInputIsDefined(input, element[0]);

      /*
       * Feedback icons only work with textual <input class="form-control"> elements.
       * They also do not work with input group with the add-on on the right.
       * See https://github.com/twbs/bootstrap/issues/12551
       */
      scope.feedbackSupport = elementNameIn(input[0], ['input']);

      if (elementNameIn(input[0], ['input', 'select', 'textarea', 'ol'])) {
        input.addClass("form-control");
      }

      scope.name = input.attr("name");

      function findModelController() {
        return form[scope.name] || input.controller('ngModel');
      }

      scope.inputModel = findModelController;

      var formGroupClasses = function() {
        var inputModel = findModelController();
        var classes = {
          'has-feedback': inputModel.$invalid && inputModel.$touched && scope.feedbackSupport,
          'has-error': inputModel.$invalid && inputModel.$touched,
          'has-warning': inputModel.$invalid && !inputModel.$touched,
          'has-success': inputModel.$valid && inputModel.$dirty
        };

        var activeClasses = _.filter(_.keys(classes), key => classes[key]);
        return activeClasses.join(" ");
      };

      /*
       * ng-class direktiivi ei toimi oikein vaan nopealla syötteellä
       * joku virheluokista saattaa jäädä päälle.
       *
       * Tämän ongelman takia bootstrapin validaatiotilaluokkien
       * asettaminen tehdään tässä käsin.
       */
      var body = element.children();
      scope.$watch(formGroupClasses, function(v) {
        body.removeClass('has-feedback has-error has-warning has-success');
        body.addClass(v);
      });

      scope.tooltipText = function() {
        var errorFn = scope.errormessage();
        if (errorFn) {
          return (scope.errormessage())(findModelController(), input);
        } else {
          return "";
        }
      }
    }
  }
}

export const formGroupCompact = _.constant(formGroupDirective(require("./input-compact.html")));
export const formGroup = _.constant(formGroupDirective(require("./input.html")));

function assertModelCtrlIsDefined(modelCtrl, element) {
  if (!modelCtrl) {
    var message = "Input model controller is not found.";
    console.log(message, element);
    throw({message: message, element: element});
  }
}

export function integerParser() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {

      assertModelCtrlIsDefined(modelCtrl, element);

      modelCtrl.$parsers.unshift(function (inputValue) {
        if (inputValue) {
          var transformedInput = inputValue.replace(/[^\d]/g, '');
          if (transformedInput !== inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          if (transformedInput !== '') {
            return parseInt(transformedInput);
          }
        }
        return null;
      });
    }
  }
}

export function floatDirective() {
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {

      assertModelCtrlIsDefined(modelCtrl, element);

      const scale = _.find([parseInt(attrs.scale), 2], _.isFinite);
      const max = parseFloat(attrs.max);
      const min = parseFloat(attrs.min);
      const unit = _.trim(attrs.unit);

      const format = _.partialRight(f.format, scale, unit);

      function setViewValue(newValue) {
        const start = element[0].selectionStart;
        const end = element[0].selectionEnd;

        modelCtrl.$setViewValue(newValue);
        modelCtrl.$render();

        // restore from variables...
        try {
          element[0].setSelectionRange(start - 1, end - 1);
        } catch (e) {
          // if setting selection range fails - do nothing
        }
      }

      modelCtrl.$parsers.unshift(function (inputValue) {

        if (c.isNotBlank(inputValue)) {
          const validInput = f.toValidInput(inputValue, unit, element[0].selectionStart - 1);
          if (!_.isEqual(validInput, inputValue)) {
            setViewValue(validInput);
          }

          return f.parseInput(validInput, scale);
        }
        return null;
      });

      element.on("blur", function () {
        if (modelCtrl.$valid) {
          modelCtrl.$processModelValue();
        };
      });

      modelCtrl.$formatters.push(format);

      if (_.isFinite(max)) {
        modelCtrl.$validators.max = modelValue => c.isNullOrUndefined(modelValue) || modelValue <= max;
      }

      if (_.isFinite(min)) {
        modelCtrl.$validators.min = modelValue => c.isNullOrUndefined(modelValue) || modelValue >= min;
      }
    }
  }
}

export function dateInput() {
  return {
    scope: {
      model: '=',
      name: '@',
      id: '@',
      readonly: '<inputReadonly'
    },
    require: "^form",
    restrict: 'E',
    template: require('./date-input.html'),
    link: function ($scope, element, attributes, form) {

      $scope.isOpen = false;
      $scope.required = c.isDefinedNotNull(attributes.required);
      $scope.readonly = c.coalesce($scope.readonly, false);

      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        formatMonth: 'MM',
        altInputFormats: ['dd.MM.yyyy']
      };

      /*
       * Class has-error does not change the color of buttons in an input-group
       * For buttons has-error color is obtained using class: btn-danger.
       */
      $scope.isError = function () {
        return form[$scope.name].$invalid && form[$scope.name].$touched;
      }

      $scope.togglePopupCalendar = function (ev) {
        $scope.isOpen = !$scope.isOpen;
      };
    }
  };
}
