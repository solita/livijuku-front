'use strict';
var _ = require('lodash');
var t = require('utils/tunnusluvut');

const kuukaudet = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
  "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

const viikonpaivaluokat = {A: "Arkipäivä", LA: 'Lauantai', SU: 'Sunnuntai'};

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function kysyntaTarjontaController($scope) {

  $scope.kuukausiNimi = function (kuukausi) {
    return kuukaudet[kuukausi - 1];
  };

  $scope.viikonpaivaluokkaNimi = function (tunnus) {
    return viikonpaivaluokat[tunnus];
  };

  $scope.nousuaSumma = function () {
    return _.sum($scope.liikennevuosi, 'nousut');
  };

  $scope.nimiErrorMessage = function (input) {
    return input.$error.required ? 'Nimi on pakollinen tieto.' :
      input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkuukausiiä.' : '';
  };

  $scope.nousuaErrorMessage = pakollinenErrorMessage("Nousua");
  $scope.kokonaislukuErrorMessage = function (input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };

  $scope.linjakilometritSumma = function () {
    return _.sum($scope.liikennevuosi, 'linjakilometrit');
  };

  $scope.vuorotarjontaSumma = function () {
    return _.sum($scope.liikennevuosi, 'lahdot');
  };

  $scope.isPSA = t.isPSA($scope.tyyppi);
  $scope.isME = $scope.tyyppi === 'ME';
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      liikennevuosi: '=liikennevuosi',
      liikenneviikko: '=liikenneviikko',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', kysyntaTarjontaController]
  };
};
