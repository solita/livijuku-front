'use strict';

angular.module('services.avustuskohde', [])

  .factory('AvustuskohdeService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('/api/hakemus/avustuskohteet/' + hakemusid);
      },
      tallenna: function (avustuskohteet) {
        return $http.put('/api/avustuskohteet', avustuskohteet);
      }
    };
  }]);
