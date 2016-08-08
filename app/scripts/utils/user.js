'use strict';

var _ = require('lodash');
var c = require('utils/core');

export function hasPermission(user, permission) {
  return user ? _.includes(user.privileges, permission) : false;
}

export function hasAnyPermission(user, permissions) {
  if (!user) {
    return false;
  }
  return c.isDefinedNotNull(_.find(permissions, p => _.includes(user.privileges, p)));
}

/**
 * Hakija on käyttäjä, jolla on jokin oikeus omiin hakemuksiin.
 */
export function isHakija(user) {
  return hasAnyPermission(user, ['view-oma-hakemus', 'modify-oma-hakemus', 'allekirjoita-oma-hakemus']);
}

/**
 * Käsittelijä on käyttäjä, jolla on hakemuksen käsittely oikeus.
 */
export function isKasittelija(user) {
  return hasPermission(user, 'kasittely-hakemus');
}

export function filterNotLivi(organisaatiot) {
  return _.filter(organisaatiot, org => org.lajitunnus !== 'LV');
}
