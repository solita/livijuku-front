'use strict';

var angular = require('angular');
var $ = require('jquery');

angular.module('jukufrontApp')
.directive('focusToInvalid', function () {
  return {
    restrict: 'A',
    link: function($scope, element) {
      const removeListener = $scope.$on('focus-invalid', function() {
        $(element).find('.ng-invalid').focus();
      });

      $scope.$on('$destroy', removeListener);
    }
  };
});
