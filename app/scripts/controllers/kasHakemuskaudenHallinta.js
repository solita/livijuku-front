'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuskaudenHallintaCtrl
 * @description
 * # KasHakemuskaudenHallintaCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
   .controller('KasHakemuskaudenHallintaCtrl', function ($scope, $location, $route, $log, HakemuskausiFactory) {
    var loadData = function () {
      HakemuskausiFactory.query(function (data) {
        var hakemuskaudetTmp = [];
        _(angular.fromJson(data)).forEach(function (hakemuskausi) {
          hakemuskaudetTmp.push({
            'vuosi': hakemuskausi.vuosi,
            'avustushakemusTilatunnus': _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakemustilatunnus,
            'avustushakemusAlkupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.alkupvm)),
            'avustushakemusLoppupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.loppupvm)),
            'maksatushakemus1Tilatunnus': _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakemustilatunnus,
            'maksatushakemus1Alkupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.alkupvm)),
            'maksatushakemus1Loppupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.loppupvm)),
            'maksatushakemus2Tilatunnus': _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakemustilatunnus,
            'maksatushakemus2Alkupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakuaika.alkupvm)),
            'maksatushakemus2Loppupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakuaika.loppupvm))
          });
        });
        var seuraavaVuosi = new Date().getFullYear() + 1;
        if (!(_.some(hakemuskaudetTmp, {'vuosi': seuraavaVuosi}))) {
          hakemuskaudetTmp.push({
            'vuosi': seuraavaVuosi,
            'uusi': true,
            'avustushakemusTilatunnus': '',
            'avustushakemusAlkupvm': '',
            'avustushakemusLoppupvm': '',
            'maksatushakemus1Tilatunnus': '',
            'maksatushakemus1Alkupvm': '',
            'maksatushakemus1Loppupvm': '',
            'maksatushakemus2Tilatunnus': '',
            'maksatushakemus2Alkupvm': '',
            'maksatushakemus2Loppupvm': ''
          });
        }
        $scope.hakemuskaudet = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
      }, function (error) {
        console.log('kasHakemuskaudenHallinta.js' + error.toString());
      });
    };

    $scope.createHakemuskausi = function (vuosi) {
      HakemuskausiFactory.create({'vuosi': vuosi}, function () {
        loadData();
      })
    };

    loadData();

  });

