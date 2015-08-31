'use strict';

var _ = require('lodash');

export function hakemusSuljettu(hakemus) {
  return (hakemus.hakemustilat.length === 1) &&
         (hakemus.hakemustilat[0].hakemustilatunnus === "S");
}

export function hakemusKaynnissa(hakemus) {
  return (new Date() > new Date(hakemus.hakuaika.alkupvm)) &&
         !hakemusSuljettu(hakemus);
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
