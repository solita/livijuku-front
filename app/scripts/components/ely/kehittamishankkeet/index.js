'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
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

  $scope.yhteensa = function () {
    return _.sum($scope.kehittamishankkeet, 'arvo');
  };

  $scope.nimiErrorMessage = pakollinenErrorMessage("Nimi");
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

