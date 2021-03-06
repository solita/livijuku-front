'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('services.seuranta', [])

  .factory('LiikenneSuoriteService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid + '/liikennesuoritteet').then(res => res.data);
      },
      suoritetyypit: function () {
        return $http.get('api/suoritetyypit').then(res => res.data);
      },
      tallenna: function (hakemusid, suoritteet) {
        return $http.put('api/hakemus/' + hakemusid + '/liikennesuoritteet', suoritteet);
      }
    };
  }])
  .factory('LippuSuoriteService', ['$http', function ($http) {
    return {
      hae: function (hakemusid) {
        return $http.get('api/hakemus/' + hakemusid + '/lippusuoritteet').then(res => res.data);
      },
      lipputyypit: function () {
        return $http.get('api/lipputyypit').then(res => _.reject(res.data, ['tunnus', "SE"]));
      },
      tallenna: function (hakemusid, suoritteet) {
        return $http.put('api/hakemus/' + hakemusid + '/lippusuoritteet', suoritteet);
      }
    };
  }]);
