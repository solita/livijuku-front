'use strict';

var angular = require('angular');

angular.module('jukufrontApp')
  .controller('HakijaAsetuksetCtrl', ['$scope', function ($scope) {
    $scope.nimi = "Heikki Hakija";
    $scope.organisaatio = "Heikki Hakija";
    $scope.rooli = "Hakija";
    $scope.kayttajatunnus="K1234567";
    $scope.sahkoposti="heikki.hakija@suomenkyla.fi";
    $scope.puhelinnumero="040 1234567";

  }]);
