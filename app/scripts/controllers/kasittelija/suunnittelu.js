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

    function haeElyPaatos() {
      PaatosService.haeElyPaatos($scope.vuosi).then(paatos => $scope.paatos = paatos,
                                                    StatusService.errorHandler);
    }

    function haeMaararahat() {
      HakemuskausiService.haeMaararaha($scope.vuosi, $scope.lajitunnus)
        .then(function (response) {
          var data = response.data;
          if (data != null) {
            $scope.maararaha = data.maararaha;
            $scope.ylijaama = data.ylijaama;
          } else {
            $scope.maararaha = 0;
            $scope.ylijaama = 0;
          }
          $scope.jaettavaraha = $scope.maararaha + $scope.ylijaama;
        }, StatusService.errorHandler);
    }

    function haeSuunnitteluData() {
      $q.all([
          SuunnitteluService.hae($scope.vuosi, $scope.tyyppi),
          OrganisaatioService.hae()
        ])
        .then(([suunnittelu, organisaatiot]) => {
          var suunnitteludata = suunnittelu.data;
          var hakemuksetSuunnitteluTmp = [];
          var organisaatiolajitunnus = "";
          var tarkastettuLkm = 0;
          $scope.haettuAvustusSum = 0;
          $scope.myonnettavaAvustusSum = 0;
          $scope.muutosSum = 0;
          suunnitteludata.forEach(function (hakemus) {
              organisaatiolajitunnus = _.find(organisaatiot, {'id': hakemus.organisaatioid}).lajitunnus;
              if (organisaatiolajitunnus == $scope.lajitunnus) {
                var muutos = 0;
                if (hakemus.hakemustilatunnus === 'T' || hakemus.hakemustilatunnus === 'P') {
                  $scope.haettuAvustusSum = $scope.haettuAvustusSum + hakemus['haettu-avustus'];
                  $scope.myonnettavaAvustusSum = $scope.myonnettavaAvustusSum + hakemus['myonnettava-avustus'];
                  muutos = hakemus['myonnettava-avustus'] - hakemus['haettu-avustus'];
                  $scope.muutosSum = $scope.muutosSum + muutos;
                }
                hakemuksetSuunnitteluTmp.push({
                  'hakemusId': hakemus.id,
                  'hakija': _.find(organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                  'hakemuksenTila': hakemus.hakemustilatunnus,
                  'haettuAvustus': hakemus['haettu-avustus'],
                  'muutos': muutos,
                  'myonnettavaAvustus': hakemus['myonnettava-avustus']
                });
              }
              if (hakemus.hakemustilatunnus === 'T') tarkastettuLkm = tarkastettuLkm + 1;
            }
          );
          $scope.kaikkiTarkastettu = (tarkastettuLkm === suunnitteludata.length);
          $scope.hakemuksetSuunnittelu = _.sortBy(hakemuksetSuunnitteluTmp, 'hakija');
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
      return _.contains(['0', 'K', 'T0'], hakemus.hakemuksenTila)
    });

    $scope.hakemusPaatetty = safe(function (hakemus) {
      return _.contains(['P', 'S'], hakemus.hakemuksenTila);
    });

    $scope.hakemusVireilla = safe(function (hakemus) {
      return _.contains(['V', 'TV'], hakemus.hakemuksenTila);
    });

    $scope.hakemusTarkastettu = safe(function (hakemus) {
      return _.contains(['T', 'P', 'S'], hakemus.hakemuksenTila);
    });

    $scope.hakemusTarkastamatta = safe(function (hakemus) {
      return hakemus.hakemuksenTila != 'T';
    });

    $scope.hakemusVireilla = safe(function (hakemus) {
      return _.contains(['V', 'TV'], hakemus.hakemuksenTila);
    });

    $scope.myonnettyLiikaa = function () {
      return $scope.jaettavaraha < $scope.myonnettavaAvustusSum;
    };

    $scope.isAvustushakemus = function () {
      return $scope.tyyppi == 'AH0';
    };

    $scope.isMaksatushakemus1 = function () {
      return $scope.tyyppi == 'MH1';
    };

    $scope.isMaksatushakemus2 = function () {
      return $scope.tyyppi == 'MH2';
    };

    $scope.isElyhakemus = function () {
      return $scope.tyyppi == 'ELY';
    };

    $scope.sallittuAvustus = function (myonnettavaAvustus, haettuAvustus, tila) {
      if (tila == 'K' || tila == 'T0') return true;
      if (typeof myonnettavaAvustus === 'undefined') {
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
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.suunnitteluForm.$valid) {
        if (isNaN(avustus)) {
          haeSuunnitteluData();
        } else if (avustus != $scope.vanhaArvo) {
          SuunnitteluService.suunniteltuAvustus(avustus, hakemusid)
            .then(function () {
              StatusService.ok('SuunnitteluService.suunniteltuAvustus(' + avustus + ',' + hakemusid + ')', 'Myönnettävä avustus:' + avustus + ' € päivitetty.');
              haeSuunnitteluData();
            }, StatusService.errorHandler);
        }
      }
    };

    $scope.paivitaKokonaismaararaha = function (arvo) {
      StatusService.tyhjenna();
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.suunnitteluForm.$valid) {
        var muuttunut = false;
        if (arvo == 'maararaha') {
          if (isNaN($scope.maararaha)) {
            haeMaararahat();
          } else {
            muuttunut = $scope.maararaha != $scope.vanhaArvo;
          }
        }
        if (arvo == 'ylijaama') {
          if (isNaN($scope.ylijaama)) {
            haeMaararahat();
          } else {
            muuttunut = $scope.ylijaama != $scope.vanhaArvo;
          }
        }
        if (muuttunut) {
          var maararahadata = {
            'maararaha': $scope.maararaha,
            'ylijaama': $scope.ylijaama
          };
          HakemuskausiService.paivitaMaararaha($scope.vuosi, $scope.lajitunnus, maararahadata)
            .then(function () {
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
        hakemus => ({hakemusid: hakemus.hakemusId,
                     paattajanimi: '',
                     myonnettyavustus: hakemus.myonnettavaAvustus,
                     selite: selite}));

      return PaatosService.tallennaPaatokset(paatokset).then(
        () => StatusService.ok('', 'Ely hakemusten päätökset on päivitetty'),
        StatusService.errorHandler);
    }

    $scope.tallennaElyPaatokset = function() {
      if (!$scope.suunnitteluForm.$valid) {
        StatusService.virhe('tallennaElyPaatokset', 'Korjaa suunnittelulomakkeen virheet ennen tallentamista.');
        return;
      }
      tallennaElyPaatokset();
    }

    $scope.hyvaksyElyPaatokset = function() {
      if (!$scope.suunnitteluForm.$valid) {
        StatusService.virhe('hyvaksyPaatokset', 'Korjaa suunnittelulomakkeen virheet ennen tallentamista.');
        return;
      }
      tallennaElyPaatokset().then(() =>
        PaatosService.hyvaksyElyPaatokset($scope.vuosi).then(
          () => StatusService.ok('', 'Ely hakemusten päätökset on hyväksytty'),
          StatusService.errorHandler));

      haeSuunnitteluData();
      haeElyPaatos();
    }

    $scope.isTallennaPaatosEnabled = function() {
      return $scope.sallittu('kasittely-hakemus') &&
             core.isNullOrUndefined($scope.paatos.voimaantuloaika);
    }

    $scope.isHyvaksyPaatosEnabled = function() {
      return $scope.sallittu('hyvaksy-paatos') &&
             core.isNullOrUndefined($scope.paatos.voimaantuloaika) &&
             $scope.kaikkiTarkastettu;
    }

    $scope.tallennaPaatosDisabledTooltip = function () {
      if (!$scope.sallittu('kasittely-hakemus')) {
        return "Käyttäjällä ei ole oikeutta muokata päätöksi.";
      } else if (core.isDefinedNotNull($scope.paatos.voimaantuloaika)) {
        return "Hyväksyttyjen päätösten tietoja ei voi muuttaa.";
      };
    }

    $scope.hyvaksyPaatosDisabledTooltip = function () {
      if (!$scope.sallittu('hyvaksy-paatos')) {
        return "Käyttäjällä ei ole oikeutta hyväksyä päätöstä.";
      } else if (core.isDefinedNotNull($scope.paatos.voimaantuloaika)) {
        return "Päätökset on jo hyväksytty.";
      };
    }

    $scope.naytaPaatos = function (hakemus) {
      if ($scope.isTallennaPaatosEnabled()) {
        var ikkuna = $window.open('about:blank', '_blank');

        PaatosService.tallenna(hakemus.hakemusId,
          { hakemusid: hakemus.hakemusId,
            paattajanimi: '',
            myonnettyavustus: hakemus.myonnettavaAvustus,
            selite: $scope.paatos.selite }).then(() => ikkuna.location.href = pdf.getPaatosPdfUrl(hakemus.hakemusId));

      } else {
        $window.open(pdf.getPaatosPdfUrl(hakemus.hakemusId));
      }
    };

    $scope.naytaPaatosTitle = function () {
      if ($scope.isTallennaPaatosEnabled()) {
        return "Tallenna ja esikatsele päätös";
      } else {
        return "Näytä päätös";
      }
    };

    haeMaararahat();
    haeSuunnitteluData();
    if ($scope.isElyhakemus()) {
      haeElyPaatos();
    }
  }]);
