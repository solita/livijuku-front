'use strict';
var _ = require('lodash');

function seurantalomakePaikallisliikenneController($scope) {
  $scope.data = [{
    linja: 'linja 1',
    linjaauto: true,
    taksi: false,
    ajokm: 199,
    matkustajamaarat: 2323,
    asiakastulo: 10000,
    nettohinta: 800,
    bruttohinta: 800
  },
    {
      linja: 'linja 2',
      linjaauto: false,
      taksi: true,
      ajokm: 199,
      matkustajamaarat: 2323,
      asiakastulo: 10000,
      nettohinta: 800,
      bruttohinta: 800
    }
  ];
  $scope.lisaaRivi = function () {
    var tyhja = {
      linja: '',
      linjaauto: false,
      taksi: false,
      ajokm: 0.0,
      matkustajamaarat: 0,
      asiakastulo: 0,
      nettohinta: 0,
      bruttohinta: 0

    };
    $scope.data.push(tyhja);
  };
  $scope.poistaRivi = function (indeksi) {
    console.log('PoistaRivi:', indeksi);
    $scope.data.splice(indeksi, 1);
  };

  $scope.ajokmSumma = function () {
    return _.sum($scope.data, 'ajokm');
  };

  $scope.asiakastuloSumma = function () {
    return _.sum($scope.data, 'asiakastulo');
  };

  $scope.bruttohintaSumma = function () {
    return _.sum($scope.data, 'bruttohinta');
  };

  $scope.matkustajatSumma = function () {
    return _.sum($scope.data, 'matkustajamaarat');
  };

  $scope.nettohintaSumma = function () {
    return _.sum($scope.data, 'nettohinta');
  };


}

seurantalomakePaikallisliikenneController.$inject = ['$scope'];

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./index.html'),
    replace: true,
    controller: seurantalomakePaikallisliikenneController
  };
};
