'use strict';

var angular = require('angular');
angular.module('services.elyhakemus', [])

  .factory('ElyHakemusService', ['$http', function ($http) {
    return {
      haeMaararahatarpeet: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid + '/maararahatarpeet')
          .then(res => res.data);
      },
      tallennaMaararahatarpeet: function (hakemusid, maararahatarpeet) {
        return $http.put('api/hakemus/' + hakemusid + '/maararahatarpeet',maararahatarpeet);
      },
      haeMaararahatarvetyypit: function () {
        return $http.get('api/maararahatarvetyypit')
          .then(res => res.data);
      },
      haeKehityshankkeet: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid + '/kehityshankkeet')
          .then(res => res.data);
      },
      tallennaKehityshankkeet: function (hakemusid, kehityshankkeet) {
        return $http.put('api/hakemus/' + hakemusid + '/kehityshankkeet',kehityshankkeet);
      },
      tallennaElyPerustiedot: function (hakemusid, perustiedot) {
        return $http.put('api/hakemus/' + hakemusid + '/ely',perustiedot);
      }
    };
  }]);
