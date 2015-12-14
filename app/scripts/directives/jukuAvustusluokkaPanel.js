'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .directive('jukuAvustusluokkaPanel', function () {
    return {
      restrict: 'E',
      scope: {
        name: '@',
        luokka: '=',
        kohde: '=',
        hakemus: '='
      },
      transclude: true,
      template: require('views/yhteinen/jkuAvustusluokkaPanel.html'),
      controller: ['$scope', function ($scope) {

        $scope.kokonaisOmarahoitus = function (kohteet) {
          return _.sum(kohteet, function (kohde) {
            if (kohde.includealv) return (kohde.omarahoitus * (1 + (kohde.alv / 100))).toFixed(2);
            else return kohde.omarahoitus;
          });
        };

        $scope.kokonaisHaettavaAvustus = function (kohteet) {
          return _.sum(kohteet, function (kohde) {
            if (kohde.includealv) return (kohde.haettavaavustus * (1 + (kohde.alv / 100))).toFixed(2);
            else return kohde.haettavaavustus;
          });
        };

      }]
    };
  });
