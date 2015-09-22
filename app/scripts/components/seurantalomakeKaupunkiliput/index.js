'use strict';
var _ = require('lodash');

function seurantalomakeKaupunkiliputController($scope) {
  $scope.kaupunkilippudata = [{
    suoritetyyppi: '1',
    myynti: 1000,
    matkat: 323,
    asiakashinta: 2.3,
    keskipituus: 14.22,
    matkustajamaarat: 2323,
    lipputulot: 12000,
    rahoitus: 1800
  }
  ];
  $scope.lisaaKaupunkilippuRivi = function () {
    var tyhja = {
      suoritetyyppi: '0',
      myynti: 0,
      matkat: 0,
      asiakashinta: 0.0,
      keskipituus: 0.0,
      matkustajamaarat: 0,
      lipputulot: 0,
      rahoitus: 0
    };
    $scope.kaupunkilippudata.push(tyhja);
  };

  $scope.myyntiSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'myynti');
  };

  $scope.matkatSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'matkat');
  };

  $scope.asiakashintaSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'asiakashinta');
  };

  $scope.keskipituusSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'keskipituus');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'lipputulot');
  };

  $scope.rahoitusSumma = function () {
    return _.sum($scope.kaupunkilippudata, 'rahoitus');
  };

  $scope.poistaKaupunkilippuRivi = function (indeksi) {
    $scope.kaupunkilippudata.splice(indeksi, 1);
  };
  $scope.accordionOpen = false;
}

seurantalomakeKaupunkiliputController.$inject = ['$scope'];

module.exports = function () {
  return {
    restrict: 'E',
    scope:{},
    template: require('./index.html'),
    replace: true,
    controller: seurantalomakeKaupunkiliputController
  };
};
