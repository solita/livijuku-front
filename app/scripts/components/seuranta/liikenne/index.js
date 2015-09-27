'use strict';
var _ = require('lodash');

function liikenneController($scope) {

  $scope.lisaaSuorite = function () {
    var uusi = {
      liikennetyyppitunnus: $scope.liikennetyyppi,
      numero: $scope.suoritteet.length + 1,

      suoritetyyppitunnus: 'LS',
      nimi: '',
      linjaautot: 0,
      taksit: 0,
      ajokilometrit: 0.0,
      matkustajamaara: 0,
      lipputulo: 0,
      nettohinta: 0

    };
    $scope.suoritteet.push(uusi);
  };
  $scope.poistaPaikallisliikenneRivi = function (indeksi) {
    $scope.suoritteet.splice(indeksi, 1);
  };

  $scope.linjaautotSumma = function () {
    return _.sum($scope.suoritteet, 'linjaautot');
  };

  $scope.taksitSumma = function () {
    return _.sum($scope.suoritteet, 'taksit');
  };

  $scope.ajokmSumma = function () {
    return _.sum($scope.suoritteet, 'ajokilometrit');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.suoritteet, 'lipputulo');
  };

  $scope.bruttohintaSumma = function () {
    return $scope.lipputuloSumma() + $scope.nettohintaSumma();
  };

  $scope.matkustajatSumma = function () {
    return _.sum($scope.suoritteet, 'matkustajamaarat');
  };

  $scope.nettohintaSumma = function () {
    return _.sum($scope.suoritteet, 'nettohinta');
  };

  $scope.laskeBruttohinta = function (i) {
    return $scope.suoritteet[i].lipputulo + $scope.suoritteet[i].nettohinta;
  };
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      suoritteet: '=suoritteet',
      isReadonly: '&isReadonly',
      liikennetyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', liikenneController]
  };
};
