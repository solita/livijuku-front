'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .directive('jukuAvustusluokkaPanel', function () {
    return {
      restrict: 'E',
      scope: {
        name: "@",
        luokka: "=",
        hakemus: "="
      },
      transclude: true,
      template: require('views/yhteinen/jkuAvustusluokkaPanel.html'),
      controller: ["$scope", function ($scope) {
        $scope.sumHaettavaAvustusOverLuokka = function (luokka) {
          return _.sum(luokka.avustuskohteet, 'haettavaavustus');
        };
      }]
    };
  });
