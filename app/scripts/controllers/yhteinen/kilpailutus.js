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
  ['$scope', '$state', '$element', '$q', 'StatusService', 'OrganisaatioService', 'KilpailutusService', 'KayttajaService',
  function ($scope, $state, $element, $q, StatusService, OrganisaatioService, KilpailutusService, KayttajaService) {

    const isNew = $state.params.id == 'new';
    $scope.isNew = isNew;

    if (isNew) {
      $q.all([OrganisaatioService.hae(), KayttajaService.hae()]).then(
        ([organisaatiot, user]) => {
          $scope.kilpailutus = {
            organisaatioid: user.organisaatioid,
            kohdearvo: null,
            kalusto:   null,
            selite:    null,

            julkaisupvm:               null,
            tarjouspaattymispvm:       null,
            hankintapaatospvm:         null,
            liikennointialoituspvm:    null,
            liikennointipaattymispvm:  null,
            hankittuoptiopaattymispvm: null,
            optiopaattymispvm:         null,

            optioselite: null,

            hilmalinkki: null,
            asiakirjalinkki: null,

            liikennoitsijanimi: null,
            tarjousmaara:  null,
            tarjoushinta1: null,
            tarjoushinta2: null
          };
          $scope.organisaatio = _.find(organisaatiot, {id: user.organisaatioid});
          $scope.organisaatiot = organisaatiot;
        }, StatusService.errorHandler);
    } else {
      $q.all([OrganisaatioService.hae(), KilpailutusService.get($state.params.id)]).then(
        ([organisaatiot, kilpailutus]) => {
          $scope.kilpailutus = c.updateAll(kilpailutus, kilpailutusPVMProperties, value => c.isNotBlank(value) ? new Date(value) : null);

          $scope.organisaatio = _.find(organisaatiot, {id: kilpailutus.organisaatioid});

          $scope.organisaatiot = organisaatiot;
        }, StatusService.errorHandler);
    }

    $scope.cancel = function () {
      $state.go('app.kilpailutukset');
    };

    $scope.save = function () {
      StatusService.tyhjenna();

      if (!$scope.kilpailutusForm.$valid) {
        $scope.$emit('focus-invalid');
        d.touchErrorFields($scope.kilpailutusForm);

        StatusService.virhe('', 'Korjaa lomakkeen virheet ennen tallentamista.');
        return;
      }

      var kilpailutusEdit = c.updateAll(
        _.clone($scope.kilpailutus),
        kilpailutusPVMProperties,
        date => date ? t.toISOString(date) : null);

      kilpailutusEdit.id = undefined;

      const savePromise = isNew ?
        KilpailutusService.add(kilpailutusEdit) :
        KilpailutusService.save($scope.kilpailutus.id, kilpailutusEdit);

      savePromise.then(function() {
        StatusService.ok('', 'Kilpailutuksen tallennus onnistui.');
        $scope.kilpailutusForm.$setPristine();
        $state.go('app.kilpailutukset');
      }, StatusService.errorHandler);
    };


    $scope.kohdenimiErrorMessage = d.requiredErrorMessage('Kohteen nimi');
    $scope.liikennointialoituspvmErrorMessage = d.requiredErrorMessage('Liikennöinnin aloittaminen');
    $scope.liikennointipaattymispvmErrorMessage = d.requiredErrorMessage('Liikennöinnin päättäminen');

  }]);
