'use strict';

var angular = require('angular');
angular.module('services.hakemuskausi', [])

  .factory('HakemuskausiService', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('api/hakemuskaudet', {params: {isArray: true}})
          .then(res => res.data);
      },
      haeOmat: function () {
        return $http.get('api/hakemuskaudet/omat')
          .then(res => res.data);
      },
      haeSummary: function () {
        return $http.get('api/hakemuskaudet/yhteenveto', {params: {isArray: true}})
          .then(res => res.data);
      },
      haeHakuohje: function (vuosi) {
        return $http.get('api/hakemuskausi/'+vuosi+'/hakuohje');
      },
      haeMaararaha: function (vuosi, organisaatiolajitunnus) {
        return $http.get('api/maararaha/'+vuosi+'/'+organisaatiolajitunnus);
      },
      luoUusi: function(vuosi) {
        return $http.post('api/hakemuskausi', {vuosi: vuosi})
          .then(res => res.data);
      },
      saveHakuajat: function(vuosi, hakuajat) {
        return $http.put('api/hakemuskausi/' + vuosi + '/hakuajat', hakuajat)
          .then(res => res.data);
      },
      sulje: function(vuosi) {
        return $http.post('api/hakemuskausi/' + vuosi + '/sulje');
      },
      paivitaMaararaha: function (vuosi, organisaatiolajitunnus, maararahadata) {
        var req = {
          method: 'PUT',
          url: 'api/maararaha/'+vuosi+'/'+organisaatiolajitunnus,
          headers: {
            'Content-Type': 'application/json'
          },
          data: maararahadata
        };
        return $http(req);
      }
    };
  }]);
