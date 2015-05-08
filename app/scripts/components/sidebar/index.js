'use strict';
module.exports = function() {
  return {
    restrict: 'E',
    template: require('./index.html'),
    scope: {
      user: '='
    },
    controller: function($scope, $rootScope, $route) {
      $scope.sallittu = require('utils/hasPermission');
    }
  };
};
