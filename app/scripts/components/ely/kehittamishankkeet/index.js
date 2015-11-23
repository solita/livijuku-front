'use strict';
var _ = require('lodash');

function errorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' :
      input.$error.sallittuArvo ? 'Arvon tulee olla välillä 0 - 999 999 999,99 €.' : '';
  }
}

function haeMaksimiNumero(taulukko) {
  if (taulukko.length === 0) return 0;
  return _.max(taulukko, 'numero').numero + 1;
}

function kehittamishankkeetController($scope) {

  $scope.kehittamishankkeet2 = [];

  $scope.lisaaKehittamishanke = function () {
    var uusi = {
      "numero": haeMaksimiNumero($scope.kehittamishankkeet),
      "nimi": "Kehittämishanke",
      "arvo": 0,
      "kuvaus": ""
    };
    $scope.kehittamishankkeet.push(uusi);
  };

  $scope.poistaKehittamishanke = function (indeksi) {
    $scope.kehittamishankkeet.splice(indeksi, 1);
    $scope.kehittamishankkeetForm.$setDirty();
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

  $scope.yhteensa = function () {
    return _.sum($scope.kehittamishankkeet, 'arvo');
  };

  $scope.arvoalueErrorMessage = errorMessage("");
  $scope.nimiErrorMessage = errorMessage("Nimi");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      kehittamishankkeet: '=kehittamishankkeet',
      isReadonly: '&isReadonly'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', kehittamishankkeetController]
  };
};

