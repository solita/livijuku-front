'use strict';

var angular = require('angular');
var pdf = require('utils/pdfurl');
var hakemus = require('utils/hakemus');
var _ = require('lodash');

import {toISOString,toUTCTimestamp} from 'utils/time';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuskaudenHallintaCtrl', [
    '$rootScope', '$scope', '$state', '$log', 'HakemuskausiService', 'StatusService', 'Upload',
    function ($rootScope, $scope, $state, $log, HakemuskausiService, StatusService, Upload) {

      $scope.utils = hakemus;
      $scope.avoimetHakemuskaudet = [];
      $scope.suljetutHakemuskaudet = [];

      function haeHakemuskaudet() {
        HakemuskausiService.haeSummary().then((hakemuskaudet) => {
          _.forOwn(hakemuskaudet, function (hakemuskausi, key) {
            _.forOwn(hakemuskausi.hakemukset, function (hakemustyyppi, key) {
              hakemustyyppi.hakuaika.alkupvm = toUTCTimestamp(hakemustyyppi.hakuaika.alkupvm);
              hakemustyyppi.hakuaika.loppupvm = toUTCTimestamp(hakemustyyppi.hakuaika.loppupvm);
            });
          });
          $scope.avoimetHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
            return (hakemuskausi.tilatunnus === "0" || hakemuskausi.tilatunnus === "A");
          });
          $scope.kaynnistetytHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
            return hakemuskausi.tilatunnus === "K";
          });
          $scope.suljetutHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
            return hakemuskausi.tilatunnus === "S";
          });
        }, StatusService.errorHandler)
      }

      function tiedostotyyppiPdf(tiedostotyyppi) {
        return (tiedostotyyppi === 'application/pdf' || tiedostotyyppi === 'pdf');
      }

      $scope.uusiHakemuskausi = function uusiHakemuskausi(hakemuskausi) {
        return ['A', '0'].indexOf(hakemuskausi.tilatunnus) > -1;
      };

      $scope.hakuohjeLadattu = function hakuohjeLadattu(hakemuskausi) {
        return Boolean(hakemuskausi.hakuohje_contenttype);
      };

      $scope.elyhakuohjeLadattu = function elyhakuohjeLadattu(hakemuskausi) {
        return Boolean(hakemuskausi.elyhakuohje_contenttype);
      };

      $scope.isELYhakemus = function isELYhakemus(hakemus) {
        return hakemus.hakemustyyppitunnus === 'ELY';
      };

      $scope.hakemuskausiAvoin = function hakemuskausiAvoin(hakemuskausi) {
        return hakemuskausi.tilatunnus === 'A';
      };

      $scope.hakemuskausiKaynnistetty = function hakemuskausiKaynnistetty(hakemuskausi) {
        return hakemuskausi.tilatunnus === 'K';
      };

      $scope.hakemuskausiSuljettu = function hakemuskausiSuljettu(hakemuskausi) {
        return hakemuskausi.tilatunnus === 'S';
      };

      $scope.voiKaynnistaa = function voiKaynnistaa(hakemuskausi) {
        return $scope.hakemuskausiAvoin(hakemuskausi) &&
          $scope.hakuohjeLadattu(hakemuskausi) &&
          $scope.elyhakuohjeLadattu(hakemuskausi) &&
          $rootScope.sallittu('modify-hakemuskausi');
      };

      $scope.hakemuskausiPanelClass = function (hakemusyhteenveto) {
        return hakemus.hakemusSuljettu(hakemusyhteenveto) ? 'hakemuskausi-panel_suljettu' : 'hakemuskausi-panel_auki';
      };

      var sortOrder = ['AH0', 'MH1', 'MH2', 'ELY'];

      $scope.hakemustyypit = function (hakemuskausi) {
        return _.sortBy(hakemuskausi.hakemukset, hakemus => _.findIndex(sortOrder, hakemus.hakemustyyppitunnus));
      };

      $scope.tallennaHakuajat = function tallennaHakuajat(vuosi, hakemus) {
        StatusService.tyhjenna();
        var hakuajat = [
          {
            hakemustyyppitunnus: hakemus.hakemustyyppitunnus,
            alkupvm: toISOString(hakemus.hakuaika.alkupvm),
            loppupvm: toISOString(hakemus.hakuaika.loppupvm)
          }
        ];

        HakemuskausiService.saveHakuajat(vuosi, hakuajat).then(() => {

          StatusService.ok(
            `HakemuskausiService.saveHakuajat(${vuosi})`,
            `Hakuaikojen: tallennus vuodelle ${vuosi} onnistui.`
          );

        }, StatusService.errorHandler);
      };

      $scope.kaynnistaHakemuskausi = function kaynnistaHakemuskausi(vuosi) {
        StatusService.tyhjenna();
        HakemuskausiService.luoUusi(vuosi)
          .then(function (/* hakemuskausi */) {
            haeHakemuskaudet();
            StatusService.ok('HakemuskausiService.luoUusi(' + vuosi + ')', 'Hakemuskauden ' + vuosi + ' luonti onnistui.');
          }, StatusService.errorHandler);
      };

      $scope.suljeHakemuskausi = function suljeHakemuskausi(vuosi) {
        StatusService.tyhjenna();
        HakemuskausiService.sulje(vuosi)
          .then(function (/* sulje hakemuskausi */) {
            haeHakemuskaudet();
            StatusService.ok('HakemuskausiService.sulje(' + vuosi + ')', 'Hakemuskauden ' + vuosi + ' sulkeminen onnistui.');
          }, StatusService.errorHandler);
      };

      $scope.getHakuohjePdf = function (vuosi) {
        return pdf.getHakuohjePdfUrl(vuosi);
      };

      $scope.getElyHakuohjePdf = function (vuosi) {
        return pdf.getElyHakuohjePdfUrl(vuosi);
      };

      $scope.uploadElyHakuohje = function (tiedostot, hakemuskausi) {
        $scope.upload(tiedostot, hakemuskausi, 'elyhakuohje');
      };

      $scope.uploadHakuohje = function (tiedostot, hakemuskausi) {
        $scope.upload(tiedostot, hakemuskausi, 'hakuohje');
      };

      $scope.upload = function (tiedostot, hakemuskausi, hakuohjeteksti) {
        StatusService.tyhjenna();
        const {vuosi} = hakemuskausi;
        if (tiedostot && tiedostot.length > 0) {
          if (!tiedostotyyppiPdf(tiedostot[0].type)) {
            StatusService.virhe('Hakuohjetta ei voitu ladata, koska hakuohje ei ollut PDF-formaattia', 'Hakuohjetta ei voitu ladata, koska hakuohjetiedosto:' + tiedostot[0].name + ' ei ollut PDF-formaattia');
            return;
          }
          Upload.upload({
            url: 'api/hakemuskausi/' + vuosi + '/' + hakuohjeteksti,
            data: {hakuohje: tiedostot[0]},
            method: 'PUT'
          }).then(function (response) {
            StatusService.ok(
              `Hakuohjeen lataus: ${response.config.data.hakuohje.name} vuodelle: ${vuosi}`,
              `Hakuohjeen: ${response.config.data.hakuohje.name} lataus vuodelle: ${vuosi} onnistui.`
            );
            haeHakemuskaudet();
          }, StatusService.errorHandlerWithMessage(
            `Hakuohjeen: ${tiedostot[0].name} lataus vuodelle: ${vuosi} epäonnistui. `));
        }
      };
      haeHakemuskaudet();
    }
  ])
;

