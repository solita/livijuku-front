'use strict';
var _ = require('lodash');

function seurantalomakePaikallisliikenneController($scope) {
  $scope.data = [{
    linja: 'linja 1',
    suoritetyyppi: '0',
    linjaautot: 2,
    taksit: 3,
    ajokm: 199,
    matkustajamaarat: 2323,
    asiakastulo: 10000,
    nettohinta: 800,
    bruttohinta: 800
  },
    {
      linja: 'linja 2',
      suoritetyyppi: '0',
      linjaautot: 3,
      taksit: 4,
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
      suoritetyyppi: '1',
      linjaautot: 0,
      taksit: 0,
      ajokm: 0.0,
      matkustajamaarat: 0,
      asiakastulo: 0,
      nettohinta: 0,
      bruttohinta: 0

    };
    $scope.data.push(tyhja);
  };
  $scope.poistaRivi = function (indeksi) {
    $scope.data.splice(indeksi, 1);
  };

  $scope.linjaautotSumma = function () {
    return _.sum($scope.data, 'linjaautot');
  };

  $scope.taksitSumma = function () {
    return _.sum($scope.data, 'taksit');
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
