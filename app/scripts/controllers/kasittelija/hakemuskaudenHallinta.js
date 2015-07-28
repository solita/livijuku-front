'use strict';

var _ = require('lodash');
var angular = require('angular');
var pdf = require('utils/pdf');

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuskaudenHallintaCtrl', ['$scope', '$location', '$route', '$log', 'HakemuskausiService', 'StatusService', 'Upload', function ($scope, $location, $route, $log, HakemuskausiService, StatusService, Upload) {

    function epochToISOString(epoch) {
      return toISODateString(new Date(epoch));
    }

    function haeHakemuskaudet() {
      HakemuskausiService.haeSummary()
        .success(function (data) {
          var hakemuskaudetTmp = [];
          var nykyhetki = Number(new Date());

          _(angular.fromJson(data)).forEach(function (hakemuskausi) {
            var hakemus_ah0 = _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'});
            var hakemus_mh1 = _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH1'});
            var hakemus_mh2 = _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH2'});

            var processedHakemuskausi = {
              vuosi: hakemuskausi.vuosi,
              tilatunnus: hakemuskausi.tilatunnus,
              avustushakemusKaynnissa: nykyhetki > Number(new Date(hakemus_ah0.hakuaika.alkupvm)),
              avustushakemusAlkupvm: new Date(hakemus_ah0.hakuaika.alkupvm),
              avustushakemusAlkupvmKalenteri: false,
              avustushakemusLoppupvm: new Date(hakemus_ah0.hakuaika.loppupvm),
              avustushakemusLoppupvmKalenteri: false,
              maksatushakemus1Kaynnissa: nykyhetki > Number(new Date(hakemus_mh1.hakuaika.alkupvm)),
              maksatushakemus1Alkupvm: new Date(hakemus_mh1.hakuaika.alkupvm),
              maksatushakemus1AlkupvmKalenteri: false,
              maksatushakemus1Loppupvm: new Date(hakemus_mh1.hakuaika.loppupvm),
              maksatushakemus1LoppupvmKalenteri: false,
              maksatushakemus2Kaynnissa: nykyhetki > Number(new Date(hakemus_mh2.hakuaika.alkupvm)),
              maksatushakemus2Alkupvm: new Date(hakemus_mh2.hakuaika.alkupvm),
              maksatushakemus2AlkupvmKalenteri: false,
              maksatushakemus2Loppupvm: new Date(hakemus_mh2.hakuaika.loppupvm),
              maksatushakemus2LoppupvmKalenteri: false,

              ah0: processHakemus(hakemus_ah0),
              mh1: processHakemus(hakemus_mh1),
              mh2: processHakemus(hakemus_mh2)
            };

            if (hakemuskausi.tilatunnus == "A" || hakemuskausi.tilatunnus == "0") {
              processedHakemuskausi.uusi = true;
            } else {
              processedHakemuskausi.uusi = false;
            }

            if (hakemuskausi.hakuohje_contenttype != null) {
              processedHakemuskausi.hakuohjeLadattu = true;
            } else {
              processedHakemuskausi.hakuohjeLadattu = false;
            }

            hakemuskaudetTmp.push(processedHakemuskausi);
          }).value();

          $scope.hakemuskaudet = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
          $scope.muokkaaHakuaikojaVuosi = null;
        })
        .error(function (data) {
          StatusService.virhe('HakemuskausiService.haeSummary()', data.message);
        });
    }

    function processHakemus(hakemus) {
      var oletukset = {
        K: 0, V: 0, T: 0, T0: 0, TV: 0, P: 0, M: 0
      };

      var existing_tilat = _.mapValues(
        _.indexBy(hakemus.hakemustilat, 'hakemustilatunnus'), function (o) {
          return o.count;
        });
      var all_tilat = _.merge(oletukset, existing_tilat);

      return {
        tilat: all_tilat,
        total: (_.reduce(_.values(all_tilat), function (sum, n) {
          return sum + n;
        })),
        kaynnissa: (Date.now() > (new Date(hakemus.hakuaika.alkupvm)).valueOf())
      }
    }

    function toISODateString(date) {
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }


    $scope.dateOptions = {
      formatYear: 'yyyy',
      startingDay: 1,
      formatMonth: 'MM'
    };

    $scope.ennenLoppuPvm = function (alkupvm, loppupvm) {
      var alku_ts = 0;
      var loppu_ts = 0;
      if (typeof alkupvm === 'undefined' || typeof loppupvm === 'undefined') return false;
      if (typeof alkupvm === 'string') {
        alku_ts = Date.parse(alkupvm);
      } else {
        alku_ts = Number(alkupvm);
      }
      if (typeof loppupvm === 'string') {
        loppu_ts = Date.parse(loppupvm);
      } else {
        loppu_ts = Number(loppupvm);
      }
      return (alku_ts < loppu_ts);
    };

    $scope.getHakuohjePdf = function (vuosi) {
      return pdf.getHakuohjePdfUrl(vuosi);
    };

    $scope.loppuPvmMenneisyydessa = function (loppupvm) {
      var loppu_ts = 0;
      var nykyhetki = Number(new Date());
      if (typeof loppupvm === 'undefined') return false;
      if (typeof loppupvm === 'string') {
        loppu_ts = Date.parse(loppupvm);
      } else {
        loppu_ts = Number(loppupvm);
      }
      return (nykyhetki > loppu_ts);
    };

    $scope.luoUusiHakemuskausi = function (vuosi) {
      HakemuskausiService.luoUusi(vuosi)
        .success(function () {
          StatusService.ok('HakemuskausiService.luoUusi(' + vuosi + ')', 'Hakemuskausi: ' + vuosi + ' luonti onnistui.');
          haeHakemuskaudet();
        })
        .error(function (data) {
          StatusService.virhe('HakemuskausiService.luoUusi(' + vuosi + ')', data.type+':'+data.message);
        });
    };

    $scope.avaaKalenteri = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    };

    $scope.asetaMuokkaaHakuaikojaVuosi = function (vuosi) {
      $scope.muokkaaHakuaikojaVuosi = vuosi;
    };

    $scope.hakemuskausiAvoin = function(hakemuskausi){
      if (typeof hakemuskausi === 'undefined') return false;
      return hakemuskausi.tilatunnus=='A';
    };

    $scope.hakemuskausiKaynnistetty = function(hakemuskausi){
      if (typeof hakemuskausi === 'undefined') return false;
      return hakemuskausi.tilatunnus=='K';
    };

    $scope.tallennaHakuajat = function (formi, vuosi, ah0alkupvm, ah0loppupvm, mh1alkupvm, mh1loppupvm, mh2alkupvm, mh2loppupvm) {
      StatusService.tyhjenna();
      $scope.$broadcast('show-errors-check-validity');
      if (formi.$valid) {
        var hakuajat = [
          {
            hakemustyyppitunnus: "AH0",
            alkupvm: epochToISOString(ah0alkupvm),
            loppupvm: epochToISOString(ah0loppupvm)
          },
          {
            hakemustyyppitunnus: "MH1",
            alkupvm: epochToISOString(mh1alkupvm),
            loppupvm: epochToISOString(mh1loppupvm)
          },
          {
            hakemustyyppitunnus: "MH2",
            alkupvm: epochToISOString(mh2alkupvm),
            loppupvm: epochToISOString(mh2loppupvm)
          }
        ];

        HakemuskausiService.saveHakuajat(vuosi, hakuajat)
          .success(function () {
            StatusService.ok('HakemuskausiService.saveHakuajat(' + vuosi + ')', 'Hakuaikojen: tallennus vuodelle ' + vuosi + ' onnistui.');
            $scope.muokkaaHakuaikojaVuosi = null;
            haeHakemuskaudet();
          })
          .error(function (data) {
            StatusService.virhe('HakemuskausiService.saveHakuajat(' + vuosi + ')', data.message);
          });
      } else {
        StatusService.virhe('HakemuskausiService.saveHakuajat()', 'Korjaa lomakkeen virheet ennen tallentamista.');
      }
    };

    $scope.valitseHakemustyyppi = function (tyyppi) {

      if ($scope.muokkaaHakuaikojaVuosi != null) {
        // Päivämäärien muokkaus menossa, ei navigoida "Kaikki hakemukset" -välilehdelle.
        return;
      }

      if (tyyppi) {
        $location.path('/y/hakemukset/' + tyyppi);
      } else {
        $location.path('/k/hakemukset');
      }
    };

    $scope.upload = function (tiedostot, vuosi) {
      console.log('Upload:vuosi:' + vuosi + ' length:' + tiedostot.length);
      if (tiedostot != null && tiedostot.length > 0) {
        console.log('Ladataan tiedosto:', tiedostot);
        console.log(JSON.stringify(tiedostot[0]));
        Upload.upload({
          url: 'api/hakemuskausi/' + vuosi + '/hakuohje',
          file: tiedostot[0],
          method: 'PUT',
          fields: {myObj: $scope.myModelObj},
          fileFormDataName: 'hakuohje'
        }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          console.log('Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' onnistui. Paluuarvo: ' + data);
          StatusService.ok('Hakuohjeen lataus: ' + config.file.name + ' vuodelle:' + vuosi, 'Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' onnistui.');
          haeHakemuskaudet();
        }).error(function (data, status, headers, config) {
          console.log('Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' epäonnistui. Paluuarvo: ' + data);
          StatusService.virhe('Hakuohjeen lataus: ' + config.file.name + ' vuodelle:' + vuosi, 'Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' epäonnistui:' + data.message);
        });
      }
    };

    haeHakemuskaudet();
  }
  ]);

