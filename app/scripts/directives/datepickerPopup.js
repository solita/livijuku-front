/* http://stackoverflow.com/questions/24198669/angular-bootsrap-datepicker-date-format-does-not-format-ng-model-value */
'use strict';

var angular = require('angular');
angular.module('jukufrontApp')
  .directive('datepickerPopup', function () {
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function(scope, element, attr, controller) {
        //remove the default formatter from the input directive to prevent conflict
        controller.$formatters.shift();
      }
    }
  });
