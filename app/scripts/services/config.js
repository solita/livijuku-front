'use strict';

var angular = require('angular');
angular.module('services.config', [])

  .factory('ConfigService', ['$http', function ($http) {
    return {
      hae: function () {
        return $http.get('resources/config.json')
          .then(res => res.data);
      }
    };
  }]);
