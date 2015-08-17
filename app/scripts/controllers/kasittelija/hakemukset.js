'use strict';

var _ = require('lodash');
var angular = require('angular');

function haeOrganisaatio(id, organisaatiot) {
  return _.findWhere(organisaatiot, {id});
}

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuksetCtrl', [
    '$rootScope',
    'HakemuskausiService',
    '$stateParams',
    'StatusService',
    'OrganisaatioService',
    '$q',
    '$state',
    function ($rootScope, HakemuskausiService, $stateParams, StatusService, OrganisaatioService, $q, $state) {

      this.displayed = [];
      this.tyyppi = $stateParams.tyyppi;
      this.hakemuskaudet = [];

      this.sallittu = function (oikeus) {
        if (typeof $rootScope.user !== 'undefined') {
          for (var i = 0; i < $rootScope.user.privileges.length; i++) {
            if ($rootScope.user.privileges[i] === oikeus) {
              return true;
            }
          }
          return false;
        }
      };


      this.hakijanNimi = (hakemus) => {
        return haeOrganisaatio(hakemus.organisaatioid, this.organisaatiot).nimi;
      };

      this.hakijatyypinHakemukset = function hakijatyypinHakemukset(hakijatyyppi, hakemuskausi) {
        return _(hakemuskausi.hakemukset).filter((hakemus) => {
          const organisaatio = haeOrganisaatio(hakemus.organisaatioid, this.organisaatiot);
          return hakijatyyppi === organisaatio.lajitunnus && this.tyyppi === hakemus.hakemustyyppitunnus;
        }).value();
      };

      this.hakemuksiaYhteensa = function hakemuksiaYhteensa(tyyppi, hakemuskaudet) {
        return _.reduce(hakemuskaudet, function (sum, hakemuskausi) {
          return sum + _.filter(hakemuskausi.hakemukset, hakemus =>
              ['V', 'TV'].indexOf(hakemus.hakemustilatunnus) > -1 && hakemus.hakemustyyppitunnus === tyyppi
            ).length;
        }, 0);
      };

      this.hakemustyypinId = function hakemustyypinId(tyyppi, hakemus, hakemukset) {
        if (hakemus.hakemustyyppitunnus === tyyppi) {
          return hakemus.id;
        }

        return _.findWhere(hakemukset, {
          organisaatioid: hakemus.organisaatioid,
          hakemustyyppitunnus: tyyppi
        }).id;
      };

      this.siirryHakemukseen = function siirryHakemukseen(hakemus, hakemuskausi, hakijatyyppi) {
        if (hakijatyyppi === 'ELY') {
          $state.go('app.hakija.hakemukset.elyhakemus', {
            vuosi: hakemuskausi.vuosi,
            id: this.hakemustyypinId('AH0', hakemus, hakemuskausi.hakemukset)
          });
          return;
        }

        var isOwn = $rootScope.user.organisaatioid === hakemus.organisaatioid;

        $state.go(isOwn ? 'app.hakija.hakemukset.hakemus' : 'app.kasittelija.hakemukset.hakemus', {
          vuosi: hakemuskausi.vuosi,
          id: this.hakemustyypinId('AH0', hakemus, hakemuskausi.hakemukset),
          m1id: this.hakemustyypinId('MH1', hakemus, hakemuskausi.hakemukset),
          m2id: this.hakemustyypinId('MH2', hakemus, hakemuskausi.hakemukset),
          tyyppi: this.tyyppi
        });
      };

      $q.all([
        HakemuskausiService.hae(),
        OrganisaatioService.hae()
      ])
        .then(([hakemuskaudet, organisaatiot]) => {
          this.organisaatiot = organisaatiot;

          this.hakemuskaudet = _(hakemuskaudet)
            .filter(hakemuskausi => hakemuskausi.hakemukset.length > 0)
            .sortBy('vuosi').reverse().value();

          /*
           * Cachetusta smart tablea varten
           * {
           2011: {
           ELY: [hakemus]
           KS1: [hakemus]
           KS2: [hakemus]
           },
           2012: ...
           * }
           */

          this.hakemukset = _(this.hakemuskaudet).map((hakemuskausi) => {
            var hakijatyypit = _.zipObject($rootScope.constants.hakijaTyypit.map((tyyppi) => {
              return [tyyppi, this.hakijatyypinHakemukset(tyyppi, hakemuskausi)];
            }));
            return [hakemuskausi.vuosi, hakijatyypit];
          }).zipObject().value();

          this.yearsOpen = _.reduce(this.hakemuskaudet,
            (memo, kausi) => _.set(memo, kausi.vuosi, true), {});

        }, function (err) {
          StatusService.virhe('OrganisaatioService.hae(): ' + err.message);
        });

    }]);
