'use strict';
var _ = require('lodash');
var d = require('utils/directive');

function kalustoController($scope) {

  const paastoluokat = {
    E0: "EURO 0",
    E1: "EURO 1",
    E2: "EURO 2",
    E3: "EURO 3",
    E4: "EURO 4",
    E5: "EURO 5 / EEV",
    E6: "EURO 6"
  };

  $scope.paastoluokkaNimi = function (tunnus) {
    return paastoluokat[tunnus];
  };

  $scope.kalustoSumma = function () {
    return _.sum($scope.kalusto, 'lukumaara');
  };

  // error messages:
  $scope.lukumaaraErrorMessage = d.maxlengthNumberErrorMessage("999999999");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      kalusto: '=kalusto',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', kalustoController]
  };
};
