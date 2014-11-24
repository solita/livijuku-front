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
    var getAvustushakemus = function (osasto, vuosi) {
      return $http({method: 'GET', url: '/api/'+osasto+'/'+vuosi+'/avustushakemus/'})
        .then(function (response) {
          return response.data;
        });
    };
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
    var saveAvustushakemus = function (osasto, vuosi, formdata) {
      return $http({method: 'POST', url: '/api/'+osasto+'/'+vuosi+'/tallennaavustushakemus/', data:formdata})
        .then(function (response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getAvustushakemus: function (osasto, vuosi){
        return getAvustushakemus(osasto, vuosi);
      },
      getHakemuksetOsastoAktiiviset: function (osasto){
        return getHakemuksetOsastoAktiiviset(osasto);
      },
      getHakemuksetOsastoVanhat: function (osasto){
        return getHakemuksetOsastoVanhat(osasto);
      },
      saveAvustushakemus: function (osasto, vuosi, formdata){
        return saveAvustushakemus(osasto, vuosi, formdata);
      }
    };
  })
  .factory('Osasto', function ($http) {
    var getOsasto = function (osasto) {
      return $http({method: 'GET', url: '/api/' + osasto + '/tiedot/'})
        .then(function (response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getOsasto: function (osasto) {
        return getOsasto(osasto);
      }
    };
  });
