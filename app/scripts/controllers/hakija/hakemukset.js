'use strict';

var _ = require('lodash');
var angular = require('angular');
var hakemusUtils = require('utils/hakemus');
var pdf = require('utils/pdfurl');

angular.module('jukufrontApp')
  .controller('HakijaHakemuksetCtrl', ['$scope', '$state', 'HakemuskausiService', 'StatusService', function ($scope, $state, HakemuskausiService, StatusService) {

    $scope.utils = hakemusUtils;

    $scope.valitseHakemus = function (hakemus) {
      $state.go('app.hakemus', {
        id: hakemus.id
      });
    };

    $scope.haeHakemus = function haeHakemus(hakemuskausi, tyyppi) {
      return _.findWhere(hakemuskausi.hakemukset, {
        hakemustyyppitunnus: tyyppi
      });
    };

    $scope.getHakuohjePdf = function (vuosi) {
      return pdf.getHakuohjePdfUrl(vuosi);
    };

    $scope.isELYhakija = function (hakemuskausi) {
      return (_.find(hakemuskausi.hakemukset, function (hakemus) {
        return _.contains(['ELY'], hakemus.hakemustyyppitunnus)
      }) !== undefined);
    };

    $scope.getElyHakuohjePdf = function (vuosi) {
      return pdf.getElyHakuohjePdfUrl(vuosi);
    };

    HakemuskausiService.haeOmat()
      .then(function (hakemuskaudet) {
        $scope.hakemuskaudet = hakemuskaudet;
        $scope.kaynnistetytHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
          return hakemuskausi.tilatunnus !== "S";
        });
        $scope.suljetutHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
          return hakemuskausi.tilatunnus === "S";
        });
      }, StatusService.errorHandler);
  }]);
