'use strict';

var _ = require('lodash');
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

function isSopimustyyppi(tunnuslukutyyppi) {
  return _.contains(['BR','KOS','SA','ME'], tunnuslukutyyppi);
}

function isPSA(tunnuslukutyyppi) {
  return _.contains(['BR','KOS'], tunnuslukutyyppi);
}

function loadTunnusluvut(vuosi, organisaatioid, tyyppi, scope, TunnuslukuEditService, StatusService) {
  Promise.props({
    liikennevuosi: isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeKysyntaTarjonta(vuosi, organisaatioid, tyyppi) : undefined
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

    $scope.vuositayttoaste = Math.floor((Math.random() * 100) + 1);

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $state.current.tyyppi === tyyppi;
    };

    $scope.toTab = function toTab(tyyppi) {
      $state.go('app.tunnusluku.syottaminen.' + tyyppi);
    };

    OrganisaatioService.hae().then(
      organisaatiot => $scope.organisaatiot =
        _.filter(organisaatiot,
                 org => _.contains(['KS1', 'KS2', 'ELY'], org.lajitunnus)),
      StatusService.errorHandler);

    $scope.$watchGroup(["vuosi", "organisaatio.id"],
      (id) => loadTunnusluvut(id[0], id[1], $state.current.tyyppi, $scope, TunnuslukuEditService, StatusService));

  }]);
