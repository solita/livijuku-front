'use strict';

/**
 * @ngdoc service
 * @name jukufrontApp.dataApi
 * @description
 * # dataApi
 * Factory in the jukufrontApp.
 */
angular.module('services.dataApi', [])
  .factory('HakemuksetOsasto', function ($http) {
    var getHakemuksetOsastoAktiiviset = function (osasto) {
      return $http({method: 'GET', url: '/api/'+osasto+'/aktiivisethakemukset/'})
        .then(function (response) {
          return response.data;
        });
    };
    var getHakemuksetOsastoVanhat = function (osasto) {
      return $http({method: 'GET', url: '/api/'+osasto+'/vanhathakemukset/'})
        .then(function (response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getHakemuksetOsastoAktiiviset: function (osasto){
        return getHakemuksetOsastoAktiiviset(osasto);
      },
      getHakemuksetOsastoVanhat: function (osasto){
        return getHakemuksetOsastoVanhat(osasto);
      }
    };
  });
