'use strict';

var angular = require('angular');
angular.module('services.hakemus', [])

  .factory('HakemusService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid)
          .then(res => res.data);
      },
      tallennaSelite: function (selitedata) {
        var req = {
          method: 'PUT',
          url: 'api/hakemus/selite',
          headers: {
            'Content-Type': 'application/json'
          },
          data: selitedata
        };
        return $http(req);
      },
      lahetaHakemus: function (hakemusid) {
        return $http.post('api/laheta-hakemus', {'hakemusid': hakemusid});
      },
      lahetaTaydennys: function (hakemusid) {
        return $http.post('api/laheta-taydennys', {'hakemusid': hakemusid});
      },
      tarkastaHakemus: function (hakemusid) {
        return $http.post('api/tarkasta-hakemus', {'hakemusid': hakemusid});
      },
      tarkastaTaydennys: function (hakemusid) {
        return $http.post('api/tarkasta-taydennys', {'hakemusid': hakemusid});
      },
      taydennyspyynto: function (hakemusid, selite) {
        return $http.post('api/taydennyspyynto', {'hakemusid': hakemusid, 'selite': selite});
      }
    };
  }]);
