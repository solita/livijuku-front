'use strict';

var angular = require("angular");
var _ = require("lodash");
var c = require("utils/core");

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

export function floatDirective(formatFloat) {
  return function() {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, modelCtrl) {

        assertModelCtrlIsDefined(modelCtrl, element);

        var scale = _.find([parseInt(attrs.scale), 2], _.isFinite);
        var max = parseFloat(attrs.max);
        var min = parseFloat(attrs.min);

        function toDecimalString(integerPart, fractionPart, decimalPoint) {
          return integerPart + (c.isDefinedNotNull(fractionPart) ? decimalPoint + fractionPart : '');
        }

        modelCtrl.$parsers.unshift(function (inputValue) {
          if (c.isDefinedNotNull(inputValue)) {
            var parts = _.split(inputValue, ',', 2);
            var removeInvalidChars = txt => _.replace(txt, /[^\d\s]/g, '');

            var integer = removeInvalidChars(parts[0]);
            var fraction = c.isDefinedNotNull(parts[1]) ? removeInvalidChars(parts[1]).substring(0, scale) : null;

            var validDecimalInput = toDecimalString(integer, fraction, ',');

            if (!_.isEqual(validDecimalInput, inputValue)) {
              modelCtrl.$setViewValue(validDecimalInput);
              modelCtrl.$render();
            }

            function parse(txt) {
              var result = parseFloat(_.replace(txt, /\s/g, ''));
              return _.isFinite(result) ? result : undefined;
            }

            return c.isNotBlank(inputValue) ? parse(toDecimalString(integer, fraction, '.')) : null;
          }
          return null;
        });

        element.on("blur", function () {
          if (modelCtrl.$valid && !_.isEqual(modelCtrl.$viewValue, formatFloat(modelCtrl.$modelValue))) {
            modelCtrl.$viewValue = formatFloat(modelCtrl.$modelValue);
            modelCtrl.$render();
          };
        });

        modelCtrl.$formatters.unshift(formatFloat);

        if (_.isFinite(max)) {
          modelCtrl.$validators.max = modelValue => c.isNullOrUndefined(modelValue) || modelValue <= max;
        }

        if (_.isFinite(min)) {
          modelCtrl.$validators.min = modelValue => c.isNullOrUndefined(modelValue) || modelValue >= min;
        }
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
