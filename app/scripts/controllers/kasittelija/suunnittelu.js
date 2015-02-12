'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaSuunnitteluCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'HakemusService', 'SuunnitteluService', 'StatusService', function ($rootScope, $scope, $location, $routeParams, HakemusService, SuunnitteluService, StatusService) {

    $scope.lajitunnus = $routeParams.lajitunnus;
    $scope.tyyppi = $routeParams.tyyppi;
    $scope.vanhaArvo = 0;
    $scope.vuosi = $routeParams.vuosi;

    function haeSuunnitteluData() {
      SuunnitteluService.hae($routeParams.vuosi, $routeParams.tyyppi)
        .success(function (data) {
          var hakemuksetSuunnitteluTmp = [];
          var organisaatiolajitunnus = "";
          $scope.haettuAvustusSum = 0;
          $scope.myonnettavaAvustusSum = 0;
          $scope.muutosSum = 0;
          _(angular.fromJson(data)).forEach(function (hakemus) {
              organisaatiolajitunnus = _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).lajitunnus;
              if (organisaatiolajitunnus == $scope.lajitunnus) {
                var muutos = 0;
                if (hakemus.hakemustilatunnus === 'T'||hakemus.hakemustilatunnus === 'P') {
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
          $scope.hakemuksetSuunnittelu = hakemuksetSuunnitteluTmp;
        })
        .error(function (data) {
          StatusService.virhe('SuunnitteluService.hae(' + $routeParams.vuosi + ',' + $routeParams.tyyppi + ')', data);
        });
    }

    $scope.asetaVanhaArvo = function (arvo) {
      $scope.vanhaArvo = arvo;
    };

    $scope.siirryPaatokseen = function (hakemusId, haettuavustus, avustus) {
      $location.path('/k/paatos/' + $routeParams.vuosi + '/' + $routeParams.tyyppi + '/' + $scope.lajitunnus + '/' + hakemusId + '/' + haettuavustus + '/' + avustus);
    };

    $scope.paivitaAvustus = function (avustus, hakemusid) {
      if (isNaN(avustus)) {
        haeSuunnitteluData();
      } else if (avustus != $scope.vanhaArvo) {
        SuunnitteluService.suunniteltuAvustus(avustus, hakemusid)
          .success(function () {
            StatusService.ok('SuunnitteluService.suunniteltuAvustus(' + avustus + ',' + hakemusid + ')', 'Myönnettävä avustus:' + avustus + ' päivitetty.');
            haeSuunnitteluData();
          })
          .error(function (data) {
            StatusService.virhe('SuunnitteluService.suunniteltuAvustus(' + avustus + ',' + hakemusid + ')', data);
          });
      }
    };
    haeSuunnitteluData();
  }]);
