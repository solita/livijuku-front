'use strict';

var angular = require('angular');

angular.module('services.kayttaja', [])

  .factory('KayttajaService', ['$http', function($http) {

    function createUserPromise() {
      return $http.get('api/user').then(response => response.data);
    }

    function isRejected(promise) {
      return promise.$$state.status === 2
    }

    var user = createUserPromise();

    return {
      hae: function() {
        if (isRejected(user)) {
          user = createUserPromise();
        }
        return user;
      },
      findLiviUsers: function() {
        return $http.get('api/users/livi').then(response => response.data);
      },
      findNonLiviUsers: function() {
        return $http.get('api/users/others').then(response => response.data);
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
        user = $http(req).then(response => response.data);
        return user;
      },
      deleteKayttaja: function (tunnus) {
        return $http.delete('api/user/' + tunnus);
      }
    };
  }]);
