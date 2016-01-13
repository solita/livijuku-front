'use strict';

var _ = require('lodash');
var c = require('utils/core');
var t = require('utils/tunnusluvut');
var angular = require('angular');
var Promise = require('bluebird');

// TODO: tämän voi poistaa jos url:iin ei tule vuotta ja organisaatiota
loadTunnusluvutPromise.$inject = ['$state', 'StatusService', 'TunnuslukuEditService'];
export function loadTunnusluvutPromise($state, StatusService, TunnuslukuEditService) {
  return Promise.props({
    liikennevuosi: Promise.resolve('test') //TunnuslukuEditService.haeKysyntaTarjonta(2016, 1, 'BR')
  }).then(_.identity, StatusService.errorHandler);
};

const types = {
  TTYT: 'Taustatiedot ja yl. tunnusluvut',
  BR: 'PSA Brutto',
  KOS: 'PSA KOS',
  SA: 'Siirtymäajan liikenne',
  ME: 'ME liikenne'
};

function loadTunnusluvut(vuosi, organisaatioid, tyyppi, scope, TunnuslukuEditService, StatusService) {
  Promise.props({
    liikennevuosi: t.isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeKysyntaTarjonta(vuosi, organisaatioid, tyyppi) : undefined
  }).then(
    tunnusluvut => scope.$evalAsync(scope => scope.tunnusluvut = tunnusluvut),
    StatusService.errorHandler);
}

angular.module('jukufrontApp')
  .controller('TunnusluvutMuokkausCtrl',
    ['$scope', '$state', 'OrganisaatioService', 'TunnuslukuEditService', 'StatusService',

    function ($scope, $state, OrganisaatioService, TunnuslukuEditService, StatusService) {

    $scope.tunnuslukuTyyppiNimi = function(type) {
      return types[type];
    }

    function tyyppi() {
      return $state.current.tyyppi;
    }

    $scope.vuositayttoaste = Math.floor((Math.random() * 100) + 1);

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $state.current.tyyppi === tyyppi;
    };

    $scope.tyyppi = tyyppi;

    $scope.toTab = function toTab(tyyppi) {
      $state.go('app.tunnusluku.syottaminen.' + tyyppi);
    };

    OrganisaatioService.hae().then(
      organisaatiot => $scope.organisaatiot =
        _.filter(organisaatiot,
                 org => _.contains(['KS1', 'KS2', 'ELY'], org.lajitunnus)),
      StatusService.errorHandler);

    $scope.$watchGroup(["vuosi", "organisaatioId", "tyyppi()"], (id) => {
        if (_.all(id, c.isDefinedNotNull)) {
          loadTunnusluvut(id[0], id[1], id[2], $scope, TunnuslukuEditService, StatusService)}
        });


    $scope.tallennaHakemus = function () {
      var tallennusPromise = [];

      if (t.isSopimustyyppi(tyyppi())) {
        tallennusPromise.push(TunnuslukuEditService.tallennaKysyntaTarjonta(
          $scope.vuosi, $scope.organisaatioId, tyyppi(), $scope.tunnusluvut.liikennevuosi));
      }

      Promise.all(tallennusPromise).then(
        function() { StatusService.ok('', 'Tunnuslukujen tallennus onnistui.'); },
        StatusService.errorHandler);
    }
  }]);
