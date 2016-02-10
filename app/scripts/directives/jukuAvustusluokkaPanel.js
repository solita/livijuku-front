'use strict';

var _ = require('lodash');
var angular = require('angular');
var h = require('utils/hakemus');

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
          return _.sumBy(kohteet, _.partial(h.avustuskohdeRahamaara, 'omarahoitus'));
        };

        $scope.kokonaisHaettavaAvustus = function (kohteet) {
          return _.sumBy(kohteet, _.partial(h.avustuskohdeRahamaara, 'haettavaavustus'));
        };

      }]
    };
  });
