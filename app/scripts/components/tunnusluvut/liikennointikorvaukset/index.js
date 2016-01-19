'use strict';
var _ = require('lodash');

function liikennointikorvauksetController($scope) {

  const kuukaudet = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

  $scope.kuukausiNimi = function (kuukausi) {
    return kuukaudet[kuukausi - 1];
  };

  $scope.nousukorvausSumma = function () {
    return _.sum($scope.liikennointikorvaus, 'nousukorvaus');
  };

  $scope.liikennointikorvausSumma = function () {
    return _.sum($scope.liikennointikorvaus, 'korvaus');
  };

}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      liikennointikorvaus: '=liikennointikorvaus',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', liikennointikorvauksetController]
  };
};
