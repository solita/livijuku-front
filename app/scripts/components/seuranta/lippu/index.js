'use strict';
var _ = require('lodash');

function pakollinnenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function haeMaksimiNumero(taulukko) {
  if (taulukko.length === 0) return 0;
  return _.max(taulukko, 'numero').numero + 1;
}


function lippuController($scope) {

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
    return _.sum($scope.suoritteet, 'myynti');
  };

  $scope.matkatSumma = function () {
    return _.sum($scope.suoritteet, 'matkat');
  };

  $scope.asiakashintaSumma = function () {
    return _.sum($scope.suoritteet, 'asiakashinta');
  };

  $scope.keskipituusSumma = function () {
    return _.sum($scope.suoritteet, 'keskipituus');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.suoritteet, 'lipputulo');
  };

  $scope.rahoitusSumma = function () {
    return _.sum($scope.suoritteet, 'julkinenrahoitus');
  };

  $scope.seutulippualueErrorMessage = function (input) {
    return input.$error.required ? 'Seutulippualue on pakollinen tieto.' :
      input.$error.minlength ? 'Seutulippualue pituus pitää olla vähintään 2 merkkiä.' : '';
  };

  $scope.kokonaislukuErrorMessage = function (input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };

  $scope.myyntiErrorMessage = pakollinnenErrorMessage("Myyntien lukumäärä");
  $scope.matkatErrorMessage = pakollinnenErrorMessage("Matkojen lukumäärä");

  $scope.keskipituusErrorMessage = pakollinnenErrorMessage("Matkojen keskipituus");
  $scope.asiakashintaErrorMessage = pakollinnenErrorMessage("Asiakashinta");
  $scope.lipputulotErrorMessage = pakollinnenErrorMessage("Lipputulot yhteensä");
  $scope.rahoitusErrorMessage = pakollinnenErrorMessage("Rahoitus yhteensä");
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

