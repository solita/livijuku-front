'use strict';

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      name: '@',
      hakemus: '=',
      kohde: '=',
      vuosi: '=',
      vertailuarvot: '&',
      hakemustyyppi: '=',
      alv: '='
    },
    controller: ['$scope', '$rootScope', 'AvustuskohdeService', 'AuthService', '$sce', function ($scope, $rootScope, AvustuskohdeService, AuthService, $sce) {

      function arvo_teksti(arvo, alvmukana, prosentti) {
        if (typeof arvo === 'undefined') return;
        if (alvmukana) {
          return arvo.toFixed(2).toString().replace('.', ',') + ' € (sis. alv)';
        } else {
          return (arvo / (1 + (prosentti / 100))).toFixed(2).toString().replace('.', ',') + ' € (alv 0%)';
        }
      }

      $scope.avustusprosentti = AvustuskohdeService.avustusprosentti($scope.vuosi, $scope.kohde.avustuskohdeluokkatunnus, $scope.kohde.avustuskohdelajitunnus);

      $scope.euroSyoteNumeroksi = function (arvo) {
        return parseFloat(arvo.replace(/[^0-9,-]/g, '').replace(',', '.'));
      };

      $scope.getName = function (key) {
        return $scope.kohde.avustuskohdeluokkatunnus + '-' + $scope.kohde.avustuskohdelajitunnus + '-' + key;
      };

      $scope.haeTooltip = function (syotekentta, alvmukana, alvprosentti) {
        var tooltip = '';
        if ($scope.hakemustyyppi !== 'AH0') {
          if (syotekentta === 'haettavaavustus') {
            tooltip = 'Avustushakemuksessa haettu avustus:' + arvo_teksti($scope.vertailuarvot().avustushakemusHaettavaAvustus, alvmukana, alvprosentti);
          }
          else if (syotekentta === 'omarahoitus') {
            tooltip = 'Avustushakemuksessa omarahoitus:' + arvo_teksti($scope.vertailuarvot().avustushakemusOmaRahoitus, alvmukana, alvprosentti);
          }
        }
        if ($scope.hakemustyyppi === 'MH2') {
          if (syotekentta === 'haettavaavustus') {
            tooltip = tooltip + '\n' + 'Maksatushakemuksessa haettu avustus:' + arvo_teksti($scope.vertailuarvot().maksatushakemusHaettavaAvustus, alvmukana, alvprosentti);
          }
          else if (syotekentta === 'omarahoitus') {
            tooltip = tooltip + '\n' + 'Maksatushakemuksessa omarahoitus:' + arvo_teksti($scope.vertailuarvot().maksatushakemusOmaRahoitus, alvmukana, alvprosentti);
          }
        }
        return tooltip;
      };

      $scope.isReadonly = function () {
        // TODO: LIVIJUKU-229 Toisten hakijoiden hakemusten syötekentät pitää muuttaa vain luku -tilaan
        // TODO: Poista muokkaus vireillä olevalta, jne. hakemuslomakkeelta.
        if (typeof $scope.hakemus === 'undefined') {
          return false;
        }
        return !AuthService.hakijaSaaMuokataHakemusta($scope.hakemus);
      };

      $scope.omarahoitusRiittava = function (omarahoitus, haettavarahoitus) {
        var omarahoitus2, haettavarahoitus2;

        if ((typeof omarahoitus === 'undefined') || (typeof haettavarahoitus === 'undefined')) {
          return true;
        }

        if (typeof omarahoitus === 'string') {
          omarahoitus2 = $scope.euroSyoteNumeroksi(omarahoitus);
        }
        if (typeof haettavarahoitus === 'string') {
          haettavarahoitus2 = $scope.euroSyoteNumeroksi(haettavarahoitus);
        }
        if (typeof omarahoitus === 'number') {
          omarahoitus2 = parseFloat(omarahoitus);
        }
        if (typeof haettavarahoitus === 'number') {
          haettavarahoitus2 = parseFloat(haettavarahoitus);
        }
        return (((100 - $scope.avustusprosentti) / 100) * (haettavarahoitus2 + omarahoitus2)) <= omarahoitus2;
      };

      $scope.sallittuArvo = function (value) {
        if (typeof value === 'undefined') {
          return false;
        } else if (typeof value === 'string') {
          var floatarvo;
          floatarvo = $scope.euroSyoteNumeroksi(value);
          return (floatarvo >= 0 && floatarvo <= 999999999.99);
        } else if (typeof value === 'number') {
          return (value >= 0 && value <= 999999999.99);
        }
        return true;
      };

    }

    ],
    template: require('./index.html')
  };
};
