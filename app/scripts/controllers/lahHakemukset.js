'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:MainCtrl
 * @description
 * # AvustushakemusCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('LahHakemuksetCtrl', function ($scope, $location, HakemusFactory) {

    $scope.loadData = function () {
      HakemusFactory.query(function (data) {
        var hakemuksetTmp = [];
        _(angular.fromJson(data)).forEach(function (hakemusvuosi) {
          var nykyhetki = Number(new Date());
          var avustushakemusAlkupvm = Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.alkupvm));
          var maksatushakemus1Alkupvm = Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.alkupvm));
          var maksatushakemus2Alkupvm = Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakuaika.alkupvm));
          var avustushakemusTilatunnus = _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakemustilatunnus;
          var maksatushakemus1Tilatunnus = _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakemustilatunnus;
          var maksatushakemus2Tilatunnus = _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakemustilatunnus;
          if (avustushakemusAlkupvm>nykyhetki){
            avustushakemusTilatunnus = 'FEK';
          }
          if (maksatushakemus1Alkupvm>nykyhetki){
            maksatushakemus1Tilatunnus = 'FEK';
          }
          if (maksatushakemus2Alkupvm>nykyhetki){
            maksatushakemus2Tilatunnus = 'FEK';
          }
          hakemuksetTmp.push({
            'vuosi': hakemusvuosi.vuosi,
            'avustushakemusId': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).id,
            'avustushakemusTilatunnus': avustushakemusTilatunnus,
            'avustushakemusAlkupvm': avustushakemusAlkupvm,
            'avustushakemusLoppupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.loppupvm)),
            'maksatushakemus1Id': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).id,
            'maksatushakemus1Tilatunnus': maksatushakemus1Tilatunnus,
            'maksatushakemus1Alkupvm': maksatushakemus1Alkupvm,
            'maksatushakemus1Loppupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.loppupvm)),
            'maksatushakemus2Id': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).id,
            'maksatushakemus2Tilatunnus': maksatushakemus2Tilatunnus,
            'maksatushakemus2Alkupvm': maksatushakemus2Alkupvm,
            'maksatushakemus2Loppupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakuaika.loppupvm))
          });
        });
        $scope.hakemukset = _.sortBy(hakemuksetTmp, 'vuosi').reverse();
      }, function (error) {
        console.log('kasHakemuskaudenHallinta.js' + error.toString());
      });
    };

    $scope.getHakemus = function (hakemusId){
      $location.path('/l/hakemus/'+hakemusId);
    };

    $scope.loadData();

  });
