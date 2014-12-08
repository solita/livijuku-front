'use strict';
/**
 * @ngdoc function
 * @name jukufrontApp.controller:UtilCtrl
 * @description
 * # UtilCtrl
 * Controller of the jukufrontApp. Contains misc functions
 * */
angular.module('jukufrontApp')
  .controller('UtilCtrl', function ($scope, $rootScope, $location, Organisaatiot) {
    $scope.isActive = function (route) {
      return route === $location.path();
    }
    Organisaatiot.getOrganisaatiot()
      .then(function (data) {
        $rootScope.organisaatiot = data;
      });
  });

