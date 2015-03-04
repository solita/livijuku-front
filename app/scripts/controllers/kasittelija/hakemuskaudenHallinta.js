'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuskaudenHallintaCtrl', ['$scope', '$location', '$route', '$log', 'HakemuskausiService', 'StatusService', '$upload', function ($scope, $location, $route, $log, HakemuskausiService, StatusService, $upload) {

    function haeHakemuskaudet() {
      $scope.ladatutHakuohjeet = [];
      HakemuskausiService.hae()
        .success(function (data) {
          var hakemuskaudetTmp = [];
          _(angular.fromJson(data)).forEach(function (hakemuskausi) {
            if (hakemuskausi.tilatunnus == "A" || hakemuskausi.tilatunnus == "0") {
              hakemuskaudetTmp.push({
                'vuosi': hakemuskausi.vuosi,
                'uusi': true,
                'tilatunnus': hakemuskausi.tilatunnus,
                'avustushakemusTilatunnus': '',
                'avustushakemusAlkupvm': '2014-09-01T00:00:00.000Z',
                'avustushakemusAlkupvmKalenteri': false,
                'avustushakemusLoppupvm': '2014-10-01T00:00:00.000Z',
                'avustushakemusLoppupvmKalenteri': false,
                'maksatushakemus1Tilatunnus': '',
                'maksatushakemus1Alkupvm': '2014-09-01T00:00:00.000Z',
                'maksatushakemus1AlkupvmKalenteri': false,
                'maksatushakemus1Loppupvm': '2014-09-01T00:00:00.000Z',
                'maksatushakemus1LoppupvmKalenteri': false,
                'maksatushakemus2Tilatunnus': '',
                'maksatushakemus2Alkupvm': '2014-09-01T00:00:00.000Z',
                'maksatushakemus2AlkupvmKalenteri': false,
                'maksatushakemus2Loppupvm': '2014-09-01T00:00:00.000Z',
                'maksatushakemus2LoppupvmKalenteri': false
              });
            } else {
              hakemuskaudetTmp.push({
                'vuosi': hakemuskausi.vuosi,
                'tilatunnus': hakemuskausi.tilatunnus,
                'avustushakemusTilatunnus': _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakemustilatunnus,
                'avustushakemusAlkupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.alkupvm)),
                'avustushakemusAlkupvmAlkup': new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.alkupvm),
                'avustushakemusAlkupvmKalenteri': false,
                'avustushakemusLoppupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.loppupvm)),
                'avustushakemusLoppupvmKalenteri': false,
                'maksatushakemus1Tilatunnus': _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakemustilatunnus,
                'maksatushakemus1Alkupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.alkupvm)),
                'maksatushakemus1AlkupvmKalenteri': false,
                'maksatushakemus1Loppupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH1'}).hakuaika.loppupvm)),
                'maksatushakemus1LoppupvmKalenteri': false,
                'maksatushakemus2Tilatunnus': _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakemustilatunnus,
                'maksatushakemus2Alkupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakuaika.alkupvm)),
                'maksatushakemus2AlkupvmKalenteri': false,
                'maksatushakemus2Loppupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'MH2'}).hakuaika.loppupvm)),
                'maksatushakemus2LoppupvmKalenteri': false
              });
            }
          });
          $scope.hakemuskaudet = _.sortBy(hakemuskaudetTmp, 'vuosi').reverse();
        })
        .error(function (data) {
          StatusService.virhe('HakemuskausiService.hae()', data);
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

    $scope.muokkaaHakuaikojaVuosi = '';

    $scope.asetaMuokkaaHakuaikojaVuosi = function (vuosi, ah0alkupvm, ah0loppupvm, mh1alkupvm, mh1loppupvm, mh2alkupvm, mh2loppupvm) {
      $scope.avustushakemusAlkupvm = ah0alkupvm;
      $scope.avustushakemusLoppupvm = ah0loppupvm;
      $scope.maksatushakemus1Alkupvm = mh1alkupvm;
      $scope.maksatushakemus1Loppupvm = mh1loppupvm;
      $scope.maksatushakemus2Alkupvm = mh2alkupvm;
      $scope.maksatushakemus2Loppupvm = mh2loppupvm;
      $scope.muokkaaHakuaikojaVuosi = vuosi;
    };

    $scope.tallennaHakuajat = function (vuosi) {
      console.log("Tallenna hakuajat vuosi:" + vuosi);
      console.log("Alkupvm:" + $scope.avustushakemusAlkupvm + ' nd:' + new Date($scope.avustushakemusAlkupvm).toISOString());
      console.log("Loppupvm:" + $scope.avustushakemusLoppupvm);
      $scope.muokkaaHakuaikojaVuosi = '';
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

