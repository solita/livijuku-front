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
    asiakastulot: 12000,
    rahoitus: 1800
  }
  ];
  $scope.lisaaRivi = function () {
    var tyhja = {
      seutulippualue: '',
      myynti: 0,
      matkat: 0,
      asiakashinta: 0.0,
      keskipituus: 0.0,
      matkustajamaarat: 0,
      asiakastulot: 0,
      rahoitus: 0
    };
    $scope.seutulippudata.push(tyhja);
  };
  $scope.poistaRivi = function (indeksi) {
    $scope.seutulippudata.splice(indeksi, 1);
  };
}

seurantalomakeSeutulippuController.$inject = ['$scope'];

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./index.html'),
    replace: true,
    controller: seurantalomakeSeutulippuController
  };
};
