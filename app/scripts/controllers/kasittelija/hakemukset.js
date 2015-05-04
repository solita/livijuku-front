'use strict';

var _ = require('lodash');

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuksetCtrl', ['$rootScope', '$scope', '$filter', '$location', 'HakemuskausiService', '$routeParams', 'StatusService', function ($rootScope, $scope, $filter, $location, HakemuskausiService, $routeParams, StatusService) {

    function haeHakemukset() {
      HakemuskausiService.hae()
        .success(function (data) {
          var hakemuskaudetTmp = [];
          _(angular.fromJson(data)).forEach(function (hakemuskausi) {
            if (hakemuskausi.hakemukset.length > 0) {
              var ks1HakemuksetPerVuosi = [];
              var ks2HakemuksetPerVuosi = [];
              var elyHakemuksetPerVuosi = [];
              var organisaatiolajitunnus = "";
              _.filter(hakemuskausi.hakemukset, {'hakemustyyppitunnus': $scope.tyyppi}).forEach(function (hakemus) {
                organisaatiolajitunnus = _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).lajitunnus;
                if (organisaatiolajitunnus == "KS1") {
                  ks1HakemuksetPerVuosi.push({
                    'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                    'hakemuksenTila': hakemus.hakemustilatunnus,
                    'viimeisinMuutos': Number(new Date(hakemus.muokkausaika)),
                    'diaarinumero': hakemus.diaarinumero,
                    'kasittelija': 'Ei määritelty',
                    'id': hakemus.id,
                    'avustushakemusId': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'AH0')
                    }), 'id'),
                    'maksatushakemus1Id': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'MH1')
                    }), 'id'),
                    'maksatushakemus2Id': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'MH2')
                    }), 'id')
                  });
                } else if (organisaatiolajitunnus == "KS2") {
                  ks2HakemuksetPerVuosi.push({
                    'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                    'hakemuksenTila': hakemus.hakemustilatunnus,
                    'viimeisinMuutos': Number(new Date(hakemus.muokkausaika)),
                    'diaarinumero': hakemus.diaarinumero,
                    'kasittelija': 'Ei määritelty',
                    'id': hakemus.id,
                    'avustushakemusId': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'AH0')
                    }), 'id'),
                    'maksatushakemus1Id': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'MH1')
                    }), 'id'),
                    'maksatushakemus2Id': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'MH2')
                    }), 'id')
                  });
                } else if (organisaatiolajitunnus == "ELY") {
                  elyHakemuksetPerVuosi.push({
                    'hakija': _.find($rootScope.organisaatiot, {'id': hakemus.organisaatioid}).nimi,
                    'hakemuksenTila': hakemus.hakemustilatunnus,
                    'viimeisinMuutos': Number(new Date(hakemus.muokkausaika)),
                    'diaarinumero': hakemus.diaarinumero,
                    'kasittelija': 'Ei määritelty',
                    'id': hakemus.id,
                    'avustushakemusId': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'AH0')
                    }), 'id'),
                    'maksatushakemus1Id': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'MH1')
                    }), 'id'),
                    'maksatushakemus2Id': _.result(_.find(hakemuskausi.hakemukset, function (h) {
                      return (h.organisaatioid == hakemus.organisaatioid && h.hakemustyyppitunnus == 'MH2')
                    }), 'id')
                  });
                }
              });
              hakemuskaudetTmp.push({
                'vuosi': hakemuskausi.vuosi,
                'ks1HakemuksetPerVuosi': _.sortBy(ks1HakemuksetPerVuosi, 'hakija'),
                'ks2HakemuksetPerVuosi': _.sortBy(ks2HakemuksetPerVuosi, 'hakija'),
                'elyHakemuksetPerVuosi': _.sortBy(elyHakemuksetPerVuosi, 'hakija'),
                'accordionOpen': false
              });
            }
          }).value();
          $scope.hakemukset = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
          if ($scope.hakemukset.length > 0) {
            $scope.hakemukset[0].accordionOpen = true;
          }
          $scope.kasiteltavatAvustushakemukset = laskeLukumaara('AH0', data);
          $scope.kasiteltavatMaksatus1hakemukset = laskeLukumaara('MH1', data);
          $scope.kasiteltavatMaksatus2hakemukset = laskeLukumaara('MH2', data);
        })
        .error(function (data) {
          StatusService.virhe('OrganisaatioService.hae(): ' + data);
        });
    }

    function laskeLukumaara(tyyppi, hakemukset) {
      var lukumaara = 0;
      _(angular.fromJson(hakemukset)).forEach(function (hakemuskausi) {
        var hakemuksetPerTyyppiperHakemuskausiVireilla = _.filter(hakemuskausi.hakemukset, {
          'hakemustilatunnus': "V",
          'hakemustyyppitunnus': tyyppi
        });
        var hakemuksetPerTyyppiperHakemuskausiTaydennetty = _.filter(hakemuskausi.hakemukset, {
          'hakemustilatunnus': "TV",
          'hakemustyyppitunnus': tyyppi
        });
        if (hakemuksetPerTyyppiperHakemuskausiVireilla != 'undefined') {
          lukumaara = lukumaara + _.size(hakemuksetPerTyyppiperHakemuskausiVireilla);
        }

        if (hakemuksetPerTyyppiperHakemuskausiTaydennetty != 'undefined') {
          lukumaara = lukumaara + _.size(hakemuksetPerTyyppiperHakemuskausiTaydennetty);
        }
      }).value();
      if (lukumaara == 0) {
        return ''
      } else {
        return lukumaara;
      }
    }

    $scope.displayed = [];
    $scope.tyyppi = $routeParams.tyyppi;

    $scope.asetaTyyppi = function (tyyppi) {
      $location.path('/k/hakemukset/' + tyyppi);
    };

    $scope.sallittu = function (oikeus) {
      if (typeof $rootScope.user !== 'undefined') {
        for (var i = 0; i < $rootScope.user.privileges.length; i++) {
          if ($rootScope.user.privileges[i] == oikeus) {
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

    haeHakemukset();

  }
  ]);

