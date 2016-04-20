'use strict';

var _ = require('lodash');
var angular = require('angular');
var d = require('utils/directive');

angular.module('jukufrontApp').controller('KilpailutusCtrl',
  ['$scope', '$state', '$element', '$q', 'StatusService', 'OrganisaatioService', 'KilpailutusService',
  function ($scope, $state, $element, $q, StatusService, OrganisaatioService, KilpailutusService) {

  $q.all([OrganisaatioService.hae(), KilpailutusService.get($state.params.id)]).then(
    ([organisaatiot, kilpailutus]) => {
      $scope.kilpailutus = kilpailutus;
      $scope.organisaatio = _.find(organisaatiot, {id: kilpailutus.organisaatioid});
    }, StatusService.errorHandler);

  $scope.cancel = () => {
    $state.go('app.kilpailutukset');
  };

  $scope.kohteenNimiErrorMessage = d.requiredErrorMessage('Kohteen nimi');
  $scope.suunniteltuJulkaisuajankohtaErrorMessage = d.requiredErrorMessage('Suunniteltu julkaisuajankohta');
  $scope.tarjoustenMaaraaikaErrorMessage = d.requiredErrorMessage('Tarjousten määräaika');
  $scope.ilmoitusVoittajastaErrorMessage = d.requiredErrorMessage('Ilmoitus voittajasta');
  $scope.liikennoinninAloittaminenErrorMessage = d.requiredErrorMessage('Liikennöinnin aloittaminen');
  $scope.vaadittuKalustoErrorMessage = d.requiredErrorMessage('Vaadittu kalusto');
  $scope.lisatiedotErrorMessage = d.requiredErrorMessage('Lisätiedot');

}]);
