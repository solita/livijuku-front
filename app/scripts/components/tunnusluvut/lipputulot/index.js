'use strict';
var _ = require('lodash');
var d = require('utils/directive');

function lipputulotController($scope) {

  const kuukaudet = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

  $scope.kuukausiNimi = function (kuukausi) {
    return kuukaudet[kuukausi - 1];
  };

  $scope.kertalipputuloSumma = function () {
    return _.sum($scope.lipputulo, 'kertalipputulo');
  };

  $scope.arvolipputuloSumma = function () {
    return _.sum($scope.lipputulo, 'arvolipputulo');
  };

  $scope.kausilipputuloSumma = function () {
    return _.sum($scope.lipputulo, 'kausilipputulo');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.lipputulo, 'lipputulo');
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
