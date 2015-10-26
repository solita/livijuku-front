// http://stackoverflow.com/questions/14419651/filters-on-ng-model-in-an-input/14425022#14425022
'use strict';

var angular = require('angular');
var c = require('utils/core');

/*
 * Deprecated - Älä käytä tätä enään
 * Tämän sijaan käytetään direktiiviä numeric-only ja text-inputtyyppiä (type="text")
 */
angular.module('jukufrontApp')
.directive('numericIntegerOnly', function(){
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      if(!modelCtrl) {
        return;
      }

      modelCtrl.$parsers.unshift(function (inputValue) {
        if (inputValue) {
          var transformedInput = inputValue.replace(/[^\d]/g, '');
          if (transformedInput !== inputValue) {
            modelCtrl.$setViewValue(transformedInput);
            modelCtrl.$render();
          }
          return transformedInput;
        }
      });
    }
  };
});
