'use strict';

/**
 * @ngdoc function
 * @name livijukufrontApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the livijukufrontApp
 */
angular.module('controllers.MainCtrl', ['services.thingsAsPromised'])
  .controller('MainCtrl', function ($scope, things) {
    things.getAll()
      .then(function(allThings) {
        $scope.awesomeThings = allThings;
      });
  });
