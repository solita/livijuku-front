'use strict';

var _ = require('lodash');
var angular = require('angular');
var pdf = require('utils/pdfurl');
var hasPermission = require('utils/hasPermission');
var Promise = require('bluebird');

function haeHakemus(tyyppi, hakemus) {
  if(hakemus.hakemustyyppitunnus === tyyppi) {
    return hakemus;
  }

  return _.findWhere(hakemus['other-hakemukset'], {
    hakemustyyppitunnus: tyyppi
  });
}

loadInitialData.$inject = ['CommonService', '$stateParams', 'AvustuskohdeService', 'HakemusService', 'KayttajaService', 'PaatosService'];

function loadInitialData(common, $stateParams, AvustuskohdeService, HakemusService, KayttajaService, PaatosService) {
  function haeAvustuskohteet(hakemusid) {
    return AvustuskohdeService.hae(hakemusid).then((data) => {
      return _.map(
        common.partitionBy(v => v.avustuskohdeluokkatunnus, data),
        (kohteet) => ({
          avustuskohteet: kohteet,
          tunnus: (_.first(kohteet).avustuskohdeluokkatunnus)
        }));
    });
  }

  const hakemusId = $stateParams.id;
  const hakemusPromise = HakemusService.hae(hakemusId);

  return Promise.props({
    hakemus: hakemusPromise,
    user: KayttajaService.hae(),
    paatos: PaatosService.hae(hakemusId),
    avustuskohdeluokat: haeAvustuskohteet(hakemusId),
    avustushakemusArvot: hakemusPromise.then((hakemus) => {
      if(['MH1', 'MH2'].indexOf(hakemus.hakemustyyppitunnus)) {
        return haeAvustuskohteet(hakemusId);
      }
    }),
    ajankohta: hakemusPromise.then((hakemus) => {
      const ajankohdat = {
        MH1: '1.1.-30.6.',
        MH2: '1.7.-31.12.'
      };
      return ajankohdat[hakemus.hakemustyyppitunnus];
    }),
    maksatushakemusArvot: hakemusPromise.then((hakemus) => {
      const id = haeHakemus('MH1', hakemus).id;
      return haeAvustuskohteet(id);
    }),
    maksatushakemus1Paatos: hakemusPromise.then((hakemus) => {
      const id = haeHakemus('MH1', hakemus).id;
      return PaatosService.hae(id);
    })
  });
}

