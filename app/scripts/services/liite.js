'use strict';

angular.module('services.liite', [])

  .factory('LiiteService', ['$http', function ($http) {
    return {
      haeKaikki: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid + '/liitteet');
      },
      paivitaNimi: function (hakemusid, liiteid, nimi) {
        var req = {
          method: 'PUT',
          url: 'api/hakemus/' + hakemusid + '/liite/'+liiteid,
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'nimi': nimi
          }
        };
        return $http(req);
      },
      poista: function (hakemusid, liiteid) {
        return $http.delete('api/hakemus/' + hakemusid + '/liite/' + liiteid);
      }
    };
  }]);
