'use strict';

var angular = require('angular');
var _ = require('lodash');

angular.module('services.organisaatio', [])

  .factory('OrganisaatioService', ['$http', function ($http) {
    var organisaatiotPromise = $http.get('api/organisaatiot').then(res => res.data);

    return {
      hae: function () {
        return organisaatiotPromise;
      },
      findById(id) {
        return organisaatiotPromise.then(organisaatiot => _.find(organisaatiot, {id: id}));
      }
    };
  }]);
