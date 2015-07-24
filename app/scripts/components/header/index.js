'use strict';

function headerController($scope, $rootScope) {
  $scope.sallittu = require('utils/hasPermission');
  $rootScope.isCollapsed = false;

  $scope.toggleCollapse = function() {
    $rootScope.isCollapsed = !$rootScope.isCollapsed;
  };
}

headerController.$inject = ['$scope', '$rootScope'];

module.exports = function() {
  return {
    restrict: 'E',
    template: require('./index.html'),
    replace: true,
    scope: {
      user: '='
    },
    controller: headerController
  };
};
