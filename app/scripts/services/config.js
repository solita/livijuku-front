'use strict';

var angular = require('angular');
angular.module('services.config', [])

  .factory('ConfigService', ['$http', '$q', function ($http, $q) {
    return {
      hae: function () {
        var defaultFrontConfig = {
          "logoutUrl": "#/",
          "environmentName": ""
        };
        if (process.env.NODE_ENV !== 'production') {
          return $q.when(defaultFrontConfig);
        }
        return $http.get('resources/config.json', {cache: true})
          .then(res => res.data);
      }
    };
  }]);
