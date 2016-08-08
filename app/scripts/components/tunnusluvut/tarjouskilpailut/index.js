'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function tarjouskilpailutController($scope) {

  $scope.tarjouskohteet = [];

  $scope.lisaaTarjouskohde = function () {
    var uusi =
    {
      "kohde": "",
      "maara": 0,
      "voittajanhinta":0,
      "toiseksitulleenhinta":0,
      "kommentit": ""
    };
    $scope.tarjouskohteet.push(uusi);
  };

  $scope.poistaTarjouskohde = function (indeksi) {
    $scope.tarjouskohteet.splice(indeksi, 1);
    if ($scope.tarjouskohteetForm !== undefined) $scope.tarjouskohteetForm.$setDirty();
  };

  $scope.kohdeErrorMessage = function (input) {
    return input.$error.required ? 'Kohteen nimi on pakollinen tieto.' :
      input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkkiä.' : '';
  };

  $scope.voittajanhintaErrorMessage = pakollinenErrorMessage("Voittaneen tarjouksen hinta");
  $scope.toiseksitulleenhintaErrorMessage = pakollinenErrorMessage("Toiseksi tulleen tarjouksen hinta");
  $scope.kokonaislukuErrorMessage = function (input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      tunnusluvut: '=tunnusluvut',
      tarjouskohteet: '=tarjouskohteet',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', tarjouskilpailutController]
  };
};
