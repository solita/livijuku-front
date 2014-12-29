'use strict';

angular.module('services.kayttaja', [])

  .factory('KayttajaService', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('/api/user', {params: {isArray: false}});
      }
    };
  }]);
