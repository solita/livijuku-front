'use strict';

angular.module('services.hakemuskausi', [])

  .factory('HakemuskausiService', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('api/hakemuskaudet', {params: {isArray: true}});
      },
      luoUusi: function(vuosi) {
        return $http.post('api/hakemuskausi', {vuosi: vuosi});
      }
    };
  }]);
