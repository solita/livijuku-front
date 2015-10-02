'use strict';

function sidebarController($scope, ConfigService) {
  $scope.sallittu = require('utils/hasPermission');

  ConfigService.hae().then(function (response) {
    $scope.logoutUrl = response.logoutUrl;
  });
}

sidebarController.$inject = ['$scope', 'ConfigService'];

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
