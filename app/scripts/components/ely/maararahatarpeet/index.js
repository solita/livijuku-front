'use strict';
var _ = require('lodash');

function errorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' :
      input.$error.sallittuArvo ? 'Arvon tulee olla välillä 0 - 999 999 999,99 €.' : '';
  }
}

function maararahatarpeetController($scope) {

  $scope.haeNimi = function (tunnus) {
    return _.find($scope.maararahatarvetyypit, {'tunnus': tunnus}).nimi;
  };

  $scope.yhteensa = function () {
    return $scope.hakemus.ely.siirtymaaikasopimukset + $scope.hakemus.ely.joukkoliikennetukikunnat + _.sum($scope.maararahatarpeet, 'sidotut') + _.sum($scope.maararahatarpeet, 'uudet') - _.sum($scope.maararahatarpeet, 'tulot');
  };

  $scope.sallittuArvo = function (value) {
    if (typeof value === 'undefined') {
      return false;
    } else if (typeof value === 'string') {
      var floatarvo;
      floatarvo = $scope.euroSyoteNumeroksi(value);
      return (floatarvo >= 0 && floatarvo <= 999999999.99);
    } else if (typeof value === 'number') {
      return (value >= 0 && value <= 999999999.99);
    }
    return true;
  };

  $scope.sasopimuksetErrorMessage = errorMessage("Siirtymäajan sopimukset");
  $scope.jltkunnilleErrorMessage = errorMessage("Joukkoliikennetuki kunnille");
  $scope.arvoalueErrorMessage = errorMessage("");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      vuosi: '=vuosi',
      hakemus: '=hakemus',
      maararahatarpeet: '=maararahatarpeet',
      maararahatarvetyypit: '=maararahatarvetyypit',
      isReadonly: '&isReadonly'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', maararahatarpeetController]
  };
};
