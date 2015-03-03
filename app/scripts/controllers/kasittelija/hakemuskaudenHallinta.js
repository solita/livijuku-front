'use strict';

angular.module('jukufrontApp')
  // this is the important bit:
  .directive('datepickerPopup', function (){
    return {
      restrict: 'EAC',
      require: 'ngModel',
      link: function(scope, element, attr, controller) {
        //remove the default formatter from the input directive to prevent conflict
        controller.$formatters.shift();
      }
    }
  })
  .controller('KasittelijaHakemuskaudenHallintaCtrl', ['$scope', '$location', '$route', '$log', 'HakemuskausiService', 'StatusService', '$upload', function ($scope, $location, $route, $log, HakemuskausiService, StatusService, $upload) {

    function haeHakemuskaudet() {
      $scope.ladatutHakuohjeet = [];
      HakemuskausiService.hae()
        .success(function (data) {
          var hakemuskaudetTmp = [];
          _(angular.fromJson(data)).forEach(function (hakemuskausi) {
            if (hakemuskausi.tilatunnus == "A") {
              hakemuskaudetTmp.push({
                'vuosi': hakemuskausi.vuosi,
                'uusi': true,
                'tilatunnus': hakemuskausi.tilatunnus,
                'avustushakemusTilatunnus': '',
                'avustushakemusAlkupvm': '',
                'avustushakemusAlkupvmKalenteri': false,
                'avustushakemusLoppupvm': '',
                'avustushakemusLoppupvmKalenteri': false,
                'maksatushakemus1Tilatunnus': '',
                'maksatushakemus1Alkupvm': '',
                'maksatushakemus1AlkupvmKalenteri': false,
                'maksatushakemus1Loppupvm': '',
                'maksatushakemus1LoppupvmKalenteri': false,
                'maksatushakemus2Tilatunnus': '',
                'maksatushakemus2Alkupvm': '',
                'maksatushakemus2AlkupvmKalenteri': false,
                'maksatushakemus2Loppupvm': '',
                'maksatushakemus2LoppupvmKalenteri': false
              });
            } else {
              hakemuskaudetTmp.push({
                'vuosi': hakemuskausi.vuosi,
                'tilatunnus': hakemuskausi.tilatunnus,
                'avustushakemusTilatunnus': _.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakemustilatunnus,
                'avustushakemusAlkupvm': Number(new Date(_.find(hakemuskausi.hakemukset, {'hakemustyyppitunnus': 'AH0'}).hakuaika.alkupvm)),
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
          var seuraavaVuosi = new Date().getFullYear() + 1;
          if (!(_.some(hakemuskaudetTmp, {'vuosi': seuraavaVuosi}))) {
            hakemuskaudetTmp.push({
              'vuosi': seuraavaVuosi,
              'tilatunnus': '',
              'uusi': true,
              'avustushakemusTilatunnus': '',
              'avustushakemusAlkupvm': '',
              'avustushakemusAlkupvmKalenteri': false,
              'avustushakemusLoppupvm': '',
              'avustushakemusLoppupvmKalenteri': false,
              'maksatushakemus1Tilatunnus': '',
              'maksatushakemus1Alkupvm': '',
              'maksatushakemus1AlkupvmKalenteri': false,
              'maksatushakemus1Loppupvm': '',
              'maksatushakemus1LoppupvmKalenteri': false,
              'maksatushakemus2Tilatunnus': '',
              'maksatushakemus2Alkupvm': '',
              'maksatushakemus2AlkupvmKalenteri': false,
              'maksatushakemus2Loppupvm': '',
              'maksatushakemus2LoppupvmKalenteri': false
            });
          }
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

    $scope.avaaKalenteri = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
    };

    $scope.upload = function (tiedostot, vuosi) {
      console.log('Upload:tiedostot length:'+tiedostot.length);
      if (tiedostot.length > 0) {
        $upload.upload({
          url: 'api/hakemuskausi/' + vuosi + '/hakuohje',
          method: 'PUT',
          fields : {myObj: $scope.myModelObj},
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

