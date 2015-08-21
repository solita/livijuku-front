'use strict';

var angular = require('angular');
angular.module('services.paatos', [])

  .factory('PaatosService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid + '/paatos').then(res => res.data);
      },
      hyvaksy: function (hakemusid) {
        return $http.post('api/hakemus/' + hakemusid + '/hyvaksy-paatos');
      },
      peru: function (hakemusid) {
        return $http.post('api/hakemus/' + hakemusid + '/peruuta-paatos');
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
