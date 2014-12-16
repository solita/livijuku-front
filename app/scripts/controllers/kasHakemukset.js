'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuksetCtrl
 * @description
 * # KasHakemuksetCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasHakemuksetCtrl', function ($rootScope, $scope, $filter, $location, HakemuskausiFactory) {
    $scope.displayed = [];
    var loadData = function () {
      HakemuskausiFactory.query(function (data) {
        $scope.kaikkiHakemukset = data;
        var hakemuskaudetTmp = [];
        _(angular.fromJson(data)).forEach(function (hakemuskausi) {
          var avustushakemuksetPerVuosi = [];
          _.filter(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).forEach(function (hakemus) {
            avustushakemuksetPerVuosi.push({
              'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
              'hakemuksenTila': hakemus.hakemustilatunnus,
              'viimeisinMuutos': '16.12.2014 11:24',
              'diaarinumero': '123/456',
              'kasittelija': 'Ei määritelty',
              'id': hakemus.id
            });
          });
          hakemuskaudetTmp.push({'vuosi': hakemuskausi.vuosi, 'avustushakemukset': avustushakemuksetPerVuosi, 'accordionOpen': false});
        });
        $scope.avustushakemukset = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
        $scope.avustushakemukset[0].accordionOpen=true;
      }, function
        (error) {
        console.log('kasHakemukset.js' + error.toString());
      });
    };

    $scope.getKasHakemus = function (hakemusId) {
      $location.path('/k/hakemus/'+hakemusId);
    };
    $scope.getKasSuunnittelu = function (vuosi) {
      console.log('KasHakemukset,getKasSuunnitteluId:' + vuosi);
      $location.path('/k/suunnittelu/' + vuosi);
    };
    loadData();
  }
);

