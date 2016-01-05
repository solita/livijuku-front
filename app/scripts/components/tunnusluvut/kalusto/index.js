'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function kalustoController($scope) {

  $scope.kalusto = [
    {
      "paastoluokka": "EURO 0",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 1",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 2",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 3",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 4",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 5 / EEV",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 6",
      "linjaautot": 0
    }
  ];

  $scope.kokonaislukuErrorMessage = function (input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      tunnusluvut: '=tunnusluvut',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', kalustoController]
  };
};
