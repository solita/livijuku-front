'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the jukufrontApp
 */
angular.module('jukufrontApp')
  .controller('AboutCtrl', ['$scope',function ($scope) {
    $scope.someThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);
