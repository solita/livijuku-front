'use strict';

angular.module('services.kayttaja', [])

  .factory('KayttajaFactory', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('/api/user', {params: {isArray: false}});
      }
    };
  }]);
