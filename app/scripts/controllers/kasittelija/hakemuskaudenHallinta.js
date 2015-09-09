'use strict';

var angular = require('angular');
var pdf = require('utils/pdfurl');
var hakemus = require('utils/hakemus');
var _ = require('lodash');

import {toISOString} from 'utils/time';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuskaudenHallintaCtrl', [
    '$rootScope', '$scope', '$state', '$log', 'HakemuskausiService', 'StatusService', 'Upload',
    function ($rootScope, $scope, $state, $log, HakemuskausiService, StatusService, Upload) {

      $scope.utils = hakemus;
      $scope.editing = true;
      $scope.avoimetHakemuskaudet = [];
      $scope.suljetutHakemuskaudet = [];

      function haeHakemuskaudet() {
        // TODO - korvaa kun backend palauttaa uuden resurssin
        HakemuskausiService.haeSummary().then((hakemuskaudet) => {
          $scope.avoimetHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
            return (hakemuskausi.tilatunnus === "0" || hakemuskausi.tilatunnus === "A");
          });
          $scope.kaynnistetytHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
            return hakemuskausi.tilatunnus === "K";
          });
          $scope.suljetutHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
            return hakemuskausi.tilatunnus === "S";
          });
        })
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
          $rootScope.sallittu('modify-hakemuskausi');
      };

      $scope.tallennaHakuajat = function tallennaHakuajat(vuosi, hakemus, {alkupvm, loppupvm}) {
        var hakuajat = [
          {
            hakemustyyppitunnus: hakemus.hakemustyyppitunnus,
            alkupvm: toISOString(new Date(alkupvm)),
            loppupvm: toISOString(new Date(loppupvm))
          }
        ];

        HakemuskausiService.saveHakuajat(vuosi, hakuajat).then(() => {

          StatusService.ok(
            `HakemuskausiService.saveHakuajat(${vuosi})`,
            `Hakuaikojen: tallennus vuodelle ${vuosi} onnistui.`
          );

          haeHakemuskaudet();
        }, StatusService.errorHandler);
      };

      $scope.kaynnistaHakemuskausi = function kaynnistaHakemuskausi(vuosi) {
        HakemuskausiService.luoUusi(vuosi)
          .then(function (/* hakemuskausi */) {
            haeHakemuskaudet();
            StatusService.ok('HakemuskausiService.luoUusi(' + vuosi + ')', 'Hakemuskauden ' + vuosi + ' luonti onnistui.');
          }, StatusService.errorHandler);
      };

      $scope.suljeHakemuskausi = function suljeHakemuskausi(vuosi) {
        HakemuskausiService.sulje(vuosi)
          .then(function (/* sulje hakemuskausi */) {
            haeHakemuskaudet();
            StatusService.ok('HakemuskausiService.sulje(' + vuosi + ')', 'Hakemuskauden ' + vuosi + ' sulkeminen onnistui.');
          }, StatusService.errorHandler);
      };

      $scope.getHakuohjePdf = function (vuosi) {
        return pdf.getHakuohjePdfUrl(vuosi);
      };

      $scope.upload = function (tiedostot, hakemuskausi) {
        const {vuosi} = hakemuskausi;
        if (tiedostot && tiedostot.length > 0) {
          if (!tiedostotyyppiPdf(tiedostot[0].type)) {
            StatusService.virhe('Hakuohjetta ei voitu ladata, koska hakuohje ei ollut PDF-formaattia', 'Hakuohjetta ei voitu ladata, koska hakuohjetiedosto:' + tiedostot[0].name + ' ei ollut PDF-formaattia');
            return;
          }
          Upload.upload({
            url: 'api/hakemuskausi/' + vuosi + '/hakuohje',
            file: tiedostot[0],
            method: 'PUT',
            fileFormDataName: 'hakuohje'
          }).success(function (data, status, headers, config) {
            StatusService.ok(
              `Hakuohjeen lataus: ${config.file.name} vuodelle: ${vuosi}`,
              `Hakuohjeen: ${config.file.name} lataus vuodelle: ${vuosi} onnistui.`
            );
            haeHakemuskaudet();
          }).error(function (data, status, headers, config) {
            StatusService.ok(
              `Hakuohjeen lataus: ${config.file.name} vuodelle: ${vuosi}`,
              `Hakuohjeen: ${config.file.name} lataus vuodelle: ${vuosi} epäonnistui: ${data.message}.`
            );
          });
        }
      };
      haeHakemuskaudet();
    }
  ])
;

