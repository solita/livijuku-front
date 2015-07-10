'use strict';

var {extend} = require('lodash');
var {isHakija} = require('utils/user');

module.exports.restrictRoute = function restrictRoute(fn, routeConfig) {
  return extend({}, routeConfig, {
    resolve: {
      hasPermission: ['KayttajaService', '$q', function(KayttajaService) {
        return KayttajaService.hae().then(function(user) {
          if(!fn(user)) {
            throw new Error('Forbidden');
          }
        });
      }]
    }
  });
};

module.exports.defaultView = function defaultView(user) {
  if(isHakija(user)) {
    return '/h/hakemukset';
  }
  return '/k/hakemuskaudenhallinta';
};