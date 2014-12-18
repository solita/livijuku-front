'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuksetCtrl
 * @description
 * # KasHakemuksetCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasSuunnitteluCtrl', function ($rootScope, $scope, $location, $routeParams, HakemusSuunnitelmatFactory, HakemusFactory) {

    $scope.vuosi = $routeParams.vuosi;

    $scope.loadData = function () {
      HakemusSuunnitelmatFactory.get({
        'vuosi': $routeParams.vuosi,
        'hakemustyyppitunnus': $routeParams.tyyppi
      }, function (data) {
        var hakemuksetSuunnitteluTmp = [];
        $scope.haettuAvustusSum = 0;
        $scope.myonnettavaAvustusSum = 0;
        $scope.muutosSum = 0;
        _(angular.fromJson(data)).forEach(function (hakemus) {
          var muutos = 0;
          if (hakemus.hakemustilatunnus==='T'){
            $scope.haettuAvustusSum =  $scope.haettuAvustusSum + hakemus['haettu-avustus'];
            $scope.myonnettavaAvustusSum = $scope.myonnettavaAvustusSum + hakemus['myonnettava-avustus'];
            muutos = hakemus['myonnettava-avustus'] - hakemus['haettu-avustus'];
            $scope.muutosSum = $scope.muutosSum + muutos;
          }
          hakemuksetSuunnitteluTmp.push({
            'hakemusId': hakemus.id,
            'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
            'hakemuksenTila':hakemus.hakemustilatunnus,
            'haettuAvustus': hakemus['haettu-avustus'],
            'muutos': muutos,
            'myonnettavaAvustus': hakemus['myonnettava-avustus']
          });
        });
        $scope.hakemuksetSuunnittelu = hakemuksetSuunnitteluTmp;
      });
    } , function
      (error) {
      console.log('kasSuunnittelu.js' + error.toString());
    };

    $scope.loadData();

    $scope.getPaatos = function (hakemusId, avustus) {
      $location.path('/k/paatos/' + hakemusId + '/' + avustus);
    };

    $scope.updateAvustus = function (hakemusId, avustus) {
      HakemusFactory.suunniteltuavustus({
        'suunniteltuavustus': avustus,
        'hakemusid': hakemusId
      }, function(){
        $scope.loadData();
      });
    };
  });
