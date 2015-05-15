'use strict';

function headerController($scope, $rootScope, $route) {
  $scope.sallittu = require('utils/hasPermission');
  $rootScope.isCollapsed = false;

  $scope.toggleCollapse = function() {
    $rootScope.isCollapsed = !$rootScope.isCollapsed;
  };

  $scope.isActive = function (path) {
    if ($route.current && $route.current.regexp) {
      return $route.current.regexp.test(path);
    }
    return false;
  };
}

headerController.$inject = ['$scope', '$rootScope', '$route'];

module.exports = function() {
  return {
    restrict: 'E',
    template: require('./index.html'),
    scope: {
      user: '='
    },
    controller: headerController
  };
};
