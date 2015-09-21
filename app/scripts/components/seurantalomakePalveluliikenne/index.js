'use strict';
var _ = require('lodash');

function seurantalomakePalveluliikenneController($scope) {
  $scope.palveluliikennedata = [{
    suoritetyyppi: '0',
    nimi: 'linja 1',
    linjaautot: 2,
    taksit: 3,
    ajokm: 199,
    matkustajamaarat: 2323,
    lipputulo: 10000,
    nettohinta: 800,
    bruttohinta: 800
  },
    {
      suoritetyyppi: '0',
      nimi: 'linja 2',
      linjaautot: 3,
      taksit: 4,
      ajokm: 199,
      matkustajamaarat: 2323,
      lipputulo: 10000,
      nettohinta: 800,
      bruttohinta: 800
    }
  ];
  $scope.lisaaPalveluliikenneRivi = function () {
    var tyhja = {
      suoritetyyppi: '1',
      nimi: '',
      linjaautot: 0,
      taksit: 0,
      ajokm: 0.0,
      matkustajamaarat: 0,
      lipputulo: 0,
      nettohinta: 0,
      bruttohinta: 0

    };
    $scope.palveluliikennedata.push(tyhja);
  };
  $scope.poistaPalveluliikenneRivi = function (indeksi) {
    $scope.palveluliikennedata.splice(indeksi, 1);
  };

  $scope.linjaautotSumma = function () {
    return _.sum($scope.palveluliikennedata, 'linjaautot');
  };

  $scope.taksitSumma = function () {
    return _.sum($scope.palveluliikennedata, 'taksit');
  };

  $scope.ajokmSumma = function () {
    return _.sum($scope.palveluliikennedata, 'ajokm');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.palveluliikennedata, 'lipputulo');
  };

  $scope.bruttohintaSumma = function () {
    return $scope.lipputuloSumma() + $scope.nettohintaSumma();
  };

  $scope.matkustajatSumma = function () {
    return _.sum($scope.palveluliikennedata, 'matkustajamaarat');
  };

  $scope.nettohintaSumma = function () {
    return _.sum($scope.palveluliikennedata, 'nettohinta');
  };

  $scope.laskePalveluliikenneBruttohinta = function (i) {
    return $scope.palveluliikennedata[i].lipputulo + $scope.palveluliikennedata[i].nettohinta;
  };

  $scope.accordionOpen=false;


}

seurantalomakePalveluliikenneController.$inject = ['$scope'];

module.exports = function () {
  return {
    restrict: 'E',
    scope:{},
    template: require('./index.html'),
    replace: true,
    controller: seurantalomakePalveluliikenneController
  };
};
