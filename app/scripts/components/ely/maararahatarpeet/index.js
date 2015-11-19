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

  $scope.haeNimi = function(tunnus){
    return _.find($scope.maararahatarvetyypit, {'tunnus': tunnus}).nimi;
  };

  $scope.yhteensa = function () {
    return $scope.siirtymaajansopimukset + $scope.joukkoliikennetuki + _.sum($scope.maararahatarpeet, 'sidotut') + _.sum($scope.maararahatarpeet, 'uudet') - _.sum($scope.maararahatarpeet, 'tulot');
  };

  $scope.sasopimuksetErrorMessage = pakollinenErrorMessage("Siirtymäajan sopimukset");
  $scope.jltkunnilleErrorMessage = pakollinenErrorMessage("Joukkoliikennetuki kunnille");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      vuosi: '=vuosi',
      perustiedot: '=perustiedot',
      maararahatarpeet: '=maararahatarpeet',
      maararahatarvetyypit: '=maararahatarvetyypit',
      isReadonly: '&isReadonly'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', maararahatarpeetController]
  };
};
