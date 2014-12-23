'use strict';

angular.module('jukufrontApp')
  .controller('KasHakemuksetCtrl', function ($rootScope, $scope, $filter, $location, HakemuskausiFactory) {
    $scope.displayed = [];
    $scope.haeHakemukset = function () {
      HakemuskausiFactory.hae()
        .success(function (data) {
        $scope.kaikkiHakemukset = data;
        var hakemuskaudetTmp = [];
        _(angular.fromJson(data)).forEach(function (hakemuskausi) {
          var avustushakemuksetPerVuosi = [];
          _.filter(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).forEach(function (hakemus) {
            avustushakemuksetPerVuosi.push({
              'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
              'hakemuksenTila': hakemus.hakemustilatunnus,
              'viimeisinMuutos': Number(new Date(hakemus.muokkausaika)),
              'diaarinumero': hakemus.diaarinumero,
              'kasittelija': 'Ei määritelty',
              'id': hakemus.id
            });
          });
          hakemuskaudetTmp.push({
            'vuosi': hakemuskausi.vuosi,
            'avustushakemukset': avustushakemuksetPerVuosi,
            'accordionOpen': false
          });
        });
        $scope.avustushakemukset = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
        if ($scope.avustushakemukset.length > 0) {
          $scope.avustushakemukset[0].accordionOpen = true;
        }
      })
        .error(function (data) {
          console.log('Virhe: OrganisaatioFactory.hae(): '+data);
      });
    };

    $scope.getKasHakemus = function (hakemusId) {
      $location.path('/k/hakemus/' + hakemusId);
    };
    $scope.getKasSuunnittelu = function (vuosi, tyyppi) {
      $location.path('/k/suunnittelu/' + vuosi + '/' + tyyppi);
    };
    $scope.haeHakemukset();
  }
);

