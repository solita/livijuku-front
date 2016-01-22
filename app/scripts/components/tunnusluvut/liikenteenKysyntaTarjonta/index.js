'use strict';
var _ = require('lodash');
var t = require('utils/tunnusluvut');
var d = require('utils/directive');

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

  $scope.linjakilometritSumma = function () {
    return _.sum($scope.liikennevuosi, 'linjakilometrit');
  };

  $scope.vuorotarjontaSumma = function () {
    return _.sum($scope.liikennevuosi, 'lahdot');
  };

  $scope.isPSA = t.isPSA($scope.tyyppi);
  $scope.isME = $scope.tyyppi === 'ME';

  // error messages:
  $scope.nousutErrorMessage = d.maxlengthNumberErrorMessage("999999999");
  $scope.lahdotErrorMessage = d.maxlengthNumberErrorMessage("999999999");
  $scope.linjakilometritErrorMessage = d.maxErrorMessage("9999999999,99");
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
