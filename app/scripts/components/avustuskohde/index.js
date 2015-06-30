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
    controller: ['$scope', '$rootScope', 'AvustuskohdeService', 'AuthService', function ($scope, $rootScope, AvustuskohdeService, AuthService) {

      $scope.avustusprosentti = AvustuskohdeService.avustusprosentti($scope.vuosi, $scope.kohde.avustuskohdeluokkatunnus, $scope.kohde.avustuskohdelajitunnus);

      $scope.euroSyoteNumeroksi = function (arvo) {
        return parseFloat(arvo.replace(/[^0-9,-]/g, '').replace(',', '.'));
      };

      $scope.getName = function (key) {
        return $scope.kohde.avustuskohdeluokkatunnus + '-' + $scope.kohde.avustuskohdelajitunnus + '-' + key;
      };

      $scope.haeTooltip = function (syotekentta) {
        var tooltip = '';
        if ($scope.hakemustyyppi !== 'AH0') {
          if (syotekentta === 'haettavaavustus') {
            tooltip = 'Avustushakemus:' + $scope.vertailuarvot().avustushakemusHaettavaAvustus.toString().replace('.', ',') + ' € (sis. alv)';
          }
          else if (syotekentta === 'omarahoitus') {
            tooltip = 'Avustushakemus:' + $scope.vertailuarvot().avustushakemusOmaRahoitus.toString().replace('.', ',') + ' € (sis. alv)';
          }
        }
        if ($scope.hakemustyyppi === 'MH2') {
          if (syotekentta === 'haettavaavustus') {
            tooltip = tooltip + ' ' + '1. Maksatushakemus:' + $scope.vertailuarvot().maksatushakemusHaettavaAvustus.toString().replace('.', ',') + ' € (sis. alv)';
          }
          else if (syotekentta === 'omarahoitus') {
            tooltip = tooltip + ' ' + '1. Maksatushakemus:' + $scope.vertailuarvot().maksatushakemusOmaRahoitus.toString().replace('.', ',') + ' € (sis. alv)';
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

      $scope.sallittuMaksatusArvo = function (value) {
        if ($scope.hakemustyyppi === 'AH0') {
          return true;
        }
        else {
          if (typeof value === 'undefined') {
            return false;
          } else if (typeof value === 'string') {
            var floatarvo;
            floatarvo = $scope.euroSyoteNumeroksi(value);
            return (floatarvo <= ($scope.vertailuarvot().avustushakemusHaettavaAvustus - $scope.vertailuarvot().maksatushakemusHaettavaAvustus));
          } else if (typeof value === 'number') {
            return (value <= ($scope.vertailuarvot().avustushakemusHaettavaAvustus - $scope.vertailuarvot().maksatushakemusHaettavaAvustus));
          }
          return true;
        }
      };

    }],
    template: require('./index.html')
  };
};
