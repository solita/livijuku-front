'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuskaudenHallintaCtrl', ['$scope', '$location', '$route', '$log', 'HakemuskausiService', 'StatusService', '$upload', function ($scope, $location, $route, $log, HakemuskausiService, StatusService, $upload) {

    function processHakemus(hakemus) {
      var oletukset = {
        K: 0, V: 0, T: 0, T0: 0, TV: 0, P: 0, M: 0
      }

      var existing_tilat = _.mapValues(
        _.indexBy(hakemus.hakemustilat, 'hakemustilatunnus'), function(o) {return o.count;});
      var all_tilat = _.merge(oletukset, existing_tilat);

      return {
        tilat: all_tilat,
        total: (_.reduce(_.values(all_tilat), function(sum, n) {return sum + n;})),
        kaynnissa: (Date.now() > (new Date(hakemus.hakuaika.alkupvm)).valueOf())
      }
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
                avustushakemusAlkupvm: Number(new Date(hakemus_ah0.hakuaika.alkupvm)),
                avustushakemusAlkupvmKalenteri: false,
                avustushakemusLoppupvm: Number(new Date(hakemus_ah0.hakuaika.loppupvm)),
                avustushakemusLoppupvmKalenteri: false,
                maksatushakemus1Kaynnissa: nykyhetki>Number(new Date(hakemus_mh1.hakuaika.alkupvm)),
                maksatushakemus1Alkupvm: Number(new Date(hakemus_mh1.hakuaika.alkupvm)),
                maksatushakemus1AlkupvmKalenteri: false,
                maksatushakemus1Loppupvm: Number(new Date(hakemus_mh1.hakuaika.loppupvm)),
                maksatushakemus1LoppupvmKalenteri: false,
                maksatushakemus2Kaynnissa: nykyhetki > Number(new Date(hakemus_mh2.hakuaika.alkupvm)),
                maksatushakemus2Alkupvm: Number(new Date(hakemus_mh2.hakuaika.alkupvm)),
                maksatushakemus2AlkupvmKalenteri: false,
                maksatushakemus2Loppupvm: Number(new Date(hakemus_mh2.hakuaika.loppupvm)),
                maksatushakemus2LoppupvmKalenteri: false,

                ah0: processHakemus(hakemus_ah0),
                mh1: processHakemus(hakemus_mh1),
                mh2: processHakemus(hakemus_mh2)
              }
              if (hakemuskausi.tilatunnus == "A" || hakemuskausi.tilatunnus == "0") {
                processedHakemuskausi.uusi = true;
              }



              hakemuskaudetTmp.push(processedHakemuskausi);
          });
          $scope.hakemuskaudet = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
        })
        .error(function (data) {
          StatusService.virhe('HakemuskausiService.haeSummary()', data);
        });
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
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

    $scope.muokkaaHakuaikojaVuosi = null;
    $scope.avustushakemusAlkupvm = null;
    $scope.avustushakemusLoppupvm = null;
    $scope.maksatushakemus1Alkupvm = null;
    $scope.maksatushakemus1Loppupvm = null;
    $scope.maksatushakemus2Alkupvm = null;
    $scope.maksatushakemus2Loppupvm = null;


    $scope.asetaMuokkaaHakuaikojaVuosi = function (vuosi, ah0alkupvm, ah0loppupvm, mh1alkupvm, mh1loppupvm, mh2alkupvm, mh2loppupvm) {
      $scope.avustushakemusAlkupvm = ah0alkupvm;
      $scope.avustushakemusLoppupvm = ah0loppupvm;
      $scope.maksatushakemus1Alkupvm = mh1alkupvm;
      $scope.maksatushakemus1Loppupvm = mh1loppupvm;
      $scope.maksatushakemus2Alkupvm = mh2alkupvm;
      $scope.maksatushakemus2Loppupvm = mh2loppupvm;
      $scope.muokkaaHakuaikojaVuosi = vuosi;
    };

    function toISODateString(date) {
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    // TODO: Kutsu suoraan tätä lomakkeen Tallenna hakuajat linkistä. Päästään eroon scope-globaaleista.
    $scope.tallennaHakuajat = function (vuosi) {
      console.log("Tallenna hakuajat vuosi:" + vuosi);
      console.log("AH0_Alkupvm:" + $scope.avustushakemusAlkupvm + ' date:' + new Date($scope.avustushakemusAlkupvm).toISOString());
      console.log("AH0_Loppupvm:" + $scope.avustushakemusLoppupvm + ' date:' + new Date($scope.avustushakemusLoppupvm).toISOString());
      console.log("MH1_Alkupvm:" + $scope.maksatushakemus1Alkupvm + ' date:' + new Date($scope.maksatushakemus1Alkupvm).toISOString());
      console.log("MH1_Loppupvm:" + $scope.maksatushakemus1Loppupvm + ' date:' + new Date($scope.maksatushakemus1Loppupvm).toISOString());
      console.log("MH2_Alkupvm:" + $scope.maksatushakemus2Alkupvm + ' date:' + new Date($scope.maksatushakemus2Alkupvm).toISOString());
      console.log("MH2_Loppupvm:" + $scope.maksatushakemus2Loppupvm + ' date:' + new Date($scope.maksatushakemus2Loppupvm).toISOString());

      function epochToISOString(epoch) {
        return toISODateString(new Date(epoch));
      }

      var hakuajat = [
        {hakemustyyppitunnus: "AH0", alkupvm: epochToISOString($scope.avustushakemusAlkupvm), loppupvm: epochToISOString($scope.avustushakemusLoppupvm)},
        {hakemustyyppitunnus: "MH1", alkupvm: epochToISOString($scope.maksatushakemus1Alkupvm), loppupvm: epochToISOString($scope.maksatushakemus1Loppupvm)},
        {hakemustyyppitunnus: "MH2", alkupvm: epochToISOString($scope.maksatushakemus2Alkupvm), loppupvm: epochToISOString($scope.maksatushakemus2Loppupvm)},
      ];

      HakemuskausiService.saveHakuajat(vuosi, hakuajat)
        .success(function () {
          StatusService.ok('HakemuskausiService.saveHakuajat(' + vuosi + ')', 'Hakuaikojen: tallennus vuodelle ' + vuosi + ' onnistui.');
          haeHakemuskaudet();
        })
        .error(function (data) {
          StatusService.virhe('HakemuskausiService.saveHakuajat(' + vuosi + ')', data);
        });

      // TODO: Ruma monimuuttujainen globaali tila. Ugh.
      $scope.muokkaaHakuaikojaVuosi = null;
      $scope.avustushakemusAlkupvm = null;
      $scope.avustushakemusLoppupvm = null;
      $scope.maksatushakemus1Alkupvm = null;
      $scope.maksatushakemus1Loppupvm = null;
      $scope.maksatushakemus2Alkupvm = null;
      $scope.maksatushakemus2Loppupvm = null;
    };

    $scope.valitseHakemustyyppi = function (tyyppi) {

      // TODO: Ruma monimuuttujainen globaali tila. Ugh.
      if (
        $scope.muokkaaHakuaikojaVuosi ||
        $scope.avustushakemusAlkupvm ||
        $scope.avustushakemusLoppupvm ||
        $scope.maksatushakemus1Alkupvm ||
        $scope.maksatushakemus1Loppupvm ||
        $scope.maksatushakemus2Alkupvm ||
        $scope.maksatushakemus2Loppupvm
      ) {
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

    haeHakemuskaudet();

  }

  ])
;

