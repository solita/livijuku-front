'use strict';

var _ = require('lodash');
var core = require('utils/core');
var angular = require('angular');
var pdf = require('utils/pdfurl');

angular.module('jukufrontApp')
  .controller('KasittelijaSuunnitteluCtrl',
    ['$rootScope', '$scope', '$stateParams', '$state', '$q', '$window',
      'HakemuskausiService', 'HakemusService', 'SuunnitteluService',
      'StatusService', 'PaatosService', 'OrganisaatioService',
      function ($rootScope, $scope, $stateParams, $state, $q, $window,
                HakemuskausiService, HakemusService, SuunnitteluService,
                StatusService, PaatosService, OrganisaatioService) {

        $scope.lajitunnus = $stateParams.lajitunnus;
        $scope.tyyppi = $stateParams.tyyppi;
        $scope.vanhaArvo = 0;
        $scope.vuosi = $stateParams.vuosi;
        $scope.kaikkiTarkastettu = false;
        $scope.paatos = {};

        function haeElyPaatos() {
          PaatosService.haeElyPaatos($scope.vuosi).then(paatos => $scope.paatos = paatos,
            StatusService.errorHandler);
        }

        function haeMaararahat() {
          HakemuskausiService.haeMaararaha($scope.vuosi, $scope.lajitunnus)
            .then(function (response) {
              var data = response.data;
              if (_.isEmpty(data)) {
                $scope.maararaha = 0;
                $scope.ylijaama = 0;
              } else {
                $scope.maararaha = data.maararaha;
                $scope.ylijaama = data.ylijaama;
              }
              $scope.jaettavaraha = $scope.maararaha + $scope.ylijaama;
            }, StatusService.errorHandler);
        }

        $scope.muutos = function (hakemus) {
          return hakemus.myonnettavaAvustus - hakemus.haettuAvustus;
        };

        function haeSuunnitteluData() {
          $q.all([
              SuunnitteluService.hae($scope.vuosi, $scope.tyyppi),
              OrganisaatioService.hae()
            ])
            .then(([suunnittelu, organisaatiot]) => {

              var hakemukset = _.filter(
                _.map(suunnittelu.data, hakemus => {
                  var organisaatio = _.find(organisaatiot, {'id': hakemus.organisaatioid});
                  return {
                    hakemusId: hakemus.id,
                    organisaatiolajitunnus: organisaatio.lajitunnus,
                    hakija: organisaatio.nimi,
                    hakemuksenTila: hakemus.hakemustilatunnus,
                    haettuAvustus: hakemus['haettu-avustus'],
                    myonnettavaAvustus: hakemus['myonnettava-avustus']
                  };
                }), ['organisaatiolajitunnus', $scope.lajitunnus]);

              $scope.kaikkiTarkastettu = _.every(hakemukset, { hakemuksenTila: 'T' });
              $scope.haettuAvustusSum = _.sumBy(hakemukset, 'haettuAvustus');
              $scope.myonnettavaAvustusSum = _.sumBy(hakemukset, 'myonnettavaAvustus');
              $scope.muutosSum = _.sumBy(hakemukset, $scope.muutos);

              $scope.hakemuksetSuunnittelu = _.sortBy(hakemukset, 'hakija');
            }, StatusService.errorHandler);
        }

        $scope.asetaVanhaArvo = function (arvo) {
          $scope.vanhaArvo = arvo;
        };

        $scope.euroSyoteNumeroksi = function (arvo) {
          return parseFloat(arvo.replace(/[^0-9,-]/g, '').replace(',', '.'));
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

        function safe(f) {
          return function (hakemus) {
            return (hakemus !== undefined) && (hakemus !== null) ? f(hakemus) : false;
          };
        }

        $scope.hakemusKeskenerainen = safe(function (hakemus) {
          return _.includes(['0', 'K', 'T0'], hakemus.hakemuksenTila);
        });

        $scope.hakemusPaatetty = safe(function (hakemus) {
          return _.includes(['P', 'S'], hakemus.hakemuksenTila);
        });

        $scope.hakemusVireilla = safe(function (hakemus) {
          return _.includes(['V', 'TV'], hakemus.hakemuksenTila);
        });

        $scope.hakemusTarkastettu = safe(function (hakemus) {
          return _.includes(['T', 'P', 'S'], hakemus.hakemuksenTila);
        });

        $scope.hakemusTarkastamatta = safe(function (hakemus) {
          return hakemus.hakemuksenTila !== 'T';
        });

        $scope.hakemusVireilla = safe(function (hakemus) {
          return _.includes(['V', 'TV'], hakemus.hakemuksenTila);
        });

        $scope.myonnettyLiikaa = function () {
          return $scope.jaettavaraha < $scope.myonnettavaAvustusSum;
        };

        $scope.isAvustushakemus = function () {
          return $scope.tyyppi === 'AH0';
        };

        $scope.isMaksatushakemus1 = function () {
          return $scope.tyyppi === 'MH1';
        };

        $scope.isMaksatushakemus2 = function () {
          return $scope.tyyppi === 'MH2';
        };

        $scope.isElyhakemus = function () {
          return $scope.tyyppi === 'ELY';
        };

        $scope.sallittuAvustus = function (myonnettavaAvustus, haettuAvustus, tila) {
          if (tila === 'K' || tila === 'T0') {
            return true;
          } else if (typeof myonnettavaAvustus === 'undefined') {
            return false;
          } else if (typeof myonnettavaAvustus === 'number') {
            return (myonnettavaAvustus >= 0 && myonnettavaAvustus <= haettuAvustus);
          }
          return true;
        };

        $scope.siirryHakemukseen = function siirryHakemukseen(hakemus) {
          $state.go('app.hakemus', {
            id: hakemus.hakemusId
          });
        };

        $scope.paivitaAvustus = function (avustus, hakemusid) {
          StatusService.tyhjenna();
          $scope.$broadcast('show-errors-check-validity');
          if ($scope.suunnitteluForm.$valid) {
            if (isNaN(avustus)) {
              haeSuunnitteluData();
            } else if (avustus !== $scope.vanhaArvo) {
              SuunnitteluService.suunniteltuAvustus(avustus, hakemusid)
                .then(function () {
                  StatusService.ok('SuunnitteluService.suunniteltuAvustus(' + avustus + ',' + hakemusid + ')', 'Myönnettävä avustus:' + avustus + ' € päivitetty.');
                  haeSuunnitteluData();
                }, StatusService.errorHandler);
            }
          } else {
            StatusService.virhe('HakemuskausiService.paivitaMaararaha()', 'Korjaa lomakkeen virheet.');
            return;
          }
        };

        $scope.paivitaKokonaismaararaha = function (arvo) {
          StatusService.tyhjenna();
          $scope.$broadcast('show-errors-check-validity');
          if ($scope.maararahaForm.$valid) {
            var muuttunut = false;
            if (arvo === 'maararaha') {
              if (isNaN($scope.maararaha)) {
                haeMaararahat();
              } else {
                muuttunut = $scope.maararaha !== $scope.vanhaArvo;
              }
            }
            if (arvo === 'ylijaama') {
              if (isNaN($scope.ylijaama)) {
                haeMaararahat();
              } else {
                muuttunut = $scope.ylijaama !== $scope.vanhaArvo;
              }
            }
            if (muuttunut) {
              var maararahadata = {
                'maararaha': $scope.maararaha,
                'ylijaama': $scope.ylijaama
              };
              HakemuskausiService.paivitaMaararaha($scope.vuosi, $scope.lajitunnus, maararahadata)
                .then(function () {
                  StatusService.ok('paivitaMaararaha', 'Kauden ' + $scope.vuosi + ' määrärahat on päivitetty.');
                  haeMaararahat();
                }, StatusService.errorHandler);
            }
          } else {
            StatusService.virhe('HakemuskausiService.paivitaMaararaha()', 'Korjaa lomakkeen virheet.');
            return;
          }
        };

        function tallennaElyPaatokset() {
          var selite = _.get($scope, 'paatos.selite', '');
          var paatokset = _.map($scope.hakemuksetSuunnittelu,
            hakemus => ({
              hakemusid: hakemus.hakemusId,
              myonnettyavustus: hakemus.myonnettavaAvustus,
              selite: selite
            }));

          return PaatosService.tallennaPaatokset(paatokset).then(
            () => StatusService.ok('', 'Ely hakemusten päätökset on päivitetty'),
            StatusService.errorHandler);
        }

        $scope.tallennaElyPaatokset = function () {
          if (!$scope.suunnitteluForm.$valid) {
            StatusService.virhe('tallennaElyPaatokset', 'Korjaa suunnittelulomakkeen virheet ennen tallentamista.');
            return;
          }
          tallennaElyPaatokset();
        };

        $scope.hyvaksyElyPaatokset = function (enableAsiahallinta) {
          if (!$scope.suunnitteluForm.$valid) {
            StatusService.virhe('hyvaksyPaatokset', 'Korjaa suunnittelulomakkeen virheet ennen tallentamista.');
            return;
          }
          tallennaElyPaatokset().then(() =>
            PaatosService.hyvaksyElyPaatokset($scope.vuosi, enableAsiahallinta).then(
              () => {
                StatusService.ok('', 'Ely hakemusten päätökset on hyväksytty');
                haeSuunnitteluData();
                haeElyPaatos();
              },
              StatusService.errorHandler));


        };

        $scope.isTallennaPaatosEnabled = function () {
          return $scope.sallittu('kasittely-hakemus') &&
            core.isNullOrUndefined($scope.paatos.voimaantuloaika);
        };

        $scope.isHyvaksyPaatosEnabled = function () {
          return $scope.sallittu('hyvaksy-paatos') &&
            core.isNullOrUndefined($scope.paatos.voimaantuloaika) &&
            $scope.kaikkiTarkastettu;
        };

        $scope.tallennaPaatosDisabledTooltip = function () {
          if (!$scope.sallittu('kasittely-hakemus')) {
            return 'Käyttäjällä ei ole oikeutta muokata päätöksi.';
          } else if (core.isDefinedNotNull($scope.paatos.voimaantuloaika)) {
            return 'Hyväksyttyjen päätösten tietoja ei voi muuttaa.';
          }
        };

        $scope.hyvaksyPaatosDisabledTooltip = function () {
          if (!$scope.sallittu('hyvaksy-paatos')) {
            return 'Käyttäjällä ei ole oikeutta hyväksyä päätöstä.';
          } else if (core.isDefinedNotNull($scope.paatos.voimaantuloaika)) {
            return 'Päätökset on jo hyväksytty.';
          } else if (!$scope.kaikkiTarkastettu) {
            return 'Päätökset voi hyväksyä vasta sitten kun kaikki hakemukset on tarkastettu.';
          }
        };

        $scope.naytaPaatos = function (hakemus) {
          if (!$scope.suunnitteluForm.$valid) {
            StatusService.virhe('tallennaElyPaatokset', 'Korjaa suunnittelulomakkeen virheet ennen tallentamista.');
            return;
          }
          if ($scope.isTallennaPaatosEnabled()) {
            var ikkuna = $window.open('about:blank', '_blank');

            var selite = _.get($scope, 'paatos.selite', '');
            var paatokset = _.map($scope.hakemuksetSuunnittelu,
              hakemus => ({
                hakemusid: hakemus.hakemusId,
                myonnettyavustus: hakemus.myonnettavaAvustus,
                selite: selite
              }));

            PaatosService.tallennaPaatokset(paatokset).then(
              () => ikkuna.location.href = pdf.getPaatosPdfUrl(hakemus.hakemusId));

          } else {
            $window.open(pdf.getPaatosPdfUrl(hakemus.hakemusId));
          }
        };

        $scope.naytaPaatosTitle = function () {
          if ($scope.isTallennaPaatosEnabled()) {
            return 'Tallenna ja esikatsele päätös';
          } else {
            return 'Näytä päätös';
          }
        };

        haeMaararahat();
        haeSuunnitteluData();
        if ($scope.isElyhakemus()) {
          haeElyPaatos();
        }
      }]);
