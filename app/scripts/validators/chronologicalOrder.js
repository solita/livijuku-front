'use strict';

var _ = require('lodash');

function computeViewValue(ngModel) {
  return _.reduceRight(ngModel.$formatters, (prev, fn) => fn(prev), ngModel.$modelValue);
}

function validateOrder(value, index, fields, values) {
  for(let i = 0; i < fields.length; i++) {
    if(i === index) {
      continue;
    }

    const comparatee = values[fields[i]];

    var isLinear = i < index ? new Date(value) > new Date(comparatee) : new Date(value) < new Date(comparatee);

    if(comparatee && !isLinear) {
      return false;
    }
  }

  return true;
}

module.exports = function ($timeout) {
 return {
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
      var allValues = scope.$eval(attr.chronologicalValues);
      var index = scope.$eval(attr.chronologicalIndex);
      var fields = scope.$eval(attr.chronologicalOrder);



      scope.$watch(attr.chronologicalValues, function () {
        ngModel.$viewValue = computeViewValue(ngModel);
        ngModel.$render();
      }, true);


      //For DOM -> model validation
      ngModel.$parsers.unshift(function(value) {
         ngModel.$setValidity('chronologicalOrder', validateOrder(value, index, fields, allValues));
         return value;
      });

      //For model -> DOM validation
      ngModel.$formatters.unshift(function(value) {
         ngModel.$setValidity('chronologicalOrder', validateOrder(value, index, fields, allValues));
         return value;
      });
    }
 };
};
