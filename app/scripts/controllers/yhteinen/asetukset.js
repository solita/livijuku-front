'use strict';
var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('AsetuksetCtrl', ['$scope', '$rootScope', 'KayttajaService', 'StatusService', function ($scope, $rootScope, KayttajaService, StatusService) {

    function paivitaTiedot(kayttaja) {
      if (typeof kayttaja === 'undefined') return;
      $scope.nimi = kayttaja.etunimi + ' ' + kayttaja.sukunimi;
      $scope.roolit = kayttaja.roolit;
      $scope.kayttajatunnus = kayttaja.tunnus;
      $scope.sahkoposti = kayttaja.sahkoposti;
      $scope.sahkopostiviestit = kayttaja.sahkopostiviestit;
      if (typeof $rootScope.organisaatiot === 'undefined') return;
      $scope.organisaatio = _.find($rootScope.organisaatiot, {'id': kayttaja.organisaatioid}).nimi;
    }

    function haeKayttajatiedot() {
      KayttajaService.hae().then(paivitaTiedot, StatusService.errorHandler);
    }

    $scope.paivitaAsetus = function () {
      KayttajaService.paivitaSahkopostiviestit($scope.sahkopostiviestit)
        .then(function (response) {
          var data = response.data;
          StatusService.ok('KayttajaService.paivitaSahkopostiviestit(' + $scope.sahkopostiviestit + ')', 'Sähköpostiasetukset päivitettiin onnistuneesti.');
          paivitaTiedot(data);
        }, StatusService.errorHandler);
    };

    haeKayttajatiedot();
  }]);
