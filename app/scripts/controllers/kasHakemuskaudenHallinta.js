'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuskaudenHallintaCtrl
 * @description
 * # KasHakemuskaudenHallintaCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasHakemuskaudenHallintaCtrl', function ($scope, $location, Hakemuskausi) {
    Hakemuskausi.getHakemuskausi(1)
      .then(function (data) {
        $scope.hakemuskausidata = data;
      });
  });
