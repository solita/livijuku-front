'use strict';

var _ = require('lodash');
var angular = require('angular');

var tilaAvaimet = {
  'AH0': {
    id: 'avustushakemus',
    nimi: 'Avustushakemus'
  },
  'MH1': {
    id: 'maksatushakemus1',
    nimi: '1. maksatushakemus'
  },
  'MH2': {
    id: 'maksatushakemus2',
    nimi: '2. maksatushakemus'
  }
};

function luoHakemusVuosi(hakemusvuosi) {

  var avustushakemukset = _.reduce(tilaAvaimet, (memo, tila, lyhenne) => {

    var hakemus = _.find(hakemusvuosi.hakemukset, {hakemustyyppitunnus: lyhenne});

    var alkupvm = Number(new Date(hakemus.hakuaika.alkupvm));
    var loppupvm = Number(new Date(hakemus.hakuaika.loppupvm));
    var now = Date.now();

    memo[tila.id] = {
      id: hakemus.id,
      tilatunnus: hakemus.hakemustilatunnus,
      alkupvm,
      loppupvm,
      kaynnissa: alkupvm < now && loppupvm > now
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

    $scope.tilaAvaimet = tilaAvaimet;

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
