'use strict';

var _ = require('lodash');
var angular = require('angular');
var hakemusUtils = require('utils/hakemus');

angular.module('jukufrontApp')
  .controller('HakijaHakemuksetCtrl', ['$scope', '$state', 'HakemusService', 'StatusService', function ($scope, $state, HakemusService, StatusService) {

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

    HakemusService.haeKaikki()
    .then(function (hakemuskaudet) {
      $scope.hakemuskaudet = hakemuskaudet;
    })
    .catch(function (err) {
      StatusService.virhe('HakemusService.haeKaikki())', err.message);
    });
  }]);
