'use strict';

angular.module('jukufrontApp')
  .controller('KasHakemuskaudenHallintaCtrl', function ($scope, $location, $route, $log, HakemuskausiFactory) {
    $scope.haeHakemuskaudet = function () {
      HakemuskausiFactory.hae()
        .success(function (data) {
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
        })
        .error(function (data) {
          console.log('Virhe: HakemuskausiFactory.hae(): ' + data);
        });
    };

    $scope.luoUusiHakemuskausi = function (vuosi) {
      HakemuskausiFactory.luoUusi(vuosi)
        .success(function () {
          $scope.haeHakemuskaudet();
        })
        .error(function (data) {
          console.log('Virhe: HakemuskausiFactory.luoUusi('+vuosi+'): ' + data);
        });
    };

    $scope.haeHakemuskaudet();

  });

