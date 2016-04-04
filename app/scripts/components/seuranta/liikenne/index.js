'use strict';
var _ = require('lodash');

function errorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' :
      input.$error.sallittuArvo ? 'Arvon tulee olla välillä 0 - 999 999 999' : '';
  }
}

function haeMaksimiNumero(taulukko) {
  if (taulukko.length === 0) return 0;
  return _.maxBy(taulukko, 'numero').numero + 1;
}

function liikenneController($scope) {

  $scope.sallittuArvo = function (value) {
    if (typeof value === 'undefined') {
      return false;
    } else if (typeof value === 'string') {
      var floatarvo;
      floatarvo = $scope.euroSyoteNumeroksi(value);
      return (floatarvo >= 0 && floatarvo <= 999999999);
    } else if (typeof value === 'number') {
      return (value >= 0 && value <= 999999999);
    }
    return true;
  };

  $scope.lisaaSuorite = function () {
    var uusi = {
      liikennetyyppitunnus: $scope.liikennetyyppi,
      suoritetyyppitunnus: '',
      numero: haeMaksimiNumero($scope.suoritteet),
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
    return _.sumBy($scope.suoritteet, 'linjaautot');
  };

  $scope.taksitSumma = function () {
    return _.sumBy($scope.suoritteet, 'taksit');
  };

  $scope.ajokmSumma = function () {
    return _.sumBy($scope.suoritteet, 'ajokilometrit');
  };

  $scope.lipputuloSumma = function () {
    return _.sumBy($scope.suoritteet, 'lipputulo');
  };

  $scope.bruttohintaSumma = function () {
    return $scope.lipputuloSumma() + $scope.nettohintaSumma();
  };

  $scope.matkustajatSumma = function () {
    return _.sumBy($scope.suoritteet, 'matkustajamaara');
  };

  $scope.nettohintaSumma = function () {
    return _.sumBy($scope.suoritteet, 'nettohinta');
  };

  $scope.isKokonaissuorite = function () {
    if ($scope.suoritteet === undefined || $scope.suoritteet.length == 0) return false;
    return $scope.suoritteet[0].suoritetyyppitunnus == 'KS';
  };

  $scope.laskeBruttohinta = function (i) {
    return $scope.suoritteet[i].lipputulo + $scope.suoritteet[i].nettohinta;
  };

  $scope.nimiErrorMessage = function (input) {
    return input.$error.required ? 'Nimi on pakollinen tieto.' :
      input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkkiä.' :
        input.$error.maxlength ? 'Nimen pituus saa olla enintään 200 merkkiä.' : '';
  };

  $scope.ajokilometritErrorMessage = errorMessage("Ajokilometrit");
  $scope.lipputuloErrorMessage = errorMessage("Lipputulo");
  $scope.nettohintaErrorMessage = errorMessage("Nettohinta");

  $scope.linjaautotErrorMessage = errorMessage("Linja-autojen lukumäärä");
  $scope.taksitErrorMessage = errorMessage("Taksien lukumäärä");
  $scope.matkustajamaaraErrorMessage = errorMessage("Matkustajien lukumäärä");
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
