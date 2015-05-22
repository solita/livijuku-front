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

  $scope.fullName = function(user) {
    if(!user) {
      return null;
    }
    if(!(user.etunimi && user.sukunimi)) {
      return null;
    }
    return user.etunimi + ' ' + user.sukunimi;
  };
}

headerController.$inject = ['$scope', '$rootScope', '$route'];

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
