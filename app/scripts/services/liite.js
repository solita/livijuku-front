'use strict';

angular.module('services.liite', [])

  .factory('LiiteService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('/api/hakemus/' + hakemusid + '/liitteet');
      },
      poista: function (hakemusid, liiteid) {
        return $http.delete('/api/hakemus/' + hakemusid + '/liite/' + liiteid);
      }
    };
  }]);
