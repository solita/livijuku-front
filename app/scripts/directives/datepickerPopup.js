/* http://stackoverflow.com/questions/24198669/angular-bootsrap-datepicker-date-format-does-not-format-ng-model-value */
'use strict';

var angular = require('angular');
angular.module('jukufrontApp')
  .directive('datepickerPopup', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var focusedElement;
        element.on('click', function () {
          if (focusedElement != this) {
            this.select();
            focusedElement = this;
          }
        });
        element.on('blur', function () {
          focusedElement = null;
        });
      }
    };
});
