'use strict';
var c = require('utils/core');

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

      $scope.avustusprosentti = AvustuskohdeService.avustusprosentti($scope.vuosi, $scope.kohde.avustuskohdeluokkatunnus, $scope.kohde.avustuskohdelajitunnus);

      $scope.euroSyoteNumeroksi = function (arvo) {
        return parseFloat(arvo.replace(/[^0-9,-]/g, '').replace(',', '.'));
      };

      $scope.getName = function (key) {
        return $scope.kohde.avustuskohdeluokkatunnus + '-' + $scope.kohde.avustuskohdelajitunnus + '-' + key;
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

      $scope.yhteensa = function (kohde, alv) {
        var alvPros = 0;
        if (alv) alvPros = kohde.alv;
          return c.roundTwoDecimals((kohde.haettavaavustus + kohde.omarahoitus)*(1 + (alvPros / 100)));
      };

    }

    ],
    template: require('./index.html')
  };
};
