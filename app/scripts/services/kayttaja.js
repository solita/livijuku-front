'use strict';

var angular = require('angular');
angular.module('services.kayttaja', [])

  .factory('KayttajaService', ['$http', '$q',
    function($http, $q) {
    var getPromise = null;
    var user = null;

    return {
      hae: function() {
        if (getPromise) {
          return getPromise;
        }

        if (user) {
          return $q.when(user);
        }

        getPromise = $http.get('api/user')
          .then((res) => {
            user = res.data;
            return user;
          })
          .catch((err) => {
            user = null
            throw err;
          })
          .finally(() => {
            getPromise = null
          });

        return getPromise;
      },
      haeKaikki: function() {
        return $http.get('api/users');
      },
      paivitaSahkopostiviestit: function(sahkopostiviestit) {
        var req = {
          method: 'PUT',
          url: 'api/user',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            'sahkopostiviestit': sahkopostiviestit
          }
        };
        getPromise = null;
        user = null;
        return $http(req);
      }
    };
  }]);
