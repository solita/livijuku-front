'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .directive('jkuAvustusluokkaPanel', function () {
    return {
      restrict: 'E',
      scope: {
        name: "@",
        luokka: "=",
        hakemus: "="
      },
      transclude: true,
      templateUrl: 'views/yhteinen/jkuAvustusluokkaPanel.html',
      controller: ["$scope", function ($scope) {
        $scope.sumHaettavaAvustusOverLuokka = function (luokka) {
          return _.sum(luokka.avustuskohteet, 'haettavaavustus');
        };
      }]
    };
  });
