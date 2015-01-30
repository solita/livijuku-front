'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuksetCtrl', ['$rootScope', '$scope', '$filter', '$location', 'HakemuskausiService', 'StatusService', function ($rootScope, $scope, $filter, $location, HakemuskausiService, StatusService) {
    $scope.displayed = [];
    HakemuskausiService.hae()
      .success(function (data) {
        $scope.kaikkiHakemukset = data;
        var hakemuskaudetTmp = [];
        _(angular.fromJson(data)).forEach(function (hakemuskausi) {
          var ks1AvustushakemuksetPerVuosi = [];
          var ks2AvustushakemuksetPerVuosi = [];
          var elyAvustushakemuksetPerVuosi = [];
          var organisaatiolajitunnus = "";
          _.filter(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).forEach(function (hakemus) {
            organisaatiolajitunnus = _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).lajitunnus;
            if (organisaatiolajitunnus == "KS1") {
              ks1AvustushakemuksetPerVuosi.push({
                'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                'hakemuksenTila': hakemus.hakemustilatunnus,
                'viimeisinMuutos': Number(new Date(hakemus.muokkausaika)),
                'diaarinumero': hakemus.diaarinumero,
                'kasittelija': 'Ei määritelty',
                'id': hakemus.id
              });
            } else if (organisaatiolajitunnus == "KS2") {
              ks2AvustushakemuksetPerVuosi.push({
                'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                'hakemuksenTila': hakemus.hakemustilatunnus,
                'viimeisinMuutos': Number(new Date(hakemus.muokkausaika)),
                'diaarinumero': hakemus.diaarinumero,
                'kasittelija': 'Ei määritelty',
                'id': hakemus.id
              });
            } else if (organisaatiolajitunnus == "ELY") {
              elyAvustushakemuksetPerVuosi.push({
                'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                'hakemuksenTila': hakemus.hakemustilatunnus,
                'viimeisinMuutos': Number(new Date(hakemus.muokkausaika)),
                'diaarinumero': hakemus.diaarinumero,
                'kasittelija': 'Ei määritelty',
                'id': hakemus.id
              });
            }
          });
          hakemuskaudetTmp.push({
            'vuosi': hakemuskausi.vuosi,
            'ks1AvustushakemuksetPerVuosi': ks1AvustushakemuksetPerVuosi,
            'ks2AvustushakemuksetPerVuosi': ks2AvustushakemuksetPerVuosi,
            'elyAvustushakemuksetPerVuosi': elyAvustushakemuksetPerVuosi,
            'accordionOpen': false
          });
        });
        $scope.avustushakemukset = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
        if ($scope.avustushakemukset.length > 0) {
          $scope.avustushakemukset[0].accordionOpen = true;
        }
      })
      .error(function (data) {
        StatusService.virhe('OrganisaatioService.hae(): ' + data);
      });

    $scope.siirryHakemukseen = function (hakemusId) {
      $location.path('/k/hakemus/' + hakemusId);
    };
    $scope.siirrySuunnitteluun = function (vuosi, tyyppi, lajitunnus) {
      $location.path('/k/suunnittelu/' + vuosi + '/' + tyyppi + '/' + lajitunnus);
    };
  }
  ]);

