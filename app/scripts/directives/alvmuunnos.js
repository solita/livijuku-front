'use strict';
var angular = require('angular');
var _ = require('lodash');
var c = require('utils/core');

angular.module('jukufrontApp')
  .directive('alvmuunnos', function () {
    return {
      require: 'ngModel',
      link: function (scope, element, attributes, ngModel) {

        var alvPercentage = 0;
        attributes.$observe('alvmuunnos', function(value) {
          var newALV = parseFloat(value);
          if (alvPercentage !== newALV){
            alvPercentage = newALV;
            ngModel.$processModelValue();
          }
        });

        ngModel.$parsers.push(function toModel(input){
          return c.maybe(value => value / (1 + (alvPercentage/100)), input, null);
        });
        ngModel.$formatters.push(function toView(input){
          return c.maybe(value => (1 + alvPercentage/100) * value, input, null);
        });
      }
    }
  });
