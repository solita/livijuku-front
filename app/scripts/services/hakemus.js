'use strict';

var angular = require('angular');
angular.module('services.hakemus', [])

  .factory('HakemusService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid)
          .then(res => res.data);
      },
      lahetaHakemus: function (hakemusid) {
        return $http.post('api/hakemus/' + hakemusid +'/laheta');
      },
      lahetaTaydennys: function (hakemusid) {
        return $http.post('api/hakemus/' + hakemusid +'/laheta-taydennys');
      },
      tarkastaHakemus: function (hakemusid) {
        return $http.post('api/hakemus/' + hakemusid +'/tarkasta');
      },
      taydennyspyynto: function (hakemusid, selite) {
        return $http.post('api/hakemus/' + hakemusid +'/taydennyspyynto', {selite: (selite ? selite : null)});
      }
    };
  }]);
