'use strict';
var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('AsetuksetCtrl', ['$scope', '$rootScope', 'KayttajaService', 'StatusService', function ($scope, $rootScope, KayttajaService, StatusService) {

    function palautaRooliLista(roolit) {
      var roolilista = '';
      (roolit).forEach(function (r) {
        roolilista = roolilista + r + ' ';
      });
      return roolilista;
    }

    function paivitaTiedot(kayttaja) {
      $scope.nimi = kayttaja.etunimi + ' ' + kayttaja.sukunimi;
      $scope.organisaatio = _.find($rootScope.organisaatiot, {'id': kayttaja.organisaatioid}).nimi;
      $scope.roolit = palautaRooliLista(kayttaja.roolit);
      $scope.kayttajatunnus = kayttaja.tunnus;
      $scope.sahkoposti = kayttaja.sahkoposti;
      $scope.sahkopostiviestit = kayttaja.sahkopostiviestit;
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
