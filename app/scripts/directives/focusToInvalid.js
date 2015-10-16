'use strict';

var angular = require('angular');
var $ = require('jquery');

angular.module('jukufrontApp')
.directive('focusToInvalid', function () {
  return {
    restrict: 'A',
    link: function($scope, element) {
      const removeListener = $scope.$on('focus-invalid', function() {
        // angular-bootstrap listens 'focus' events and calls $scope.$apply
        // which causes an exception without a timeout
        setTimeout(function() {
          var invalidInput = $(element).find('input.ng-invalid, select.ng-invalid')[0];
          if (invalidInput) {
            invalidInput.focus();
          } else {
            var errorLabel = $(element).find('.alert-danger')[0];
            if(errorLabel) {
              errorLabel.scrollIntoView();
            }
          }

          $(window).scrollTop($(window).scrollTop() - 150);
        });
      });

      $scope.$on('$destroy', removeListener);
    }
  };
});
