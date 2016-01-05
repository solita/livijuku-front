'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function lipputulotController($scope) {

  $scope.lipputulot = [
    {
      "kuukausi": "Tammikuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    },
    {
      "kuukausi": "Helmikuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    },
    {
      "kuukausi": "Maaliskuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    },
    {
      "kuukausi": "Huhtikuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    },
    {
      "kuukausi": "Toukokuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Kesäkuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    },
    {
      "kuukausi": "Heinäkuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Elokuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    },
    {
      "kuukausi": "Syyskuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Lokakuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Marraskuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    },
    {
      "kuukausi": "Joulukuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0
    }
  ];


  $scope.kertaliputSumma = function () {
    return _.sum($scope.lipputulot, 'kertalippu');
  };

  $scope.arvoliputSumma = function () {
    return _.sum($scope.lipputulot, 'arvolippu');
  };

  $scope.kausiliputSumma = function () {
    return _.sum($scope.lipputulot, 'kausilippu');
  };

  $scope.lipputuloSumma = function () {
    return _.sum($scope.lipputulot, 'lipputulo');
  };

  $scope.kaikkilipputulotSumma = function () {
    return ($scope.kertaliputSumma() + $scope.arvoliputSumma() + $scope.kausiliputSumma());
  };

  $scope.kertalippuErrorMessage = pakollinenErrorMessage("Kertalippu (€/kk ilman ALV)");
  $scope.arvolippuErrorMessage = pakollinenErrorMessage("Arvolippu (€/kk ilman ALV)");
  $scope.kausilippuErrorMessage = pakollinenErrorMessage("Kausilippu (€/kk ilman ALV)");
  $scope.lipputuloErrorMessage = pakollinenErrorMessage("Lipputulo (€/kk ilman ALV)");
}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      tunnusluvut: '=tunnusluvut',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', lipputulotController]
  };
};
