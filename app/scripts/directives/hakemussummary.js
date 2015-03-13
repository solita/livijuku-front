'use strict';
angular.module('jukufrontApp')
  .directive('hakemusSummary', function () {
    return {
      scope: {
        hakemus: '=hakemus'
      },
      restrict: 'E',
      templateUrl: 'views/kasittelija/hakemussummary.html'
    };
  }
);
