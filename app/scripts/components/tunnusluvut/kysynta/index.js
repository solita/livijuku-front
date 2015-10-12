'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function(input) {
    return input.$error.required ? nimi +' on pakollinen tieto.' : '';
  }
}

function kysyntaController($scope) {

  $scope.tunnusluvut_talvi = [
    {
      "selite": "Arkipäivän keskimääräinen nousumäärä (syyskuu-toukokuu arkipäivien keskiarvo)",
      "nousumaara": 0,
      "kommentit": ""
    },
    {
      "selite": "Lauantain keskimääräinen nousumäärä (syyskuu-toukokuu lauantaiden keskiarvo)",
      "nousumaara": 0,
      "kommentit": ""
    },
    {
      "selite": "Sunnuntain keskimääräinen nousumäärä (syyskuu-toukokuu sunnuntaiden keskiarvo)",
      "nousumaara": 0,
      "kommentit": ""
    }
  ];

  $scope.tunnusluvut= [
    {
      "kuukausi": "Tammikuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Helmikuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Maaliskuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Huhtikuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Toukokuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Kesäkuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Heinäkuu",
      "nousua": 0.0,
      "kommentit": ""
    },
    {
      "kuukausi": "Elokuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Syyskuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Lokakuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Marraskuu",
      "nousua": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Joulukuu",
      "nousua": 0,
      "kommentit": ""
    }
  ];

  $scope.nousuaSumma = function () {
    return _.sum($scope.tunnusluvut, 'nousua');
  };

   $scope.nimiErrorMessage = function(input) {
    return input.$error.required ? 'Nimi on pakollinen tieto.' :
           input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkuukausiiä.' : '';
  };

  $scope.nousumaaraErrorMessage = pakollinenErrorMessage("Nousumäärä");
  $scope.kokonaislukuErrorMessage = function(input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
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
    controller: ['$scope', kysyntaController]
  };
};
