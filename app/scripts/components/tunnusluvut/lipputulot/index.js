'use strict';
var _ = require('lodash');

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
