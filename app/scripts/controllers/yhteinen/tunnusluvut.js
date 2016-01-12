'use strict';

var _ = require('lodash');
var angular = require('angular');
var Promise = require('bluebird');

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

function loadTunnusluvut(vuosi, organisaatioid, tyyppi, scope, StatusService, TunnuslukuEditService) {
  Promise.props({
    liikennevuosi: isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeKysyntaTarjonta(vuosi, organisaatioid, tyyppi) : undefined
  }).then(
    tunnusluvut => scope.$evalAsync(scope => scope.tunnusluvut = tunnusluvut),
    StatusService.errorHandler);
}

angular.module('jukufrontApp')
  .controller('TunnusluvutMuokkausCtrl', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {

    $scope.tunnuslukuTyyppiNimi = function(type) {
      return types[type];
    }

    $scope.vuositayttoaste = Math.floor((Math.random() * 100) + 1);

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $state.current.name === 'app.tunnusluku.syottaminen.' + tyyppi;
    };

    $scope.toTab = function toTab(tyyppi) {
      $state.go('app.tunnusluku.syottaminen.' + tyyppi);
    };

    $scope.organisaatiot = function () {
      if ($rootScope.organisaatiot === undefined) return;
      return _.filter($rootScope.organisaatiot, org => _.contains(['KS1', 'KS2', 'ELY'], org.lajitunnus));
    };

  }]);
