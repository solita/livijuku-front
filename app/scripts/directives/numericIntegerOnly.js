// http://stackoverflow.com/questions/14419651/filters-on-ng-model-in-an-input/14425022#14425022
'use strict';

var angular = require('angular');

angular.module('jukufrontApp')
.directive('numericIntegerOnly', function(){
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      if(!modelCtrl) {
        return;
      }
      modelCtrl.$parsers.unshift(function (inputValue) {
        if (angular.isUndefined(inputValue)) {
          var inputValue = '';
        }
        var transformedInput = inputValue ? inputValue.replace(/[^\d]/g,'') : null;
        if (transformedInput!=inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return transformedInput;
      });
    }
  };
});
