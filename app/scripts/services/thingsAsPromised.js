'use strict';

/**
 * @ngdoc service
 * @name jukufrontApp.things
 * @description
 * # things
 * Factory in the jukufrontApp.
 */
angular.module('services.thingsAsPromised', [])
  .factory('things', function ($http) {
    var getAll = function() {
      return $http({method: 'GET', url: 'resources/things.json'})
        .then(function(response) {
          return response.data;
        });
    };

    // Public API here
    return {
      getAll: getAll
    };
  });
