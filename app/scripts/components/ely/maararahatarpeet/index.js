'use strict';
var _ = require('lodash');
var d = require('utils/directive');

function errorMessage(nimi) {
  return d.combineErrorMessages(d.requiredErrorMessage(nimi), d.maxErrorMessage("9 999 999 999,99"));
}

var maararahatarvetyyppiTooltips = {
  M: "Ennen 1.7.2014 kilpailutettu liikenne tai muu hankintalain nojalla hankittava liikenne.",
  HK: "LIVIJUKU-714 - TODO: Liisa miettii tähän selitteen!"
}

function maararahatarpeetController($scope) {

  $scope.haeNimi = function (tunnus) {
    return _.find($scope.maararahatarvetyypit, {'tunnus': tunnus}).nimi;
  };

  $scope.maararahatarvetyyppiTooltip = tunnus => maararahatarvetyyppiTooltips[tunnus];

  $scope.yhteensa = function () {
    return _.sum(_.values($scope.hakemus.ely)) +
           _.sum($scope.maararahatarpeet, 'sidotut') +
           _.sum($scope.maararahatarpeet, 'uudet') -
           _.sum($scope.maararahatarpeet, 'tulot');
  };

  // oletusarvot ely-tietoihin:
  if (!$scope.hakemus.ely) {
    $scope.hakemus.ely = {
      kaupunkilipputuki: 0,
      seutulipputuki: 0,
      ostot: 0,
      kehittaminen: 0
    }
  }

  $scope.kaupunkilipputukiErrorMessage = errorMessage("Kaupunkilipputuki");
  $scope.seutulipputukiErrorMessage = errorMessage("Seutulipputuki");
  $scope.ostotErrorMessage = errorMessage("Liikenteen ostot");
  $scope.kehittaminenErrorMessage = errorMessage("Kehittäminen");

  $scope.errorMessage = errorMessage("Arvo");
  $scope.kuvausErrorMessage = d.maxlengthTextErrorMessage("2000");
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
