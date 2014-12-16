'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuksetCtrl
 * @description
 * # KasHakemuksetCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasPaatosCtrl', function ($scope, $routeParams) {

    $scope.hakemusid = $routeParams.hakemusid;
    $scope.avustus = $routeParams.avustus;

  })
