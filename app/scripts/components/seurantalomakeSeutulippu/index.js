'use strict';
var _ = require('lodash');

function seurantalomakeSeutulippuController($scope) {
  $scope.seutulippudata = [{
    seutulippualue: 'seutulippu',
    myynti: 1000,
    matkat: 323,
    asiakashinta: 2.3,
    keskipituus: 14.22,
    matkustajamaarat: 2323,
    lipputulot: 12000,
    rahoitus: 1800
  }
  ];
  $scope.lisaaSeutulippuRivi = function () {
    var tyhja = {
      seutulippualue: '',
      myynti: 0,
      matkat: 0,
      asiakashinta: 0.0,
      keskipituus: 0.0,
      matkustajamaarat: 0,
      lipputulot: 0,
      rahoitus: 0
    };
    $scope.seutulippudata.push(tyhja);
  };

  $scope.myyntiSumma = function () {
    return _.sum($scope.seutulippudata, 'myynti');
  };

  $scope.matkatSumma = function () {
    return _.sum($scope.seutulippudata, 'matkat');
  };

  $scope.asiakashintaSumma = function () {
    return _.sum($scope.seutulippudata, 'asiakashinta');
  };

  $scope.keskipituusSumma = function () {
    return _.sum($scope.seutulippudata, 'keskipituus');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.seutulippudata, 'lipputulot');
  };

  $scope.rahoitusSumma = function () {
    return _.sum($scope.seutulippudata, 'rahoitus');
  };

  $scope.poistaSeutulippuRivi = function (indeksi) {
    $scope.seutulippudata.splice(indeksi, 1);
  };
  $scope.accordionOpen = false;
}

seurantalomakeSeutulippuController.$inject = ['$scope'];

module.exports = function () {
  return {
    restrict: 'E',
    scope:{},
    template: require('./index.html'),
    replace: true,
    controller: seurantalomakeSeutulippuController
  };
};
