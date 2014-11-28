'use strict';

/**
 * @ngdoc service
 * @name jukufrontApp.things
 * @description
 * # things
 * Factory in the jukufrontApp.
 */
angular.module('services.thingsFromServer', [])
  .factory('things', function ($http) {
    var getAll = function() {
      var result = [];
      $http({method: 'GET', url: 'resources/things.json'})
        .success(function(data) {
          _.assign(result, data);
        });
      return result;
    };

    // Public API here
    return {
      getAll: getAll
    };
  });
