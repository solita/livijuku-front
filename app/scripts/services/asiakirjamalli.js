'use strict';

import * as angular from 'angular';

angular.module('services.asiakirjamalli', [])
  .factory('AsiakirjamalliService', ['$http', $http => ({
      findAll: () => $http.get('api/asiakirjamallit').then(response => response.data),
      findById: (id) => $http.get('api/asiakirjamalli/' + id).then(response => response.data),
      save: (id, asiakirjamalli) => $http.put('api/asiakirjamalli/' + id, asiakirjamalli),
      add: asiakirjamalli => $http.post('api/asiakirjamalli', asiakirjamalli)
    })]);
