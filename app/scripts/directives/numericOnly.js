// http://stackoverflow.com/questions/14419651/filters-on-ng-model-in-an-input/14425022#14425022
'use strict';

var angular = require('angular');

angular.module('jukufrontApp')
.directive('numericOnly', function(){
  return {
    require: 'ngModel',
    link: function(scope, element, attrs, modelCtrl) {
      if(!modelCtrl) {
        return;
      }
      modelCtrl.$parsers.push(function (inputValue) {
        if (angular.isUndefined(inputValue)) {
          var inputValue = '';
        }
        console.log('input:',inputValue);
        var transformedInput = inputValue ? inputValue.replace(/[^\d,€\s]/g,'') : null;
        if (transformedInput!=inputValue) {
          modelCtrl.$setViewValue(transformedInput);
          modelCtrl.$render();
        }
        return transformedInput;
      });
    }
  };
});
