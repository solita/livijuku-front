'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function kalustoController($scope) {

  $scope.kokonaislukuErrorMessage = function (input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };

  $scope.kalustoSumma = function () {
    return _.sum($scope.kalusto, 'lukumaara');
  };
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
