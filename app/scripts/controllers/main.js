'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jukufrontApp
 */
angular.module('controllers.MainCtrl', ['services.thingsAsPromised'])
  .controller('MainCtrl', function ($scope, things) {
    things.getAll()
      .then(function(allThings) {
        $scope.awesomeThings = allThings;
      });
  });
