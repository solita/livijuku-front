'use strict';
var _ = require('lodash');

function seurantalomakePaikallisliikenneController($scope) {
  $scope.data = [{
    linja: 'linja 1',
    linjaauto: 1,
    taksi: 0,
    ajokm: 199,
    matkustajamaarat: 2323,
    asiakastulo: 10000,
    nettohinta: 800,
    bruttohinta: 800
  },
    {
      linja: 'linja 2',
      linjaauto: 1,
      taksi: 0,
      ajokm: 199,
      matkustajamaarat: 2323,
      asiakastulo: 10000,
      nettohinta: 800,
      bruttohinta: 800
    }
  ];
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
