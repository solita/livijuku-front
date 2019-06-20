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
        return c.isNullOrUndefined(omarahoitus) || c.isNullOrUndefined(haettavarahoitus) ||
          (((100 - $scope.avustusprosentti) / 100) * (haettavarahoitus + omarahoitus)) <= omarahoitus;
      };

      $scope.sallittuArvo = function (number) {
        return c.isDefinedNotNull(number) && number >= 0 && number <= 999999999.99;
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
