'use strict';

var angular = require('angular');
angular.module('services.suunnittelu', [])

  .factory('SuunnitteluService', ['$http', function ($http) {
    return {
      hae: function (vuosi, hakemustyyppitunnus) {
        return $http.get('api/hakemussuunnitelmat/'+vuosi+'/'+hakemustyyppitunnus, {params: {isArray: true}});
      },
      suunniteltuAvustus: function (suunniteltuavustus, hakemusid) {
        return $http.put('api/hakemus/' + hakemusid +'/suunniteltuavustus', {'suunniteltuavustus': suunniteltuavustus});
      }
    };
  }]);
