'use strict';

var _ = require('lodash');
var angular = require('angular');
var d = require('utils/directive');
var c = require('utils/core');
var t = require('utils/time');

const kilpailutusPVMProperties = [
  'julkaisupvm',
  'tarjouspaattymispvm',
  'hankintapaatospvm',
  'liikennointialoituspvm',
  'liikennointipaattymispvm',
  'hankittuoptiopaattymispvm',
  'optiopaattymispvm'];

angular.module('jukufrontApp').controller('KilpailutusCtrl',
  ['$scope', '$state', '$element', '$q', 'StatusService', 'OrganisaatioService', 'KilpailutusService',
  function ($scope, $state, $element, $q, StatusService, OrganisaatioService, KilpailutusService) {

  $q.all([OrganisaatioService.hae(), KilpailutusService.get($state.params.id)]).then(
    ([organisaatiot, kilpailutus]) => {
      $scope.kilpailutus = c.updateAll(kilpailutus, kilpailutusPVMProperties, value => c.isNotBlank(value) ? new Date(value) : null);

      $scope.organisaatio = _.find(organisaatiot, {id: kilpailutus.organisaatioid});
    }, StatusService.errorHandler);

  $scope.cancel = function () {
    $state.go('app.kilpailutukset');
  };

  $scope.save = function () {
    StatusService.tyhjenna();
    if (!$scope.kilpailutusForm.$valid) {
      $scope.$emit('focus-invalid');
      StatusService.virhe('', 'Korjaa lomakkeen virheet ennen tallentamista.');
      return;
    }

    var kilpailutusEdit = c.updateAll(
      _.clone($scope.kilpailutus),
      kilpailutusPVMProperties,
      date => date ? t.toISOString(date) : null);

    kilpailutusEdit.id = undefined;

    KilpailutusService.save($scope.kilpailutus.id, kilpailutusEdit).then(function() {
      StatusService.ok('', 'Kilpailutuksen tallennus onnistui.');
      $state.go('app.kilpailutukset');
    }, StatusService.errorHandler);
  };


  $scope.kohteenNimiErrorMessage = d.requiredErrorMessage('Kohteen nimi');
  $scope.suunniteltuJulkaisuajankohtaErrorMessage = d.requiredErrorMessage('Suunniteltu julkaisuajankohta');
  $scope.tarjoustenMaaraaikaErrorMessage = d.requiredErrorMessage('Tarjousten määräaika');
  $scope.ilmoitusVoittajastaErrorMessage = d.requiredErrorMessage('Ilmoitus voittajasta');
  $scope.liikennoinninAloittaminenErrorMessage = d.requiredErrorMessage('Liikennöinnin aloittaminen');
  $scope.vaadittuKalustoErrorMessage = d.requiredErrorMessage('Vaadittu kalusto');
  $scope.lisatiedotErrorMessage = d.requiredErrorMessage('Lisätiedot');

}]);
