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
    var getHakemuksetOsastoAktiiviset = function () {
      return $http({method: 'GET', url: 'resources/hakemuksetOsastoAktiiviset.json'})
        .then(function (response) {
          return response.data;
        });
    };
    var getHakemuksetOsastoVanhat = function () {
      return $http({method: 'GET', url: 'resources/hakemuksetOsastoVanhat.json'})
        .then(function (response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getHakemuksetOsastoAktiiviset: getHakemuksetOsastoAktiiviset,
      getHakemuksetOsastoVanhat: getHakemuksetOsastoVanhat
    };
  });
