'use strict';

var _ = require('lodash');

export function hakemusKaynnissa(hakemus) {
  return new Date() > new Date(hakemus.hakuaika.alkupvm);
}

export function haeHakemus(hakemuskausi, tyyppitunnus) {
  return _.findWhere(hakemuskausi.hakemukset, {
    hakemustyyppitunnus: tyyppitunnus
  });
}

export function hakemuksiaYhteensa(hakemus) {
  return _.reduce(hakemus.hakemustilat, (memo, tila) => memo + tila.count, 0);
}
export function hakemuksiaTilassa(hakemus, tila) {
  var hakemusTilassa = _.findWhere(hakemus.hakemustilat, {hakemustilatunnus: tila});
  return hakemusTilassa ? hakemusTilassa.count : 0;
}
