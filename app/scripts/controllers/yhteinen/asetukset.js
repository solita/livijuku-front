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
      KayttajaService.hae()
        .then(function (k) {
          paivitaTiedot(k);
        })
        .catch(function (data) {
          StatusService.virhe('KayttajaService.hae()', data.message);
        });
    }

    $scope.paivitaAsetus = function () {
      KayttajaService.paivitaSahkopostiviestit($scope.sahkopostiviestit)
        .success(function (data) {
          StatusService.ok('KayttajaService.paivitaSahkopostiviestit(' + $scope.sahkopostiviestit + ')', 'Sähköpostiasetukset päivitettiin onnistuneesti.');
          paivitaTiedot(data);
        })
        .error(function (data) {
          StatusService.virhe('KayttajaService.paivitaSahkopostiviestit(' + $scope.sahkopostiviestit + ')', data.message);
        });
    };
    haeKayttajatiedot();
  }]);
