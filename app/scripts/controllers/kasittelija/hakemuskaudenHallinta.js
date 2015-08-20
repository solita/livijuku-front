'use strict';

var angular = require('angular');
var pdf = require('utils/pdfurl');
var hakemus = require('utils/hakemus');

import {toISOString} from 'utils/time';

angular.module('jukufrontApp')
  .controller('KasittelijaHakemuskaudenHallintaCtrl', [
    '$rootScope', '$scope', '$state', '$log', 'HakemuskausiService', 'StatusService', 'Upload',
    function ($rootScope, $scope, $state, $log, HakemuskausiService, StatusService, Upload) {

      $scope.utils = hakemus;
      $scope.editing = true;
      $scope.hakemuskaudet = [];

      HakemuskausiService.haeSummary().then((hakemuskaudet) => {
        $scope.hakemuskaudet = hakemuskaudet;
      });

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

          // TODO - korvaa kun backend palauttaa uuden resurssin
          HakemuskausiService.haeSummary().then((hakemuskaudet) => {
            $scope.hakemuskaudet = hakemuskaudet;
          });
        })
          .catch((err) => {
            StatusService.virhe(`HakemuskausiService.saveHakuajat(${vuosi})`, err.message);
          });
      };

      $scope.kaynnistaHakemuskausi = function kaynnistaHakemuskausi(vuosi) {
        HakemuskausiService.luoUusi(vuosi)
          .then(function (/* hakemuskausi */) {

            // TODO - korvaa kun backend palauttaa uuden resurssin
            HakemuskausiService.haeSummary().then((hakemuskaudet) => {
              $scope.hakemuskaudet = hakemuskaudet;
            });

            StatusService.ok('HakemuskausiService.luoUusi(' + vuosi + ')', 'Hakemuskauden ' + vuosi + ' luonti onnistui.');
          })
          .catch(function (err) {
            StatusService.virhe('HakemuskausiService.luoUusi(' + vuosi + ')', err.type + ':' + err.message);
          });
      };

      $scope.suljeHakemuskausi = function suljeHakemuskausi(vuosi) {
        HakemuskausiService.sulje(vuosi)
          .then(function (/* sulje hakemuskausi */) {
            // TODO - korvaa kun backend palauttaa uuden resurssin
            HakemuskausiService.haeSummary().then((hakemuskaudet) => {
              $scope.hakemuskaudet = hakemuskaudet;
            });

            StatusService.ok('HakemuskausiService.sulje(' + vuosi + ')', 'Hakemuskauden ' + vuosi + ' sulkeminen onnistui.');
          })
          .catch(function (err) {
            StatusService.virhe('HakemuskausiService.sulje(' + vuosi + ')', err.type + ':' + err.message);
          });
      };

      $scope.getHakuohjePdf = function (vuosi) {
        return pdf.getHakuohjePdfUrl(vuosi);
      };

      $scope.upload = function (tiedostot, hakemuskausi) {
        const {vuosi} = hakemuskausi;

        if (tiedostot && tiedostot.length > 0) {
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

            // TODO - korvaa koko hakuohje kun endpoint palauttaa päivitetyn hakuohjeen
            HakemuskausiService.haeSummary().then((hakemuskaudet) => {
              $scope.hakemuskaudet = hakemuskaudet;
            });

          }).error(function (data, status, headers, config) {
            StatusService.ok(
              `Hakuohjeen lataus: ${config.file.name} vuodelle: ${vuosi}`,
              `Hakuohjeen: ${config.file.name} lataus vuodelle: ${vuosi} epäonnistui: ${data.message}.`
            );
          });
        }
      };

    }
  ])
;

