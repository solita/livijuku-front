'use strict';
var _ = require('lodash');

function pakollinnenErrorMessage(nimi) {
  return function(input) {
    return input.$error.required ? nimi +' on pakollinen tieto.' : '';
  }
}

function liikenneController($scope) {

  $scope.lisaaSuorite = function () {
    var uusi = {
      liikennetyyppitunnus: $scope.liikennetyyppi,
      suoritetyyppitunnus: '',
      numero: $scope.suoritteet.length + 1,
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
  $scope.poistaSuorite = function (indeksi) {
    $scope.suoritteet.splice(indeksi, 1);
    $scope.suoritteetForm.$setDirty();
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
    return _.sum($scope.suoritteet, 'matkustajamaara');
  };

  $scope.nettohintaSumma = function () {
    return _.sum($scope.suoritteet, 'nettohinta');
  };

  $scope.isKokonaissuorite = function(){
    if ($scope.suoritteet === undefined || $scope.suoritteet.length==0) return false;
    return $scope.suoritteet[0].suoritetyyppitunnus == 'KS';
  };

  $scope.laskeBruttohinta = function (i) {
    return $scope.suoritteet[i].lipputulo + $scope.suoritteet[i].nettohinta;
  };

  $scope.nimiErrorMessage = function(input) {
    return input.$error.required ? 'Nimi on pakollinen tieto.' :
           input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkkiä.' : '';
  };

  $scope.kokonaislukuErrorMessage = function(input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };

  $scope.suoritetyyppiErrorMessage = function(input) {
    return input.$error ? 'Syötä tarvittavat linja- ja sopimussuoritteet tai kokonaissuorite.' : ''
  };

  $scope.ajokilometritErrorMessage = pakollinnenErrorMessage("Ajokilometrit");
  $scope.lipputuloErrorMessage = pakollinnenErrorMessage("Lipputulo");
  $scope.nettohintaErrorMessage = pakollinnenErrorMessage("Nettohinta");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      suoritteet: '=suoritteet',
      suoritetyypit: '=suoritetyypit',
      isReadonly: '&isReadonly',
      liikennetyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', liikenneController]
  };
};
