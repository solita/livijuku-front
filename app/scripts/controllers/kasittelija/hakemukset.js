'use strict';

var _ = require('lodash');
var angular = require('angular');

function haeOrganisaationHakemukset(hakemukset, organisaatioId) {
  return _.filter(hakemukset, hakemus =>
    hakemus.organisaatioid === organisaatioId
  );
}

function haeHakemustyyppi(hakemukset, hakemustyyppitunnus) {
  return _.find(hakemukset, hakemus =>
     hakemus.hakemustyyppitunnus === hakemustyyppitunnus
  );
}

function laskeLukumaara(tyyppi, hakemukset) {
  return _.reduce(hakemukset, function(sum, hakemuskausi) {
    return sum + _.filter(hakemuskausi.hakemukset, hakemus =>
      ['V', 'TV'].indexOf(hakemus.hakemustilatunnus) > -1 && hakemus.hakemustyyppitunnus === tyyppi
    ).length;
  }, 0);
}

function luoLajitunnusLajittelija(kaikkiOrganisaatiot, hakemusTyyppitunnusFilter) {

  return function lajitteleLajitunnuksiin(hakemuskausi) {

    var lajitunnus = _(hakemuskausi.hakemukset)
    .filter({ hakemustyyppitunnus: hakemusTyyppitunnusFilter})
    .reduce(function (memo, hakemus) {

      var organisaatiolajitunnus = _.find(kaikkiOrganisaatiot, {
        id: hakemus.organisaatioid
      }).lajitunnus;

      memo[organisaatiolajitunnus] = memo[organisaatiolajitunnus] || [];

      var organisaationHakemukset = haeOrganisaationHakemukset(
        hakemuskausi.hakemukset,
        hakemus.organisaatioid
      );

      memo[organisaatiolajitunnus].push({
        id: hakemus.id,
        hakija: _.find(kaikkiOrganisaatiot, {'id': hakemus.organisaatioid}).nimi,
        hakemuksenTila: hakemus.hakemustilatunnus,
        viimeisinMuutos: Number(new Date(hakemus.muokkausaika)),
        diaarinumero: hakemus.diaarinumero,
        kasittelija: 'Ei määritelty',
        avustushakemusId: haeHakemustyyppi(organisaationHakemukset, 'AH0'),
        maksatushakemus1Id: haeHakemustyyppi(organisaationHakemukset, 'MH1'),
        maksatushakemus2Id: haeHakemustyyppi(organisaationHakemukset, 'MH2')
      });

      return memo;
    }, {});

    return {
      vuosi: hakemuskausi.vuosi,
      ks1HakemuksetPerVuosi: _.sortBy(lajitunnus.KS1, 'hakija'),
      ks2HakemuksetPerVuosi: _.sortBy(lajitunnus.KS2, 'hakija'),
      elyHakemuksetPerVuosi: _.sortBy(lajitunnus.ELY, 'hakija'),
      accordionOpen: false
    };
  };
}

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuksetCtrl', [
    '$rootScope', '$scope', '$filter',
    '$location', 'HakemuskausiService',
    '$routeParams', 'StatusService',
    function ($rootScope, $scope, $filter, $location, HakemuskausiService, $routeParams, StatusService) {

    $scope.displayed = [];
    $scope.tyyppi = $routeParams.tyyppi;

    $scope.asetaTyyppi = function (tyyppi) {
      $location.path('/k/hakemukset/' + tyyppi);
    };

    $scope.sallittu = function (oikeus) {
      if (typeof $rootScope.user !== 'undefined') {
        for (var i = 0; i < $rootScope.user.privileges.length; i++) {
          if ($rootScope.user.privileges[i] === oikeus) {
            return true;
          }
        }
        return false;
      }
    };

    $scope.siirryHakemukseen = function (vuosi, tyyppi, hakemusId, maksatusHakemus1Id, maksatusHakemus2Id) {
      $location.path('/k/hakemus/' + vuosi + '/' + tyyppi + '/' + hakemusId + '/' + maksatusHakemus1Id + '/' + maksatusHakemus2Id);
    };

    $scope.siirrySuunnitteluun = function (vuosi, tyyppi, lajitunnus) {
      $location.path('/k/suunnittelu/' + vuosi + '/' + tyyppi + '/' + lajitunnus);
    };

    HakemuskausiService.hae()
      .then(function (hakemuskaudet) {

        $scope.hakemukset = _(hakemuskaudet)
          .filter(hakemuskausi => hakemuskausi.hakemukset.length > 0)
          .map(luoLajitunnusLajittelija($rootScope.organisaatiot, $scope.tyyppi))
          .sortBy('vuosi').reverse().value();

        if ($scope.hakemukset.length > 0) {
          $scope.hakemukset[0].accordionOpen = true;
        }

        $scope.kasiteltavatAvustushakemukset = laskeLukumaara('AH0', hakemuskaudet);
        $scope.kasiteltavatMaksatus1hakemukset = laskeLukumaara('MH1', hakemuskaudet);
        $scope.kasiteltavatMaksatus2hakemukset = laskeLukumaara('MH2', hakemuskaudet);

      }, function (err) {
        StatusService.virhe('OrganisaatioService.hae(): ' + err.message);
      });

  }]);

