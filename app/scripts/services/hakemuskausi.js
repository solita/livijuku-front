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
      haeMaararaha: function (vuosi, organisaatiolajitunnus) {
        return $http.get('api/maararaha/'+vuosi+'/'+organisaatiolajitunnus);
      },
      luoUusi: function(vuosi) {
        return $http.post('api/hakemuskausi', {vuosi: vuosi});
      },
      paivitaMaararaha: function (vuosi, organisaatiolajitunnus, maararahadata) {
        var req = {
          method: 'PUT',
          url: 'api/maararaha/'+vuosi+'/'+organisaatiolajitunnus,
          headers: {
            'Content-Type': 'application/json'
          },
          data: maararahadata
        };
        return $http(req);
      }
    };
  }]);
