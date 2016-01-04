'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function(input) {
    return input.$error.required ? nimi +' on pakollinen tieto.' : '';
  }
}

function kysyntaTarjontaController($scope) {

  $scope.tunnusluvut_talvi = [
    {
      "viikonpaiva": "Arkipäivät",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "viikonpaiva": "Lauantai",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "viikonpaiva": "Sunnuntai",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    }
  ];

  $scope.tunnusluvut= [
    {
      "kuukausi": "Tammikuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Helmikuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Maaliskuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Huhtikuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Toukokuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Kesäkuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Heinäkuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Elokuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Syyskuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Lokakuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Marraskuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    },
    {
      "kuukausi": "Joulukuu",
      "nousua": 0,
      "linjakilometrit": 0,
      "vuorotarjonta": 0
    }
  ];

  $scope.nousuaSumma = function () {
    return _.sum($scope.tunnusluvut, 'nousua');
  };

   $scope.nimiErrorMessage = function(input) {
    return input.$error.required ? 'Nimi on pakollinen tieto.' :
           input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkuukausiiä.' : '';
  };

  $scope.nousuaErrorMessage = pakollinenErrorMessage("Nousua");
  $scope.kokonaislukuErrorMessage = function(input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };
  $scope.linjakilometritSumma = function () {
    return _.sum($scope.tunnusluvut, 'linjakilometrit');
  };

  $scope.vuorotarjontaSumma = function () {
    return _.sum($scope.tunnusluvut, 'vuorotarjonta');
  };
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
    controller: ['$scope', kysyntaTarjontaController]
  };
};
