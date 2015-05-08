'use strict';

var _ = require('lodash');

angular.module('services.auth', [])
  .factory('AuthService', ['$rootScope', function ($rootScope) {
    return {
      hakijaSaaMuokataHakemusta: function (hakemus) {
        return $rootScope.sallittu('modify-oma-hakemus') &&
          $rootScope.user.organisaatioid===hakemus.organisaatioid &&
          _.includes(['K','T0'],hakemus.hakemustilatunnus);
      }
    }
  }]);
