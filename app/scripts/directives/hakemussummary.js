'use strict';
angular.module('jukufrontApp')
  .directive('hakemusSummary', function () {
    return {
      scope: {
        hakemus: '=hakemus'
      },
      restrict: 'E',
      templateUrl: 'scripts/directives/hakemussummary.html'
    };
  }
);
