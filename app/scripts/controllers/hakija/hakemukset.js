'use strict';

var _ = require('lodash');
var angular = require('angular');
var hakemusUtils = require('utils/hakemus');

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

    HakemuskausiService.haeOmat()
      .then(function (hakemuskaudet) {
        $scope.hakemuskaudet = hakemuskaudet;
        $scope.kaynnistetytHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
          return hakemuskausi.tilatunnus !== "S";
        });
        $scope.suljetutHakemuskaudet = _.filter(hakemuskaudet, function (hakemuskausi) {
          return hakemuskausi.tilatunnus === "S";
        });
      })
      .catch(function (err) {
        StatusService.virhe('HakemusService.haeKaikki())', err.message);
      });
  }]);
