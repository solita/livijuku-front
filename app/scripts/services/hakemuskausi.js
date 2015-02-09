'use strict';

angular.module('services.hakemuskausi', [])

  .factory('HakemuskausiService', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('api/hakemuskaudet', {params: {isArray: true}});
      },
      haeHakuohje: function (vuosi) {
        return $http.get('api/hakemuskausi/'+vuosi+'/hakuohje');
      },
      luoUusi: function(vuosi) {
        return $http.post('api/hakemuskausi', {vuosi: vuosi});
      }
    };
  }]);
