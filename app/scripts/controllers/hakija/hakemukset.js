'use strict';

import * as _ from 'lodash';
import * as angular from 'angular';
import * as hakemus from 'utils/hakemus';
import * as  pdf from 'utils/pdfurl';

angular.module('jukufrontApp')
  .controller('HakijaHakemuksetCtrl', ['$scope', '$state', 'HakemuskausiService', 'StatusService', function ($scope, $state, HakemuskausiService, StatusService) {

    $scope.orderHakemukset = hakemus.orderHakemukset;

    $scope.valitseHakemus = function (hakemus) {
      $state.go('app.hakemus', {
        id: hakemus.id
      });
    };

    $scope.hasHakemuksia = function(hakemuskausi){
        return (hakemuskausi.hakemukset.length>0);
    };

    $scope.getHakuohjePdf = function (vuosi) {
      return pdf.getHakuohjePdfUrl(vuosi);
    };

    $scope.isELYhakemus = function isELYhakemus(hakemus) {
      return hakemus.hakemustyyppitunnus === 'ELY';
    };

    $scope.isELYhakija = function (hakemuskausi) {
      return (_.find(hakemuskausi.hakemukset, function (hakemus) {
        return _.includes(['ELY'], hakemus.hakemustyyppitunnus)
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
