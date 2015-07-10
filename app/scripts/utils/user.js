'use strict';

function isHakija(user) {
  return user.privileges.indexOf('kasittely-hakemus') === -1;
}

function isKasittelija(user) {
  return !isHakija(user);
}

module.exports.isHakija = isHakija;
module.exports.isKasittelija = isKasittelija;
