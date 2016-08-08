'use strict';

var _ = require('lodash');
var c = require('utils/core');

export function hakemusSuljettu(hakemus) {
  return (hakemus.hakemustilat === undefined) ?
    (hakemus.hakemustilatunnus === "S") :
    (hakemus.hakemustilat.length === 1) &&
    (hakemus.hakemustilat[0].hakemustilatunnus === "S");
}

export function hakemusKaynnissa(hakemus) {
  return (new Date() > new Date(hakemus.hakuaika.alkupvm)) &&
         !hakemusSuljettu(hakemus);
}

export function hakemusHakuaikaAktiivinen(hakemus) {
  return (new Date() > new Date(hakemus.hakuaika.alkupvm));
}

export function haeHakemus(hakemuskausi, tyyppitunnus) {
  return _.find(hakemuskausi.hakemukset, {
    hakemustyyppitunnus: tyyppitunnus
  });
}

export function hakemuksiaYhteensa(hakemus) {
  return _.reduce(hakemus.hakemustilat, (memo, tila) => memo + tila.count, 0);
}
export function hakemuksiaTilassa(hakemus, tila) {
  var hakemusTilassa = _.find(hakemus.hakemustilat, {hakemustilatunnus: tila});
  return hakemusTilassa ? hakemusTilassa.count : 0;
}

export function avustuskohdeRahamaara(property, kohde) {
  if (kohde.includealv) return c.roundTwoDecimals(kohde[property] * (1 + (kohde.alv / 100)));
  else return c.roundTwoDecimals(kohde[property]);
}

/**
 * Hakemustyyppiin liittyvät yleiset predikaatit.
 * Tämä määrittelee hakemustyyppeihin liittyvät vakiopredikaatit, joita käytetään html-templaateissa.
 *
 * Nämä liitetään suoraan scopeen esim.
 * _.extend(scope, hakemustyyppiFlags(hakemustyyppitunnus));
 */
export function hakemustyyppiFlags(hakemustyyppitunnus) {
  return {
    isAvustushakemus: hakemustyyppitunnus === 'AH0',
    isMaksatushakemus1: hakemustyyppitunnus === 'MH1',
    isMaksatushakemus2: hakemustyyppitunnus === 'MH2',
    isELYhakemus: hakemustyyppitunnus === 'ELY',
    isMaksatushakemus: isMaksatushakemus(hakemustyyppitunnus)
  };
}

export function isMaksatushakemus(hakemustyyppitunnus) {
  return _.includes(['MH1', 'MH2'], hakemustyyppitunnus)
}
