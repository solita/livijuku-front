'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function kehittamishankkeetController($scope) {

  $scope.kehittamishankkeet = [];

  $scope.lisaaKehittamishanke = function () {
    var uusi = {
      "nimi": "Kehittämishanke",
      "arvo": 0,
      "lisatiedot": ""
    };
    $scope.kehittamishankkeet.push(uusi);
  };

  $scope.poistaKehittamishanke = function (indeksi) {
    $scope.kehittamishankkeet.splice(indeksi, 1);
    $scope.kehittamishankkeetForm.$setDirty();
  };

  $scope.yhteensa = function (){
      return _.sum($scope.kehittamishankkeet, 'arvo');
  };

  $scope.nimiErrorMessage = pakollinenErrorMessage("Nimi");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      isReadonly: '&isReadonly'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', kehittamishankkeetController]
  };
};

