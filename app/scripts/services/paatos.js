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
      },
      tallennaPaatokset: function (paatokset) {
        return $http.put('api/paatokset', paatokset);
      },
      hyvaksyElyPaatokset: function (vuosi) {
        return $http.post('api/hakemuskausi/' + vuosi + '/ely/hyvaksy-paatokset');
      },
      haeElyPaatos: function(vuosi) {
        return $http.get('api/hakemuskausi/' + vuosi + '/ely-paatos').then(res => res.data);
      }
    };
  }]);
