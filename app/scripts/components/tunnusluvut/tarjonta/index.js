'use strict';
var _ = require('lodash');

function pakollinenErrorMessage(nimi) {
  return function (input) {
    return input.$error.required ? nimi + ' on pakollinen tieto.' : '';
  }
}

function tarjontaController($scope) {

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

  $scope.kalusto = [
    {
      "paastoluokka": "EURO 0",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 1",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 2",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 3",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 4",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 5 / EEV",
      "linjaautot": 0
    },
    {
      "paastoluokka": "EURO 6",
      "linjaautot": 0
    }
  ];

  $scope.jarjestamiskustannukset = [
    {
      "kuukausi": "Tammikuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Helmikuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Maaliskuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Huhtikuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Toukokuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Kesäkuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Heinäkuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Elokuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Syyskuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Lokakuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Marraskuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Joulukuu",
      "maksettuliikennointikorvaus": 0,
      "kommentit": ""
    }
  ];

  $scope.nousukorvaukset = [
    {
      "kuukausi": "Tammikuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Helmikuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Maaliskuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Huhtikuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Toukokuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Kesäkuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Heinäkuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Elokuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Syyskuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Lokakuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Marraskuu",
      "nousukorvaus": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Joulukuu",
      "nousukorvaus": 0,
      "kommentit": ""
    }
  ];

  $scope.lipputulot = [
    {
      "kuukausi": "Tammikuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Helmikuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Maaliskuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Huhtikuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
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
      "lipputulo": 0,
      "kommentit": ""
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
      "lipputulo": 0,
      "kommentit": ""
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
      "lipputulo": 0,
      "kommentit": ""
    },
    {
      "kuukausi": "Joulukuu",
      "kertalippu": 0,
      "arvolippu": 0,
      "kausilippu": 0,
      "lipputulo": 0,
      "kommentit": ""
    }
  ];


  $scope.nousuaSumma = function () {
    return _.sum($scope.tunnusluvut, 'nousua');
  };

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

  $scope.nousukorvausSumma = function () {
    return _.sum($scope.nousukorvaukset, 'nousukorvaus');
  };

  $scope.kaikkilipputulotSumma = function () {
    return ($scope.kertaliputSumma() + $scope.arvoliputSumma() + $scope.kausiliputSumma());
  };

  $scope.liikennointikorvausSumma = function () {
    return _.sum($scope.jarjestamiskustannukset, 'maksettuliikennointikorvaus');
  };

  $scope.linjaautotSumma = function () {
    return _.sum($scope.kalusto, 'linjaautot');
  };

  $scope.kohdeErrorMessage = function (input) {
    return input.$error.required ? 'Kohteen nimi on pakollinen tieto.' :
      input.$error.minlength ? 'Nimen pituus pitää olla vähintään 2 merkkiä.' : '';
  };

  $scope.kertalippuErrorMessage = pakollinenErrorMessage("Kertalippu (€/kk ilman ALV)");
  $scope.arvolippuErrorMessage = pakollinenErrorMessage("Arvolippu (€/kk ilman ALV)");
  $scope.kausilippuErrorMessage = pakollinenErrorMessage("Kausilippu (€/kk ilman ALV)");
  $scope.liikennointikorvausErrorMessage = pakollinenErrorMessage("Maksettu liikennöinnin sopimuskorvaus (€/kk ilman ALV)");
  $scope.lipputuloErrorMessage = pakollinenErrorMessage("Lipputulo (€/kk ilman ALV)");
  $scope.linjakilometritErrorMessage = pakollinenErrorMessage("Linjakilometrit (linja-km/päivä)");
  $scope.voittajanhintaErrorMessage = pakollinenErrorMessage("Voittaneen tarjouksen hinta");
  $scope.toiseksitulleenhintaErrorMessage = pakollinenErrorMessage("Toiseksi tulleen tarjouksen hinta");
  $scope.vuorotarjontaErrorMessage = pakollinenErrorMessage("Vuorotarjonta (lähtöä/päivä)");
  $scope.kokonaislukuErrorMessage = function (input) {
    return input.$error.number ? 'Tähän pitää syöttää kokonaisluku.' : ''
  };
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
    controller: ['$scope', tarjontaController]
  };
};
