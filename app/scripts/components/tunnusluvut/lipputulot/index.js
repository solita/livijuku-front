'use strict';
var _ = require('lodash');
var d = require('utils/directive');
var c = require('utils/core');

function lipputulotController($scope) {

  const kuukaudet = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

  $scope.kuukausiNimi = function (kuukausi) {
    return kuukaudet[kuukausi - 1];
  };

  var property0 = path => c.property(path, 0, _.isNaN);

  $scope.kertalipputuloSumma = function () {
    return _.sumBy($scope.lipputulo, property0('kertalipputulo'));
  };

  $scope.arvolipputuloSumma = function () {
    return _.sumBy($scope.lipputulo, property0('arvolipputulo'));
  };

  $scope.kausilipputuloSumma = function () {
    return _.sumBy($scope.lipputulo, property0('kausilipputulo'));
  };

  $scope.lipputuloSumma = function () {
    return _.sumBy($scope.lipputulo, property0('lipputulo'));
  };

  $scope.kaikkilipputulotSumma = function () {
    return ($scope.kertalipputuloSumma() + $scope.arvolipputuloSumma() + $scope.kausilipputuloSumma());
  };

  // error messages:
  $scope.lipputuloErrorMessage = d.maxErrorMessage("9999999999,99");

}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      lipputulo: '=lipputulo',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', lipputulotController]
  };
};