module.exports.loadInitialData = loadInitialData;
angular.module('jukufrontApp')
  .controller('HakemusCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
    'PaatosService', 'HakemusService', 'AvustuskohdeService', 'StatusService', 'CommonService', '$window', 'initials',
    function ($rootScope, $scope, $state, $stateParams, PaatosService, HakemusService, AvustuskohdeService, StatusService, common, $window, initials) {

      _.extend($scope, initials);

      function bindToScope(key) {
        return (value) => {
          $scope[key] = value;
        };
      }

      $scope.isHakija = function isHakija(user) {
        return hasPermission(user, 'modify-oma-hakemus');
      };

      $scope.hasPermission = hasPermission;
      $scope.allekirjoitusliitetty = false;
      $scope.hakemusid = parseInt($stateParams.id, 10);
      $scope.alv = false;

      $scope.backToList = function backToList() {
        if($scope.isHakija($scope.user)) {
          return $state.go('app.hakija.hakemukset.omat');
        }
        $state.go('app.yhteinen.hakemukset.list', {
          tyyppi: $scope.hakemus.hakemustyyppitunnus
        });
      };

      $scope.isTabSelected = function isTabSelected(tyyppi) {
        return $scope.hakemus.hakemustyyppitunnus === tyyppi;
      };

      $scope.toApplication = function toApplication(tyyppi) {
        const hakemus = haeHakemus(tyyppi, $scope.hakemus);

        $state.go('app.hakemus', {
          id: hakemus.id
        });
      };

      $scope.canEdit = function canEdit() {
        return $scope.hakemusKeskenerainen() && $scope.isHakija($scope.user);
      };

      $scope.getHakija = function getHakija(hakemus) {
        return _.find($rootScope.organisaatiot, {id: hakemus.organisaatioid}).nimi;
      };


      function haeVertailuArvo(data, avustuskohdeluokka, avustuskohdelaji, arvo) {
        return parseFloat((_.find(_.find(data, {'tunnus': avustuskohdeluokka}).avustuskohteet, {
          'avustuskohdeluokkatunnus': avustuskohdeluokka,
          'avustuskohdelajitunnus': avustuskohdelaji
        }))[arvo]);
      }

      function lahetaHakemus() {
        HakemusService.lahetaHakemus($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.lahetaHakemus(' + $scope.hakemusid + ')', 'Lähettäminen onnistui.');
            $state.go('app.hakija.hakemukset.omat');
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.lahetaHakemus(' + $scope.hakemusid + ')', data.message);
          });
      }

      function lahetaTaydennys() {
        HakemusService.lahetaTaydennys($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.lahetaTaydennys(' + $scope.hakemusid + ')', 'Täydennyksen lähettäminen onnistui.');
            $state.go('app.hakija.hakemukset.omat');
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.lahetaTaydennys(' + $scope.hakemusid + ')', data.message);
          });
      }

      $scope.haePaatosPdf = function () {
        return pdf.getPaatosPdfUrl($scope.hakemusid);
      };

      $scope.haeHakemusPdf = function () {
        return pdf.getHakemusPdfUrl($scope.hakemusid);
      };

      $scope.haeAvustushakemusPaatosPdf = function () {
        return pdf.getPaatosPdfUrl($scope.hakemusid);
      };

      $scope.haeMaksatushakemus1PaatosPdf = function () {
        return pdf.getPaatosPdfUrl(haeHakemus('MH1', $scope.hakemus).id);
      };

      $scope.haeAvustusProsentti = function (luokka, laji) {
        return AvustuskohdeService.avustusprosentti($scope.hakemus.vuosi, luokka, laji);
      };

      $scope.haeVertailuarvot = function (avustuskohdeluokka, avustuskohdelaji) {
        var avustushakemusHaettavaAvustus = 0;
        var avustushakemusOmaRahoitus = 0;
        var maksatushakemusHaettavaAvustus = 0;
        var maksatushakemusOmaRahoitus = 0;
        if($scope.hakemus.hakemustyyppitunnus !== 'AH0' && (typeof $scope.avustushakemusArvot) !== 'undefined') {
          avustushakemusHaettavaAvustus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'haettavaavustus');
          avustushakemusOmaRahoitus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'omarahoitus');
        }
        if($scope.hakemus.hakemustyyppitunnus === 'MH2' && (typeof $scope.maksatushakemusArvot) !== 'undefined') {
          maksatushakemusHaettavaAvustus = haeVertailuArvo($scope.maksatushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'haettavaavustus');
          maksatushakemusOmaRahoitus = haeVertailuArvo($scope.maksatushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'omarahoitus');
        }
        return {
          'avustushakemusHaettavaAvustus': avustushakemusHaettavaAvustus,
          'avustushakemusOmaRahoitus': avustushakemusOmaRahoitus,
          'maksatushakemusHaettavaAvustus': maksatushakemusHaettavaAvustus,
          'maksatushakemusOmaRahoitus': maksatushakemusOmaRahoitus
        };
      };

      $scope.haettuSummaYliMyonnetyn = function () {
        return $scope.sumHaettavaAvustus() > $scope.myonnettyAvustusPerJakso();
      };

      $scope.hakemusKeskenerainen = function () {
        return ($scope.hakemus.hakemustilatunnus === 'K' || $scope.hakemus.hakemustilatunnus === 'T0');
      };

      $scope.hakemusTaydennettavana = function () {
        return ($scope.hakemus.hakemustilatunnus === 'T0');
      };

      $scope.hakemusVireilla = function () {
        return ($scope.hakemus.hakemustilatunnus === 'V' || $scope.hakemus.hakemustilatunnus === 'TV');
      };

      $scope.hasPaatos = function (hakemustilatunnus) {
        return hakemustilatunnus === 'P' || hakemustilatunnus === 'M';
      };

      $scope.maksatushakemus1PaatosOlemassa = function () {
        return ($scope.maksatushakemus1Paatos && $scope.maksatushakemus1Paatos.voimaantuloaika);
      };

      $scope.maksatushakemus1PaatosMaksettu = function () {
        return $scope.maksatushakemus1Paatos.myonnettyavustus;
      };

      $scope.myonnettyAvustusPerJakso = function () {
        if($scope.hakemus.hakemustyyppitunnus === 'MH1') {
          return ($scope.paatos.myonnettyavustus / 2);
        }
        if($scope.hakemus.hakemustyyppitunnus === 'MH2') {
          return $scope.paatos.myonnettyavustus - $scope.maksatushakemus1Paatos.myonnettyavustus;
        }
      };

      $scope.myonnettyAvustusPerVuosi = function () {
        return $scope.paatos.myonnettyavustus;
      };

      $scope.naytaHakemus = function (tila) {
        if(tila === 'K' || tila === 'T0') {
          $scope.tallennaHakemus(1);
        } else {
          $window.open(pdf.getHakemusPdfUrl($scope.hakemusid));
        }
      };

      $scope.onAvustushakemus = function () {
        return $scope.hakemus.hakemustyyppitunnus === 'AH0';
      };

      $scope.onMaksatushakemus1 = function () {
        return $scope.hakemus.hakemustyyppitunnus === 'MH1';
      };

      $scope.onMaksatushakemus2 = function () {
        return $scope.hakemus.hakemustyyppitunnus === 'MH2';
      };

      $scope.avustushakemusPaatosOlemassa = function () {
        return $scope.paatos && $scope.paatos.voimaantuloaika;
      };

      $scope.edellinenHakemusPaatetty = function () {
        if($scope.onAvustushakemus()) {
          return true;
        }
        return $scope.avustushakemusPaatosOlemassa();
      };

      $scope.taydennyspyyntoSeliteOlemassa = function () {
        return $scope.hakemus.taydennyspyynto;
      };

      $scope.haeLajitunnus = function(organisaatioid) {
        return _.find($rootScope.organisaatiot, {'id': organisaatioid}).lajitunnus;
      };

      $scope.sumHaettavaAvustus = function () {
        var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
          return l.avustuskohteet;
        }));
        return _.sum(avustuskohteet, 'haettavaavustus');
      };

      function validiHakemus() {
        return ($scope.hakemusForm.$valid && $scope.onAvustushakemus()) ||
               (($scope.onMaksatushakemus1() || $scope.onMaksatushakemus2()) &&
                $scope.hakemusForm.$valid && !$scope.haettuSummaYliMyonnetyn());
      }

      $scope.tallennaHakemus = function (lisatoiminto) {
        StatusService.tyhjenna();
        $scope.$broadcast('show-errors-check-validity');

        if(!validiHakemus()) {
          $scope.$emit('focus-invalid');
          StatusService.virhe('AvustuskohdeService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
          return;
        }

        if(lisatoiminto === 1) {
          var ikkuna = $window.open('about:blank', '_blank');
        }
        var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
          return l.avustuskohteet;
        }));

        avustuskohteet = _.map(avustuskohteet, function (kohde) {
          return _.omit(kohde, 'alv');
        });

        AvustuskohdeService.tallenna(avustuskohteet)
        .success(function () {
          var tallennusOk = true;

          if($scope.hakemus.selite) {
            var selitedata = {
              'selite': $scope.hakemus.selite,
              'hakemusid': $scope.hakemusid
            };
            HakemusService.tallennaSelite(selitedata)
              .success(function () {
              })
              .error(function (data) {
                StatusService.virhe('HakemusService.tallennaSelite(' + selitedata + ')', data.message);
                tallennusOk = false;
              });
          }

          if(tallennusOk) {
            StatusService.ok('AvustuskohdeService.tallenna()', 'Tallennus onnistui.');
            $scope.hakemusForm.$setPristine();

            HakemusService.hae($scope.hakemusid)
              .then(bindToScope('hakemus'));

            switch (lisatoiminto) {
              case 0:
                // Pelkka tallennus
                break;
              case 1:
                // Esikatselu
                ikkuna.location.href = pdf.getHakemusPdfUrl($scope.hakemusid);
                break;
              case 2:
                // Laheta
                if($scope.hakemus.hakemustilatunnus === 'K') {
                  lahetaHakemus();
                } else if($scope.hakemus.hakemustilatunnus === 'T0') {
                  lahetaTaydennys();
                }
                break;
            }
          }
        })
        .error(function (data) {
          StatusService.virhe('AvustuskohdeService.tallenna()', data.message);
        });

      };

      $scope.tarkastaHakemus = function () {
        HakemusService.tarkastaHakemus($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.tarkastaHakemus(' + $scope.hakemusid + ')', 'Hakemus päivitettiin tarkastetuksi.');
            $state.go('app.yhteinen.hakemukset.list', {tyyppi: $scope.hakemus.hakemustyyppitunnus});
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.tarkastaHakemus(' + $scope.hakemusid + ')', data.message);
          });
      };

      $scope.tarkastaTaydennys = function () {
        HakemusService.tarkastaTaydennys($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.tarkastaTaydennys(' + $scope.hakemusid + ')', 'Täydennetty hakemus päivitettiin tarkastetuksi.');
            $state.go('app.yhteinen.hakemukset.list', {tyyppi: $scope.hakemus.hakemustyyppitunnus});
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.tarkastaTaydennys(' + $scope.hakemusid + ')', data.message);
          });
      };

      $window.scrollTo(0, 0);
    }
  ]);
