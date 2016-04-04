'use strict';
var _ = require('lodash');
var d = require('utils/directive');
var c = require('utils/core');

function liikennointikorvauksetController($scope) {

  const kuukaudet = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

  $scope.kuukausiNimi = function (kuukausi) {
    return kuukaudet[kuukausi - 1];
  };

  $scope.nousukorvausSumma = function () {
    return _.sumBy($scope.liikennointikorvaus, c.property('nousukorvaus', 0, _.isNaN));
  };

  $scope.nousutSumma = function () {
    return _.sumBy($scope.liikennointikorvaus, 'nousut');
  };

  $scope.liikennointikorvausSumma = function () {
    return _.sumBy($scope.liikennointikorvaus, c.property('korvaus', 0, _.isNaN));
  };

  // error messages:
  $scope.korvausErrorMessage = d.maxErrorMessage("9999999999,99");
  $scope.nousutErrorMessage = d.maxlengthNumberErrorMessage("999 999 999");
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
