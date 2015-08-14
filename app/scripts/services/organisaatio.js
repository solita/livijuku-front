'use strict';

var angular = require('angular');
angular.module('services.organisaatio', [])

  .factory('OrganisaatioService', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('api/organisaatiot').then(res => res.data);
      }
    };
  }]);
