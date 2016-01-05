'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function liikennointikorvauksetController($scope) {

  $scope.tarjouskohteet = [];

  $scope.lisaaTarjouskohde = function () {
    var uusi =
    {
      "kohde": "",
      "maara": 0,
      "voittajanhinta":0,
      "toiseksitulleenhinta":0,
      "kommentit": ""
    };
    $scope.tarjouskohteet.push(uusi);
  };

  $scope.poistaTarjouskohde = function (indeksi) {
    $scope.tarjouskohteet.splice(indeksi, 1);
    if ($scope.tarjouskohteetForm !== undefined) $scope.tarjouskohteetForm.$setDirty();
  };

  $scope.jarjestamiskustannukset = [
    {
      "kuukausi": "Tammikuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Helmikuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Maaliskuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Huhtikuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Toukokuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Kesäkuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Heinäkuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Elokuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Syyskuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Lokakuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Marraskuu",
      "maksettuliikennointikorvaus": 0
    },
    {
      "kuukausi": "Joulukuu",
      "maksettuliikennointikorvaus": 0
    }
  ];

  $scope.nousukorvaukset = [
    {
      "kuukausi": "Tammikuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Helmikuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Maaliskuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Huhtikuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Toukokuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Kesäkuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Heinäkuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Elokuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Syyskuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Lokakuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Marraskuu",
      "nousukorvaus": 0
    },
    {
      "kuukausi": "Joulukuu",
      "nousukorvaus": 0
    }
  ];

  $scope.nousukorvausSumma = function () {
    return _.sum($scope.nousukorvaukset, 'nousukorvaus');
  };

  $scope.liikennointikorvausSumma = function () {
    return _.sum($scope.jarjestamiskustannukset, 'maksettuliikennointikorvaus');
  };


  $scope.liikennointikorvausErrorMessage = pakollinenErrorMessage("Maksettu liikennöinnin sopimuskorvaus (€/kk ilman ALV)");

}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      tunnusluvut: '=tunnusluvut',
      tarjouskohteet: '=tarjouskohteet',
      isReadonly: '&isReadonly',
      tyyppi: '@tyyppi'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', liikennointikorvauksetController]
  };
};
