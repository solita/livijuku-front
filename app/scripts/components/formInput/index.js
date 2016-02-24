'use strict';

var angular = require("angular");
var _ = require("lodash");

function assertInputIsDefined(input, element) {
  if (!input) {
    var message = "Input or select element is not found inside form-group component.";
    console.log(message, element);
    throw({message: message, element: element});
  }
}

export function formGroupCompact() {
  return {
    restrict: "E",
    require: "^form",
    scope: {
      label: "@label",
      //input: "&input",
      //name: "&name",
      errormessage: "&errormessage"
    },
    template: require("./input-compact.html"),
    transclude: true,
    link: function(scope, element, attributes, form) {
      var input = element[0].getElementsByTagName("input")[0];
      if (!input) {
        input = element[0].getElementsByTagName("select")[0];
        scope.feedbackSupport = false;
      } else {
        scope.feedbackSupport = true;
      }

      assertInputIsDefined(input, element[0]);

      angular.element(input).addClass("form-control");

      scope.name = input.getAttribute("name");
      scope.input = function() {
        return form[scope.name];
      };

      var formGroupClasses = function() {
        var input = form[scope.name];
        var classes = {
          'has-feedback': input.$invalid && input.$touched && scope.feedbackSupport,
          'has-error': input.$invalid && input.$touched,
          'has-warning': input.$invalid && !input.$touched,
          'has-success': input.$valid && input.$dirty
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
          return (scope.errormessage())(scope.input());
        } else {
          return "";
        }
      }
    }
  }
}

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

export function formGroup() {
  return {
    restrict: "E",
    require: "^form",
    scope: {
      label: "@label",
      errormessage: "&errormessage"
    },
    template: require("./input.html"),
    transclude: true,
    link: function(scope, element, attributes, form) {
      var input = element[0].getElementsByTagName("input")[0];
      if (!input) {
        input = element[0].getElementsByTagName("select")[0];
        scope.feedbackSupport = false;
      } else {
        scope.feedbackSupport = true;
      }

      assertInputIsDefined(input, element[0]);

      angular.element(input).addClass("form-control");

      scope.name = input.getAttribute("name");
      scope.input = function() {
        return form[scope.name];
      };

      var formGroupClasses = function() {
        var input = form[scope.name];
        var classes = {
          'has-feedback': input.$invalid && input.$touched && scope.feedbackSupport,
          'has-error': input.$invalid && input.$touched,
          'has-warning': input.$invalid && !input.$touched,
          'has-success': input.$valid && input.$dirty
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
          return (scope.errormessage())(scope.input());
        } else {
          return "";
        }
      }
    }
  }
}
