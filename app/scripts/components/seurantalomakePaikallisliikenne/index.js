'use strict';
var _ = require('lodash');

function seurantalomakePaikallisliikenneController($scope) {
  $scope.paikallisliikennedata = [{
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
  $scope.lisaaPaikallisliikenneRivi = function () {
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
    $scope.paikallisliikennedata.push(tyhja);
  };
  $scope.poistaPaikallisliikenneRivi = function (indeksi) {
    $scope.paikallisliikennedata.splice(indeksi, 1);
  };

  $scope.linjaautotSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'linjaautot');
  };

  $scope.taksitSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'taksit');
  };

  $scope.ajokmSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'ajokm');
  };

  $scope.asiakastuloSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'asiakastulo');
  };

  $scope.bruttohintaSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'bruttohinta');
  };

  $scope.matkustajatSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'matkustajamaarat');
  };

  $scope.nettohintaSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'nettohinta');
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
