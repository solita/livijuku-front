'use strict';

function sidebarController($scope, $rootScope, ConfigService) {
  $scope.sallittu = require('utils/user').hasPermission;

  $scope.uncollapse = function () {
    $rootScope.isCollapsed = false;
  };

  ConfigService.hae().then(function (response) {
    $scope.logoutUrl = response.logoutUrl;
  });
}

sidebarController.$inject = ['$scope', '$rootScope', 'ConfigService'];

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./index.html'),
    scope: {
      user: '='
    },
    controller: sidebarController
  };
};
