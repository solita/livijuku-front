'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('KasittelijaSuunnitteluCtrl', ['$rootScope', '$scope', '$stateParams', 'HakemuskausiService', 'HakemusService', 'SuunnitteluService', 'StatusService', '$state', '$q', 'OrganisaatioService', function ($rootScope, $scope, $stateParams, HakemuskausiService, HakemusService, SuunnitteluService, StatusService, $state, $q, OrganisaatioService) {

    $scope.lajitunnus = $stateParams.lajitunnus;
    $scope.tyyppi = $stateParams.tyyppi;
    $scope.vanhaArvo = 0;
    $scope.vuosi = $stateParams.vuosi;

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
                  'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                  'hakemuksenTila': hakemus.hakemustilatunnus,
                  'haettuAvustus': hakemus['haettu-avustus'],
                  'muutos': muutos,
                  'myonnettavaAvustus': hakemus['myonnettava-avustus']
                });
              }
            }
          );
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

    $scope.hakemusTarkastettu = safe(function (hakemus) {
      return _.contains(['T', 'P', 'S'], hakemus.hakemuksenTila);
    });

    $scope.hakemusTarkastamatta = safe(function (hakemus) {
      return hakemus.hakemuksenTila != 'T';
    });

    $scope.myonnettyLiikaa = function () {
      return $scope.jaettavaraha < $scope.myonnettavaAvustusSum;
    };

    $scope.onAvustushakemus = function () {
      return $scope.tyyppi == 'AH0';
    };

    $scope.onMaksatushakemus1 = function () {
      return $scope.tyyppi == 'MH1';
    };

    $scope.onMaksatushakemus2 = function () {
      return $scope.tyyppi == 'MH2';
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

    haeMaararahat();
    haeSuunnitteluData();
  }]);
