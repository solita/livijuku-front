// http://stackoverflow.com/questions/14419651/filters-on-ng-model-in-an-input/14425022#14425022
'use strict';

var angular = require('angular');

angular.module('jukufrontApp')
  .directive('numericOnly', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attrs, modelCtrl) {
        if (!modelCtrl) {
          return;
        }
        var regexpStr = "[^\\d,€\\s]";
        if (attrs.currencySymbol !== undefined) {
          if (attrs.currencySymbol !== '') regexpStr = "[^\\d," + "\\" + attrs.currencySymbol + "\\s]";
          else regexpStr = "[^\\d,\\s]"
        }
        modelCtrl.$parsers.push(function (inputValue) {
          if (angular.isUndefined(inputValue)) {
            var inputValue = '';
          }
          var re = new RegExp(regexpStr, "g");
          var transformedInput = inputValue ? inputValue.replace(re, '') : null;
          if (transformedInput != inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        });
      }
    };
  });
