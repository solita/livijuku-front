'use strict';

var _ = require('lodash');
var angular = require('angular');
var $ = require('jquery');
var pdf = require('utils/pdfurl');

angular.module('jukufrontApp')
  .controller('KasittelijaPaatosCtrl', ['$rootScope', '$scope', '$stateParams', '$state', 'HakemusService', 'StatusService', 'PaatosService', 'SuunnitteluService', '$window', function ($rootScope, $scope, $stateParams, $state, HakemusService, StatusService, PaatosService, SuunnitteluService, $window) {

    function haePaatosTiedot() {
      HakemusService.hae($scope.hakemusid)
        .then(function (data) {
          $scope.avustushakemus = data;
          $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
        }, StatusService.errorHandler);

      PaatosService.hae($scope.hakemusid)
        .then(function (data) {
          if (data == null) {
            $scope.paatos = {
              myonnettyavustus: 0,
              selite: ""
            };
          } else {
            $scope.paatos = data;
          }
        }, StatusService.errorHandler);
    }

    $scope.hakemusid = parseInt($stateParams.hakemusid);
    $scope.haettuavustus = $stateParams.haettuavustus;
    $scope.avustus = $stateParams.avustus;
    $scope.vuosi = $stateParams.vuosi;
    $scope.tyyppi = $stateParams.tyyppi;
    $scope.lajitunnus = $stateParams.lajitunnus;
    $scope.vanhaArvo = 0;

    $scope.hasPaatos = function () {
      if (typeof $scope.paatos === 'undefined') return false;
      return $scope.paatos.paatosnumero > -1;
    };

    $scope.asetaVanhaArvo = function (arvo) {
      $scope.vanhaArvo = arvo;
    };

    $scope.getPaatosPdf = function () {
      return pdf.getPaatosPdfUrl($scope.hakemusid);
    };

    $scope.haeHakemusPdf = function () {
      return pdf.getHakemusPdfUrl($scope.hakemusid);
    };

    $scope.hakemusTarkastettu = function () {
      if (typeof $scope.avustushakemus === 'undefined') return false;
      return $scope.avustushakemus.hakemustilatunnus == 'T';
    };

    $scope.naytaPaatos = function () {
      if ($scope.hakemusTarkastettu()) {
        $scope.tallennaPaatos(1);
      } else {
        $window.open(pdf.getPaatosPdfUrl($scope.hakemusid));
      }
    };

    $scope.tallennaPaatos = function (lisatoiminto) {
      StatusService.tyhjenna();
      if (!$scope.paatosForm.$valid) {
        StatusService.virhe('PaatosService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
        return;
      }
      if (lisatoiminto === 1) var ikkuna = $window.open('about:blank', '_blank');
      var paatosdata = {
        "hakemusid": parseInt($scope.hakemusid),
        "myonnettyavustus": parseFloat($scope.avustus),
        "selite": $scope.paatos.selite
      };
      PaatosService.tallenna($scope.hakemusid, paatosdata)
        .then(function () {
          StatusService.ok('PaatosService.tallenna()', 'Tallennus onnistui.');
          SuunnitteluService.suunniteltuAvustus(parseFloat($scope.avustus), $scope.hakemusid)
            .then(function () {
            }, StatusService.errorHandler);

          $scope.paatosForm.$setPristine();
          haePaatosTiedot();
          switch (lisatoiminto) {
            case 0:
              // Pelkka tallennus
              break;
            case 1:
              // Esikatselu
              ikkuna.location.href = pdf.getPaatosPdfUrl($scope.hakemusid);
              break;
            case 2:
              // Hyvaksy
              PaatosService.hyvaksy($scope.hakemusid)
                .then(function () {
                  StatusService.ok('PaatosService.hyvaksy(' + $scope.hakemusid + ')', 'Hakemus päivitettiin päätetyksi.');

                  $state.go('app.kasittelija.suunnittelu', {
                    tyyppi: $scope.tyyppi,
                    vuosi: $scope.vuosi,
                    lajitunnus: $scope.lajitunnus
                  });
                }, StatusService.errorHandler);
              break;
          }
        }, StatusService.errorHandler);
    };

    $scope.tarkistaTyhja = function (arvo) {
      if (isNaN(arvo)) {
        $scope.paatos.myonnettyavustus = $scope.vanhaArvo;
      }
    };

    haePaatosTiedot()
  }]);
