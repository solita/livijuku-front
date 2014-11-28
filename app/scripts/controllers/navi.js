'use strict';
/**
 * @ngdoc function
 * @name jukufrontApp.controller:NaviCtrl
 * @description
 * # NaviCtrl
 * Controller of the jukufrontApp
 * */
angular.module('jukufrontApp')
  .controller('NaviCtrl', function ($scope, $location) {
    $scope.isActive = function (route) {
      return route === $location.path();
    }
  });

