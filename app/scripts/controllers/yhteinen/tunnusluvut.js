'use strict';

var _ = require('lodash');
var angular = require('angular');

function loadTunnusluvutPromise() {

};

loadTunnusluvutPromise.$inject = [];

angular.module('jukufrontApp')
  .controller('TunnusluvutMuokkausCtrl', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
    $scope.tunnuslukutyypit = ['Taustatiedot ja yl. tunnusluvut', 'PSA_Brutto', 'PSA_KOS', 'Siirtymäajan liikenne', 'ME'];

    $scope.vuositayttoaste = Math.floor((Math.random() * 100) + 1);
    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $state.current.name === 'app.tunnusluku.syottaminen.' + tyyppi;
    };

    $scope.toTab = function toTab(tyyppi) {
      $state.go('app.tunnusluku.syottaminen.' + tyyppi);
    };

    $scope.kunnat = function () {
      if ($rootScope.organisaatiot === undefined) return;
      return _.filter($rootScope.organisaatiot, org => _.contains(['KS1', 'ELY'], org.lajitunnus));
    };
  }]);
