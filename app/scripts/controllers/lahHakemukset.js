'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:MainCtrl
 * @description
 * # AvustushakemusCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('LahHakemuksetCtrl', function ($scope, HakemuksetOsasto) {
    HakemuksetOsasto.getHakemuksetOsastoAktiiviset('Pori')
      .then(function (data) {
        $scope.hakemOsastoAktiiviset = data;
      });
    HakemuksetOsasto.getHakemuksetOsastoVanhat('Pori')
      .then(function (data) {
        $scope.hakemOsastoVanhat = data;
      });
  });
