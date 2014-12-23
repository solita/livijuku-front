'use strict';

angular.module('jukufrontApp')
  .controller('KasSuunnitteluCtrl', function ($rootScope, $scope, $location, $routeParams, HakemusFactory, SuunnitteluFactory) {

    $scope.vuosi = $routeParams.vuosi;

    $scope.haeSuunnitteluData = function () {
      SuunnitteluFactory.hae($routeParams.vuosi, $routeParams.tyyppi)
        .success(function (data) {
          var hakemuksetSuunnitteluTmp = [];
          $scope.haettuAvustusSum = 0;
          $scope.myonnettavaAvustusSum = 0;
          $scope.muutosSum = 0;
          _(angular.fromJson(data)).forEach(function (hakemus) {
            var muutos = 0;
            if (hakemus.hakemustilatunnus === 'T') {
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
          });
          $scope.hakemuksetSuunnittelu = hakemuksetSuunnitteluTmp;
        })
        .error(function (data) {
          console.log('Virhe: SuunnitteluFactory.hae(' + $routeParams.vuosi + ',' + $routeParams.tyyppi + '): ' + data);
        });
    };

    $scope.haeSuunnitteluData();

    $scope.getPaatos = function (hakemusId, avustus) {
      $location.path('/k/paatos/' + hakemusId + '/' + avustus);
    };

    $scope.paivitaAvustus = function (avustus, hakemusid) {
      SuunnitteluFactory.suunniteltuAvustus(avustus, hakemusid)
        .success(function () {
          $scope.haeSuunnitteluData();
        })
        .error(function (data) {
          console.log('Virhe:  SuunnitteluFactory.suunniteltuAvustus(' + avustus + ',' + hakemusid + '): ' + data);
        });
    };
  });
