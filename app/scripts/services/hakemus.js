'use strict';

angular.module('services.hakemus', [])

  .factory('HakemusFactory', ['$http', function ($http) {
    return {
      haeKaikki: function () {
        return $http.get('/api/hakemukset/hakija', {params: {isArray: true}});
      },
      hae: function (hakemusid) {
        return $http.get('/api/hakemus/' + hakemusid);
      },
      tallennaSelite: function (selitedata) {
        var req = {
          method: 'PUT',
          url: '/api/hakemus/selite',
          headers: {
            'Content-Type': 'application/json'
          },
          data: selitedata
        };
        return $http(req);
      },
      laheta: function (hakemusid) {
        return $http.post('/api/laheta-hakemus', {'hakemusid': hakemusid});
      },
      tarkasta: function (hakemusid) {
        return $http.post('/api/tarkasta-hakemus', {'hakemusid': hakemusid});
      }
    };
  }]);

/*
 .factory('HakemusFactory', function ($resource) {
 return $resource('/api/hakemukset/hakija', {}, {
 get: {url: '/api/hakemus/:id', method: 'GET', params: {}, isArray: false},
 query: {method: 'GET', params: {id: '@id'}, isArray: true},
 update: {
 url: '/api/hakemus/selite',
 method: 'PUT',
 params: {},
 data: '@selitedata',
 headers: {'Content-Type': 'application/json'}
 },
 laheta: {
 url: '/api/laheta-hakemus',
 method: 'POST',
 data: {hakemusid: '@hakemusid'}
 },
 tarkasta: {
 url: '/api/tarkasta-hakemus',
 method: 'POST',
 data: {hakemusid: '@hakemusid'}
 }
 */
