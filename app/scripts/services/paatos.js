'use strict';

angular.module('services.paatos', [])

  .factory('PaatosService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid + '/paatos');
      },
      hyvaksy: function (hakemusid) {
        return $http.post('api/hakemus/' + hakemusid + '/hyvaksy-paatos');
      },
      tallenna: function (hakemusid, paatosdata) {
        var req = {
          method: 'PUT',
          url: 'api/hakemus/' + hakemusid + '/paatos',
          headers: {
            'Content-Type': 'application/json'
          },
          data: paatosdata
        };
        return $http(req);
      }
    };
  }]);
