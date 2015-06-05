'use strict';
var angular = require('angular');
angular.module('jukufrontApp')
  .directive('hakemusSummary', function () {
    return {
      scope: {
        hakemus: '=hakemus'
      },
      restrict: 'E',
      template: require('views/kasittelija/hakemussummary.html')
    };
  }
);
