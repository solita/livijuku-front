'use strict';

var _ = require('lodash');
var angular = require('angular');

function haeOrganisaatio(id, organisaatiot) {
  return _.find(organisaatiot, {id});
}

angular.module('jukufrontApp')
  .controller('KaikkiHakemuksetCtrl', [
    '$rootScope',
    'HakemuskausiService',
    '$stateParams',
    'StatusService',
    'OrganisaatioService',
    '$q',
    '$state',
    '$scope',
    function ($rootScope, HakemuskausiService, $stateParams, StatusService, OrganisaatioService, $q, $state, $scope) {

      function haeHakijatyypinHakemukset(hakijatyyppi, hakemukset, organisaatiot) {
        return _.filter(hakemukset, function (hakemus) {
          var org = haeOrganisaatio(hakemus.organisaatioid, organisaatiot);
          return hakijatyyppi === org.lajitunnus;
        });
      }
      $scope.hakemukset = [];
      $scope.hakemukset.tyyppi = $stateParams.tyyppi;

      $scope.hakemukset.sallittu = function (oikeus) {
        if (typeof $rootScope.user !== 'undefined') {
          for (var i = 0; i < $rootScope.user.privileges.length; i++) {
            if ($rootScope.user.privileges[i] === oikeus) {
              return true;
            }
          }
          return false;
        }
      };

      $scope.hakemukset.hakijanNimi = (hakemus) => {
        return haeOrganisaatio(hakemus.organisaatioid, $scope.hakemukset.organisaatiot).nimi;
      };

      $scope.hakemukset.hakemuksiaYhteensa = function hakemuksiaYhteensa(tyyppi, hakemuskaudet) {
        return _.reduce(hakemuskaudet, function (sum, hakemuskausi) {
          return sum + _.filter(hakemuskausi.hakemukset, hakemus =>
              ['V', 'TV'].indexOf(hakemus.hakemustilatunnus) > -1 && hakemus.hakemustyyppitunnus === tyyppi
            ).length;
        }, 0);
      };

      $scope.isEly = function isEly(tyyppi) {
        return tyyppi === 'ELY';
      };

      $scope.isTabSelected = function isTabSelected(tyyppi) {
        return $scope.hakemukset.tyyppi === tyyppi;
      };

      $scope.hakemukset.hakemustyypinId = function hakemustyypinId(tyyppi, hakemus, hakemukset) {
        if (hakemus.hakemustyyppitunnus === tyyppi) {
          return hakemus.id;
        }

        return _.find(hakemukset, {
          organisaatioid: hakemus.organisaatioid,
          hakemustyyppitunnus: tyyppi
        }).id;
      };

      $scope.hakemukset.siirryHakemukseen = function siirryHakemukseen(hakemus, hakemuskausi, hakijatyyppi) {
        $state.go('app.hakemus', {
          id: hakemus.id
        });
      };

      $q.all([
          HakemuskausiService.hae(),
          OrganisaatioService.hae()
        ])
        .then(([hakemuskaudet, organisaatiot]) => {
          $scope.hakemukset.organisaatiot = organisaatiot;
          $scope.hakemukset.hakemuskaudet = hakemuskaudet;

          var tyyppisuodatettu = [];
          _.forEach(hakemuskaudet, function (hakemuskausi) {
            if (hakemuskausi.hakemukset.length > 0) {
              var hakemuksetHakemustyyppitunnus = _.filter(hakemuskausi.hakemukset, {'hakemustyyppitunnus': $stateParams.tyyppi});
              if (hakemuksetHakemustyyppitunnus.length > 0) {
                var hakijatyypit = {};
                _.forEach($rootScope.constants.hakijaTyypit, function (hakijatyyppi) {
                  var hakijatyypinHakemukset = haeHakijatyypinHakemukset(hakijatyyppi, hakemuksetHakemustyyppitunnus, organisaatiot);
                  if (hakijatyypinHakemukset.length > 0) {
                    hakijatyypit[hakijatyyppi] = hakijatyypinHakemukset;
                  }
                });
                tyyppisuodatettu.push({'vuosi':hakemuskausi.vuosi, 'hakemuskaudenhakemukset':hakijatyypit});
              }
            }
          });
          $scope.hakemukset.hakemukset = _.sortBy(tyyppisuodatettu,'vuosi').reverse();

          $scope.hakemukset.yearsOpen = _.reduce($scope.hakemukset.hakemukset,
            (memo, kausi) => _.set(memo, kausi.vuosi, true), {});

        }, StatusService.errorHandler);

    }]);
