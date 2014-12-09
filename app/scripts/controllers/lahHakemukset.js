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

    var loadData = function () {
      HakemusFactory.query({id: 1}, function (data) {
        var hakemuksetTmp = [];
        _(angular.fromJson(data)).forEach(function (hakemusvuosi) {
          hakemuksetTmp.push({
            'vuosi': hakemusvuosi.vuosi,
            'avustushakemusId': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).id,
            'avustushakemusTilatunnus': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakemustilatunnus,
            'avustushakemusAlkupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.alkupvm)),
            'avustushakemusLoppupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.loppupvm)),
            'maksatushakemus1Id': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).id,
            'maksatushakemus1Tilatunnus': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakemustilatunnus,
            'maksatushakemus1Alkupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.alkupvm)),
            'maksatushakemus1Loppupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.loppupvm)),
            'maksatushakemus2Id': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).id,
            'maksatushakemus2Tilatunnus': _.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakemustilatunnus,
            'maksatushakemus2Alkupvm': Number(new Date(_.find(hakemusvuosi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakuaika.alkupvm)),
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

    loadData();

  });
