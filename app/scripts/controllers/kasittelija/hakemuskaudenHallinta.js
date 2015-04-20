'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuskaudenHallintaCtrl', ['$scope', '$location', '$route', '$log', 'HakemuskausiService', 'StatusService', '$upload', function ($scope, $location, $route, $log, HakemuskausiService, StatusService, $upload) {

    function epochToISOString(epoch) {
      return toISODateString(new Date(epoch));
    }

    function haeHakemuskaudet() {
      $scope.ladatutHakuohjeet = [];
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
              avustushakemusAlkupvm: hakemus_ah0.hakuaika.alkupvm,
              avustushakemusAlkupvmKalenteri: false,
              avustushakemusLoppupvm: hakemus_ah0.hakuaika.loppupvm,
              avustushakemusLoppupvmKalenteri: false,
              maksatushakemus1Kaynnissa: nykyhetki > Number(new Date(hakemus_mh1.hakuaika.alkupvm)),
              maksatushakemus1Alkupvm: hakemus_mh1.hakuaika.alkupvm,
              maksatushakemus1AlkupvmKalenteri: false,
              maksatushakemus1Loppupvm: hakemus_mh1.hakuaika.loppupvm,
              maksatushakemus1LoppupvmKalenteri: false,
              maksatushakemus2Kaynnissa: nykyhetki > Number(new Date(hakemus_mh2.hakuaika.alkupvm)),
              maksatushakemus2Alkupvm: hakemus_mh2.hakuaika.alkupvm,
              maksatushakemus2AlkupvmKalenteri: false,
              maksatushakemus2Loppupvm: hakemus_mh2.hakuaika.loppupvm,
              maksatushakemus2LoppupvmKalenteri: false,

              ah0: processHakemus(hakemus_ah0),
              mh1: processHakemus(hakemus_mh1),
              mh2: processHakemus(hakemus_mh2)
            };
            if (hakemuskausi.tilatunnus == "A" || hakemuskausi.tilatunnus == "0") {
              processedHakemuskausi.uusi = true;
            }


            hakemuskaudetTmp.push(processedHakemuskausi);
          });
          $scope.hakemuskaudet = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
          $scope.muokkaaHakuaikojaVuosi = null;
        })
        .error(function (data) {
          StatusService.virhe('HakemuskausiService.haeSummary()', data);
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
      var alku_ts= 0;
      var loppu_ts=0;
      if (typeof alkupvm === 'undefined' || typeof loppupvm === 'undefined' ) return false;
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

    $scope.luoUusiHakemuskausi = function (vuosi) {
      HakemuskausiService.luoUusi(vuosi)
        .success(function () {
          StatusService.ok('HakemuskausiService.luoUusi(' + vuosi + ')', 'Hakemuskausi: ' + vuosi + ' luonti onnistui.');
          haeHakemuskaudet();
        })
        .error(function (data) {
          StatusService.virhe('HakemuskausiService.luoUusi(' + vuosi + ')', data);
        });
    };

    $scope.avaaKalenteri = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    };

    $scope.asetaMuokkaaHakuaikojaVuosi = function (vuosi) {
      $scope.muokkaaHakuaikojaVuosi = vuosi;
    };

    $scope.tallennaHakuajat = function (vuosi, ah0alkupvm, ah0loppupvm, mh1alkupvm, mh1loppupvm, mh2alkupvm, mh2loppupvm) {
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.form.hakuaikaForm.$valid) {
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
            // haeHakemuskaudet();
          })
          .error(function (data) {
            StatusService.virhe('HakemuskausiService.saveHakuajat(' + vuosi + ')', data);
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
        $location.path('/k/hakemukset/' + tyyppi);
      } else {
        $location.path('/k/hakemukset');
      }
    };

    $scope.upload = function (tiedostot, vuosi) {
      console.log('Upload:tiedostot length:' + tiedostot.length);
      if (tiedostot.length > 0) {
        $upload.upload({
          url: 'api/hakemuskausi/' + vuosi + '/hakuohje',
          method: 'PUT',
          fields: {myObj: $scope.myModelObj},
          file: tiedostot[0],
          fileFormDataName: 'hakuohje'
        }).progress(function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
        }).success(function (data, status, headers, config) {
          console.log('Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' onnistui. Paluuarvo: ' + data);
          StatusService.ok('Hakuohjelautaus: ' + config.file.name + ' vuodelle:' + vuosi, 'Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' onnistui.');
          haeHakemuskaudet();
        }).error(function (data, status, headers, config) {
          console.log('Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' epäonnistui. Paluuarvo: ' + data);
          StatusService.virhe('Hakuohjelataus: ' + config.file.name + ' vuodelle:' + vuosi, 'Hakuohjeen: ' + config.file.name + ' lataus vuodelle:' + vuosi + ' epäonnistui:' + data);
        });
      }
      haeHakemuskaudet();
    };

    $scope.validiPaivamaara = function (pvm) {
      var validiPvm = false;
      var min_ts = Date.parse('2010-01-01');
      var max_ts = Date.parse('2100-01-01');
      var pvm_ts = null;
      if (typeof pvm === 'undefined') return false;
      if (typeof pvm === 'string') {
        pvm_ts = Date.parse(pvm);
      } else {
        pvm_ts = Number(pvm);
      }
      return ((pvm_ts > min_ts) && (pvm_ts < max_ts) );
    };

    $scope.form = {};
    haeHakemuskaudet();
  }
  ]);

