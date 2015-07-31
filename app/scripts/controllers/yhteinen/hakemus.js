'use strict';

var _ = require('lodash');
var $ = require('jquery');
var angular = require('angular');
var pdf = require('utils/pdfurl');

angular.module('jukufrontApp')
  .controller('HakemusCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
    'PaatosService', 'HakemusService', 'AvustuskohdeService', 'StatusService', 'CommonService', '$window',
    function ($rootScope, $scope, $state, $stateParams, PaatosService, HakemusService, AvustuskohdeService, StatusService, common, $window) {

      function haeAvustuskohteet(hakemusid, scopemuuttuja) {
        common.bindPromiseToScope(AvustuskohdeService.hae(hakemusid), $scope, scopemuuttuja,
          function (data) {
            return _.map(
              common.partitionBy(function (v) {
                return v.avustuskohdeluokkatunnus;
              }, data),
              function (kohteet) {
                return {
                  avustuskohteet: kohteet,
                  tunnus: (_.first(kohteet).avustuskohdeluokkatunnus)
                }
              });
          }, 'AvustuskohdeService.hae(' + hakemusid + ')');
      }

      function haeHakemukset() {
        HakemusService.hae($scope.hakemusid)
          .success(function (data) {
            $scope.hakemus = data;
            $scope.hakija = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).nimi;
            $scope.pankkitilinumero = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).pankkitilinumero;
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.hae(' + $scope.hakemusid + ')', data.message);
          });
      }

      function haePaatos() {
        PaatosService.hae($scope.avustushakemusid)
          .success(function (data) {
            $scope.paatos = data;
          })
          .error(function (data) {
            StatusService.virhe('PaatosService.hae(' + $scope.avustushakemusid + ')', data.message);
          });
      }

      function haeMaksatushakemus1Paatos() {
        PaatosService.hae($scope.maksatushakemus1id)
          .success(function (data) {
            $scope.maksatushakemus1Paatos = data;
          })
          .error(function (data) {
            StatusService.virhe('PaatosService.hae(' + $scope.maksatushakemus1id + ')', data.message);
          });
      }

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
            $state.go('app.hakija.hakemukset.list');
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.lahetaHakemus(' + $scope.hakemusid + ')', data.message);
          });
      }

      function lahetaTaydennys() {
        HakemusService.lahetaTaydennys($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.lahetaTaydennys(' + $scope.hakemusid + ')', 'Täydennyksen lähettäminen onnistui.');
            $state.go('app.hakija.hakemukset.list');
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
        return pdf.getPaatosPdfUrl($scope.avustushakemusid);
      };

      $scope.haeMaksatushakemus1PaatosPdf = function () {
        return pdf.getPaatosPdfUrl($scope.maksatushakemus1id);
      };

      $scope.haeAvustusProsentti = function (luokka, laji) {
        return AvustuskohdeService.avustusprosentti($scope.vuosi, luokka, laji);
      };

      $scope.haeVertailuarvot = function (avustuskohdeluokka, avustuskohdelaji) {
        var avustushakemusHaettavaAvustus = 0;
        var avustushakemusOmaRahoitus = 0;
        var maksatushakemusHaettavaAvustus = 0;
        var maksatushakemusOmaRahoitus = 0;
        if ($scope.tyyppi !== "AH0" && (typeof $scope.avustushakemusArvot) !== 'undefined') {
          avustushakemusHaettavaAvustus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'haettavaavustus');
          avustushakemusOmaRahoitus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'omarahoitus');
        }
        if ($scope.tyyppi === "MH2" && (typeof $scope.maksatushakemusArvot) !== 'undefined') {
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
        if (typeof $scope.hakemus === 'undefined') return false;
        return ($scope.hakemus.hakemustilatunnus == 'K' || $scope.hakemus.hakemustilatunnus == 'T0');
      };

      $scope.hakemusTaydennettavana = function () {
        if (typeof $scope.hakemus === 'undefined') return false;
        return ($scope.hakemus.hakemustilatunnus == 'T0');
      };

      $scope.hakemusVireilla = function () {
        if (typeof $scope.hakemus === 'undefined') return false;
        return ($scope.hakemus.hakemustilatunnus == 'V' || $scope.hakemus.hakemustilatunnus == 'TV');
      };

      $scope.hasPaatos = function (hakemustilatunnus) {
        return hakemustilatunnus == 'P' || hakemustilatunnus == 'M';
      };

      $scope.maksatushakemus1PaatosOlemassa = function () {
        return ($scope.maksatushakemus1Paatos != null && $scope.maksatushakemus1Paatos.voimaantuloaika != null);
      };

      $scope.maksatushakemus1PaatosMaksettu = function () {
        if (typeof $scope.maksatushakemus1Paatos !== 'undefined') return $scope.maksatushakemus1Paatos.myonnettyavustus;
      };

      $scope.myonnettyAvustusPerJakso = function () {
        if (typeof $scope.paatos === 'undefined') return false;
        if ($scope.tyyppi == "MH1") return ($scope.paatos.myonnettyavustus / 2);
        if (typeof $scope.maksatushakemus1Paatos === 'undefined') return false;
        if ($scope.tyyppi == "MH2") return ($scope.paatos.myonnettyavustus - $scope.maksatushakemus1Paatos.myonnettyavustus);
      };

      $scope.myonnettyAvustusPerVuosi = function () {
        if (typeof $scope.paatos === 'undefined') return false;
        return $scope.paatos.myonnettyavustus;
      };

      $scope.naytaHakemus = function (tila) {
        if (tila == 'K' || tila == 'T0') {
          $scope.tallennaHakemus(1);
        } else {
          $window.open(pdf.getHakemusPdfUrl($scope.hakemusid));
        }
      };

      $scope.onAvustushakemus = function () {
        return $scope.tyyppi == 'AH0';
      };

      $scope.onMaksatushakemus1 = function () {
        return $scope.tyyppi == 'MH1';
      };

      $scope.onMaksatushakemus2 = function () {
        return $scope.tyyppi == 'MH2';
      };

      $scope.avustushakemusPaatosOlemassa = function () {
        return ($scope.paatos != null && $scope.paatos.voimaantuloaika != null);
      };

      $scope.edellinenHakemusPaatetty = function () {
        if ($scope.onAvustushakemus()) return true;
        else return $scope.avustushakemusPaatosOlemassa();
      };

      $scope.seliteOlemassa = function (hakemus) {
        if (typeof hakemus === 'undefined') return false;
        return hakemus.selite != null;
      };

      $scope.taydennyspyyntoSeliteOlemassa = function () {
        if (typeof $scope.hakemus === 'undefined') return false;
        return $scope.hakemus.taydennyspyynto != null;
      };

      $scope.haeLajitunnus = function(organisaatioid){
        return _.find($rootScope.organisaatiot, {'id': organisaatioid}).lajitunnus;
      };

      $scope.sumHaettavaAvustus = function () {
        var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
          return l.avustuskohteet;
        }));
        return _.sum(avustuskohteet, 'haettavaavustus');
      };

      $scope.tallennaHakemus = function (lisatoiminto) {
        StatusService.tyhjenna();
        $scope.$broadcast('show-errors-check-validity');

        if (($scope.hakemusForm.$valid && $scope.onAvustushakemus()) || (($scope.onMaksatushakemus1() || $scope.onMaksatushakemus2()) && $scope.hakemusForm.$valid && !$scope.haettuSummaYliMyonnetyn())) {
          if (lisatoiminto === 1) var ikkuna = $window.open('about:blank', '_blank');
          var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
            return l.avustuskohteet;
          }));

          avustuskohteet = _.map(avustuskohteet, function (kohde) {
            return _.omit(kohde, 'alv');
          });

          AvustuskohdeService.tallenna(avustuskohteet)
            .success(function () {
              var tallennusOk = true;
              if ($scope.hakemus.selite !== null) {
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
              if (tallennusOk) {
                StatusService.ok('AvustuskohdeService.tallenna()', 'Tallennus onnistui.');
                $scope.hakemusForm.$setPristine();
                haeHakemukset();
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
                    if ($scope.hakemus.hakemustilatunnus == 'K') {
                      lahetaHakemus();
                    } else if ($scope.hakemus.hakemustilatunnus == 'T0') {
                      lahetaTaydennys();
                    }
                    break;
                }
              }
            })
            .error(function (data) {
              StatusService.virhe('AvustuskohdeService.tallenna()', data.message);
            });
        } else {
          $('input.ng-invalid').eq(0).focus();
          StatusService.virhe('AvustuskohdeService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
        }
      };

      $scope.tarkastaHakemus = function () {
        HakemusService.tarkastaHakemus($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.tarkastaHakemus(' + $scope.hakemusid + ')', 'Hakemus päivitettiin tarkastetuksi.');
            $state.go('app.yhteinen.hakemukset.list', {tyyppi: $scope.tyyppi});
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.tarkastaHakemus(' + $scope.hakemusid + ')', data.message);
          });
      };

      $scope.tarkastaTaydennys = function () {
        HakemusService.tarkastaTaydennys($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.tarkastaTaydennys(' + $scope.hakemusid + ')', 'Täydennetty hakemus päivitettiin tarkastetuksi.');
            $state.go('app.yhteinen.hakemukset.list', {tyyppi: $scope.tyyppi});
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.tarkastaTaydennys(' + $scope.hakemusid + ')', data.message);
          });
      };

      $scope.allekirjoitusliitetty = false;
      $scope.avustushakemusid = $stateParams.id;
      $scope.maksatushakemus1id = $stateParams.m1id;
      $scope.maksatushakemus2id = $stateParams.m2id;
      $scope.tyyppi = $stateParams.tyyppi;
      $scope.vuosi = $stateParams.vuosi;
      $scope.alv = false;

      if ($scope.tyyppi === "AH0") {
        $scope.hakemusid = parseInt($scope.avustushakemusid);
      } else if ($scope.tyyppi == "MH1") {
        $scope.hakemusid = parseInt($scope.maksatushakemus1id);
        $scope.ajankohta = '1.1.-30.6.';
        haeAvustuskohteet($scope.avustushakemusid, "avustushakemusArvot");
      } else if ($scope.tyyppi == "MH2") {
        $scope.hakemusid = parseInt($scope.maksatushakemus2id);
        $scope.ajankohta = '1.7.-31.12.';
        haeAvustuskohteet($scope.avustushakemusid, "avustushakemusArvot");
        haeAvustuskohteet($scope.maksatushakemus1id, "maksatushakemusArvot");
        haeMaksatushakemus1Paatos();
      }

      haeHakemukset();
      haeAvustuskohteet($scope.hakemusid, "avustuskohdeluokat");
      haePaatos();
      $window.scrollTo(0, 0);
    }
  ]);
