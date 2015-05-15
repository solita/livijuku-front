'use strict';

function sidebarController($scope) {
  $scope.sallittu = require('utils/hasPermission');
}

sidebarController.$inject = ['$scope'];

module.exports = function() {
  return {
    restrict: 'E',
    template: require('./index.html'),
    scope: {
      user: '='
    },
    controller: sidebarController
  };
};
