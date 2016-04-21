'use strict';

var angular = require("angular");
var _ = require("lodash");

function assertInputIsDefined(input, element) {
  if (_.isEmpty(input)) {
    var message = "Input, select or textarea element is not found inside form-group component.";
    console.log(message, element);
    throw({message: message, element: element});
  }
}

function findInputElement(element) {
  const inputElements = ['input', 'select', 'textarea', 'ol'];
  for (var i = 0; i < inputElements.length; i++) {
    var input = element.find(inputElements[i]);
    if (input.length > 0) {
      return input;
    }
  }
}

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

      scope.feedbackSupport = !_.includes(['select', 'ol'], input[0].tagName.toLowerCase());

      input.addClass("form-control");

      scope.name = input.attr("name");

      function findModelController() {
        return form[scope.name] || input.controller('ngModel');
      }

      scope.input = findModelController;

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
          return (scope.errormessage())(scope.input(), input);
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
