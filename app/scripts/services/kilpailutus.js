'use strict';

var angular = require('angular');
var _ = require('lodash');
var c = require('utils/core');

angular.module('services.kilpailutus', [])

  .factory('KilpailutusService', ['$http', function ($http) {
    return {
      get: function (kilpailutusid) {
        return $http.get('api/kilpailutus/' + kilpailutusid).then(res => res.data);
      },
      find: function () {
        //var organisaatioids = _.map(organizationFilter.organisaatiot, org => "organisaatioid=" + org.id)
        //var query = _.join(organisaatioids, '&');
        //return $http.get('api/kilpailutukset' + (c.isNotBlank(query) ? '?' + query : '')).then(res => res.data);
        return $http.get('api/kilpailutukset').then(res => res.data);
      },
      save: function (kilpailutusid, kilpailutus) {
        return $http.put('api/kilpailutus/' + kilpailutusid, kilpailutus);
      },
      add: function (kilpailutus) {
        return $http.post('api/kilpailutus', kilpailutus);
      },
      delete: function (kilpailutus) {
        return $http.delete('api/kilpailutus', kilpailutus);
      }
    };
  }]);
