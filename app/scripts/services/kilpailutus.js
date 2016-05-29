'use strict';

var angular = require('angular');
var _ = require('lodash');
var c = require('utils/core');

angular.module('services.kilpailutus', [])

  .factory('KilpailutusService', ['$http', function ($http) {
    var sopimusmallitPromise = $http.get('api/kilpailutus/sopimusmallit').then(res => res.data);
    return {
      get: function (kilpailutusid) {
        return $http.get('api/kilpailutus/' + kilpailutusid).then(res => res.data);
      },
      find: function () {
        return $http.get('api/kilpailutukset').then(res => res.data);
      },
      save: function (kilpailutusid, kilpailutus) {
        return $http.put('api/kilpailutus/' + kilpailutusid, kilpailutus);
      },
      add: function (kilpailutus) {
        return $http.post('api/kilpailutus', kilpailutus);
      },
      delete: function (kilpailutusid) {
        return $http.delete('api/kilpailutus/'+ kilpailutusid);
      },
      findSopimusmallit: function () {
        return sopimusmallitPromise;
      }
    };
  }]);
