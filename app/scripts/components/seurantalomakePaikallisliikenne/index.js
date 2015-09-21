'use strict';
var _ = require('lodash');

function seurantalomakePaikallisliikenneController($scope) {
  $scope.paikallisliikennedata = [{
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
  $scope.lisaaPaikallisliikenneRivi = function () {
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

  $scope.lipputuloSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'lipputulo');
  };

  $scope.bruttohintaSumma = function () {
    return $scope.lipputuloSumma() + $scope.nettohintaSumma();
  };

  $scope.matkustajatSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'matkustajamaarat');
  };

  $scope.nettohintaSumma = function () {
    return _.sum($scope.paikallisliikennedata, 'nettohinta');
  };

  $scope.laskeBruttohinta = function (i) {
    return $scope.paikallisliikennedata[i].lipputulo + $scope.paikallisliikennedata[i].nettohinta;
  };

  $scope.accordionOpen=false;


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
