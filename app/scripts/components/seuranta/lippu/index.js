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
  return _.max(taulukko, 'numero').numero + 1;
}


function lippuController($scope) {

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
      lipputyyppitunnus: $scope.kaupunkilippu ? '' : 'SE',
      seutulippualue: '',
      numero: haeMaksimiNumero($scope.suoritteet),
      myynti: 0,
      matkat: 0,
      asiakashinta: 0.0,
      keskipituus: 0.0,
      lipputulo: 0,
      julkinenrahoitus: 0
    };
    $scope.suoritteet.push(uusi);
  };

  $scope.poistaSuorite = function (indeksi) {
    $scope.suoritteet.splice(indeksi, 1);
    $scope.suoritteetForm.$setDirty();
  };

  $scope.myyntiSumma = function () {
    return _.sumBy($scope.suoritteet, 'myynti');
  };

  $scope.matkatSumma = function () {
    return _.sumBy($scope.suoritteet, 'matkat');
  };

  $scope.asiakashintaSumma = function () {
    return _.sumBy($scope.suoritteet, 'asiakashinta');
  };

  $scope.keskipituusSumma = function () {
    return _.sumBy($scope.suoritteet, 'keskipituus');
  };

  $scope.lipputuloSumma = function () {
    return _.sumBy($scope.suoritteet, 'lipputulo');
  };

  $scope.rahoitusSumma = function () {
    return _.sumBy($scope.suoritteet, 'julkinenrahoitus');
  };

  $scope.seutulippualueErrorMessage = function (input) {
    return input.$error.required ? 'Seutulippualue on pakollinen tieto.' :
      input.$error.minlength ? 'Seutulippualue-kentän pituus pitää olla vähintään 2 merkkiä.' :
        input.$error.maxlength ? 'Seutulippualue-kentän pituus saa olla enintään 200 merkkiä.' : '';
  };

  $scope.myyntiErrorMessage = errorMessage("Myyntien lukumäärä");
  $scope.matkatErrorMessage = errorMessage("Matkojen lukumäärä");

  $scope.keskipituusErrorMessage = errorMessage("Matkojen keskipituus");
  $scope.asiakashintaErrorMessage = errorMessage("Asiakashinta");
  $scope.lipputulotErrorMessage = errorMessage("Lipputulot yhteensä");
  $scope.rahoitusErrorMessage = errorMessage("Rahoitus yhteensä");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      suoritteet: '=suoritteet',
      lipputyypit: '=lipputyypit',
      isReadonly: '&isReadonly',
      kaupunkilippu: '=kaupunkilippu'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', lippuController]
  };
};

