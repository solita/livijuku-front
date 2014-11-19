'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:MainCtrl
 * @description
 * # AvustushakemusCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('LahHakemusCtrl', function ($scope) {
    $scope.hakemukset = [];
    $scope.addHakemus = function () {
      $scope.hakemus.status = 'Lähetetty';
      $scope.hakemukset.push($scope.hakemus);
      $scope.hakemus = '';
    };
    $scope.removeHakemus = function (index) {
      $scope.hakemukset.splice(index, 1);
    };
    $scope.saveHakemus = function () {
      $scope.hakemus.status = 'Keskeneräinen';
      $scope.hakemukset.push($scope.hakemus);
    };
  });
