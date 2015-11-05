'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function maararahatarpeetController($scope) {

  $scope.siirtymaajansopimukset = 0;
  $scope.joukkoliikennetuki = 0;
  $scope.maararahatarpeet = [
    {
      "maararahatarve": "Bruttosopimukset",
      "sidotut": 0,
      "uudet": 0,
      "tulot": 0,
      "kommentit": "",
      "sidotuttooltip": "Voimassa olevat bruttosopimukset, joiden kustannukset on jo sidottu vuodelle " + $scope.vuosi,
      "uudettooltip": "Uudet bruttosopimukset vuodelle " + $scope.vuosi + ", kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta",
      "tulottooltip": "Bruttosopimusten tulot"
    }, {
      "maararahatarve": "Käyttösopimuskorvaukset (alueellinen)",
      "sidotut": 0,
      "uudet": 0,
      "tulot": 0,
      "kommentit": "",
      "sidotuttooltip": "Voimassa käyttösopimuskorvaukset (alueellinen), joiden kustannukset on jo sidottu vuodelle " + $scope.vuosi,
      "uudettooltip": "Uudet käyttösopimuskorvaukset (alueellinen) vuodelle " + $scope.vuosi + ", kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta",
      "tulottooltip": "Käyttösopimuskorvausten (alueellinen) tulot"
    }, {
      "maararahatarve": "Käyttösopimuskorvaukset (reitti)",
      "sidotut": 0,
      "uudet": 0,
      "tulot": 0,
      "kommentit": "",
      "sidotuttooltip": "Voimassa olevat käyttösopimuskorvaukset (reitti), joiden kustannukset on jo sidottu vuodelle " + $scope.vuosi,
      "uudettooltip": "Uudet käyttösopimuskorvaukset (reitti) vuodelle " + $scope.vuosi + ", kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta",
      "tulottooltip": "Käyttösopimuskorvausten (reitti) tulot"
    }
  ];

  $scope.yhteensa = function () {
    return $scope.siirtymaajansopimukset + $scope.joukkoliikennetuki + _.sum($scope.maararahatarpeet, 'sidotut') + _.sum($scope.maararahatarpeet, 'uudet') - _.sum($scope.maararahatarpeet, 'tulot');
  };
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      vuosi: '=vuosi',
      isReadonly: '&isReadonly'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', maararahatarpeetController]
  };
};
