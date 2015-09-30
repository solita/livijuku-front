'use strict';
var _ = require('lodash');

function pakollinnenErrorMessage(nimi) {
  return function(input) {
    return input.$error.required ? nimi +' on pakollinen tieto.' : '';
  }
}

function lippuController($scope) {

  $scope.lisaaSuorite = function () {
    var uusi = {
      lipputyyppitunnus: $scope.lipputyyppi,
      numero: $scope.suoritteet.length + 1,

      myynti: 0,
      matkat: 0,
      asiakashinta: 0.0,
      keskipituus: 0.0,
      matkustajamaarat: 0,
      lipputulot: 0,
      rahoitus: 0

    };
    $scope.suoritteet.push(uusi);
  };

  $scope.poistaSuorite = function (indeksi) {
    $scope.suoritteet.splice(indeksi, 1);
  };

  $scope.myyntiSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'myynti');
  };

  $scope.matkatSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'matkat');
  };

  $scope.asiakashintaSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'asiakashinta');
  };

  $scope.keskipituusSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'keskipituus');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'lipputulot');
  };

  $scope.rahoitusSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'rahoitus');
  };

  $scope.nimiErrorMessage = function(input) {
    return input.$error.required ? 'Nimi on pakollinen tieto.' :
           input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkkiä.' : '';
  }

  $scope.kokonaislukuErrorMessage = function(input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  }

  $scope.ajokilometritErrorMessage = pakollinnenErrorMessage("Ajokilometrit");
  $scope.lipputuloErrorMessage = pakollinnenErrorMessage("Lipputulo");
  $scope.nettohintaErrorMessage = pakollinnenErrorMessage("Nettohinta");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      suoritteet: '=suoritteet',
      isReadonly: '&isReadonly',
      kaupunkilippu: '@kaupunkilippu'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', lippuController]
  };
};

