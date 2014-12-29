'use strict';

angular.module('services.hakemus', [])

  .factory('HakemusService', ['$http', function ($http) {
    return {
      haeKaikki: function () {
        return $http.get('/api/hakemukset/hakija', {params: {isArray: true}});
      },
      hae: function (hakemusid) {
        return $http.get('/api/hakemus/' + hakemusid);
      },
      tallennaSelite: function (selitedata) {
        var req = {
          method: 'PUT',
          url: '/api/hakemus/selite',
          headers: {
            'Content-Type': 'application/json'
          },
          data: selitedata
        };
        return $http(req);
      },
      laheta: function (hakemusid) {
        return $http.post('/api/laheta-hakemus', {'hakemusid': hakemusid});
      },
      tarkasta: function (hakemusid) {
        return $http.post('/api/tarkasta-hakemus', {'hakemusid': hakemusid});
      }
    };
  }]);
