'use strict';

var {extend} = require('lodash');
var u = require('utils/user');

export function restrictRoute(fn, routeConfig) {
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

export function defaultView(user) {
  if(u.isHakija(user)) {
    return 'app.hakija.hakemukset.omat';
  } else if (u.isKasittelija(user)) {
    return 'app.kasittelija.hakemuskaudenhallinta';
  } else {
    return 'app.tunnusluku.syottaminen';
  }
};
