'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('HakijaTunnusluvutCtrl', ['$rootScope', '$scope', '$state', function ($rootScope, $scope, $state) {
    $scope.tunnuslukutyypit = ['Taustatiedot ja yl. tunnusluvut', 'PSA_Brutto', 'PSA_KOS', 'Siirtymäajan liikenne', 'ME'];

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $state.current.name === 'app.hakija.tunnusluku.syottaminen.' + tyyppi;
    };

    $scope.toTab = function toTab(tyyppi) {
      $state.go('app.hakija.tunnusluku.syottaminen.' + tyyppi);
    };

    $scope.kunnat = ['Helsingin seudun liikenne', 'Hämeenlinna', 'Joensuu', 'Jyväskylä', 'Kotka', 'Kouvola', 'Kuopio', 'Lahti', 'Lappeenranta', 'Oulu', 'Pori', 'Tampere', 'Turku', 'Vaasa'];

  }]);
