'use strict';
var angular = require('angular');
var _ = require('lodash');
angular.module('jukufrontApp')
  .directive('alvmuunnos', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attributes, ngModel) {
        if (!ngModel) return;
        var prosentti = 0;
        var alvmukana = false;
        attributes.$observe('alvmuunnos', function(value) {
          var obj = scope.$eval(value);
          if ((prosentti!=obj.prosentti) || (alvmukana!=obj.alvmukana)){
            prosentti = obj.prosentti;
            alvmukana = obj.alvmukana;
            ngModel.$viewValue = _.reduceRight(ngModel.$formatters, function(prev, fn) {
              return fn(prev);
            }, ngModel.$modelValue);
            return ngModel.$render();
          }
        });
         ngModel.$parsers.push(function toModel(input){
           if (alvmukana){
             return input;
           } else {
             return (1+prosentti/100)*input;
           }
         });
         ngModel.$formatters.push(function toView(input){
           if (alvmukana){
             return input;
           } else {
             return input/(1+(prosentti/100));
           }
         });
      }
    }
  });
