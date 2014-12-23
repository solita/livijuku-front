'use strict';

angular.module('services.organisaatio', [])

  .factory('OrganisaatioFactory', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('/api/organisaatiot');
      }
    };
  }]);
