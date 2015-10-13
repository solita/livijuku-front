'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('HakijaTunnusluvutCtrl', ['$scope', function ($scope) {
    $scope.tunnuslukutyypit =  ['Taustatiedot ja yl. tunnusluvut', 'PSA_Brutto', 'PSA_KOS', 'Siirtymäajan liikenne', 'ME'];

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return 'PSA_Brutto' === tyyppi;
    };
  }]);
