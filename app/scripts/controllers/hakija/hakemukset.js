'use strict';

var _ = require('lodash');
var angular = require('angular');

var tilaAvaimet = {
  'AH0': 'avustushakemus',
  'MH1': 'maksatushakemus1',
  'MH2': 'maksatushakemus2'
};

function luoHakemusVuosi(hakemusvuosi) {

  var avustushakemukset = _.reduce(tilaAvaimet, (memo, tila, lyhenne) => {

    var hakemus = _.find(hakemusvuosi.hakemukset, {hakemustyyppitunnus: lyhenne});
    memo[tila] = {
      id: hakemus.id,
      tilatunnus: hakemus.hakemustilatunnus,
      alkupvm: Number(new Date(hakemus.hakuaika.alkupvm)),
      loppupvm: Number(new Date(hakemus.hakuaika.loppupvm)),
    };

    return memo;
  }, {});

  return {
    vuosi: hakemusvuosi.vuosi,
    avustushakemukset: avustushakemukset
  };
}

angular.module('jukufrontApp')
  .controller('HakijaHakemuksetCtrl', ['$scope', '$location', 'HakemusService', 'StatusService', function ($scope, $location, HakemusService, StatusService) {

    $scope.valitseHakemus = function (tyyppi, hakemuskausi) {
      if(hakemuskausi.avustushakemukset.maksatushakemus2.tilatunnus === 'FEK') {
        return;
      }
      $location.path(`/h/hakemus/${hakemuskausi.vuosi}/${tyyppi}/${hakemuskausi.avustushakemukset.avustushakemus.id}/${hakemuskausi.avustushakemukset.maksatushakemus1.id}/${hakemuskausi.avustushakemukset.maksatushakemus2.id}`);
    };

    HakemusService.haeKaikki()
      .success(function (data) {
        var vuodet = _.map(data, luoHakemusVuosi);
        $scope.hakemukset = _.sortBy(vuodet, 'vuosi').reverse();
      })
      .error(function (data) {
        StatusService.virhe('HakemusService.haeKaikki())', data.message);
      });

  }]);
