'use strict';

var _ = require('lodash');

export function isSopimustyyppi(tunnuslukutyyppi) {
  return _.includes(['BR', 'KOS', 'SA', 'ME'], tunnuslukutyyppi);
}

export function isLipputuloSopimustyyppi(tunnuslukutyyppi) {
  return _.includes(['BR', 'KOS', 'SA'], tunnuslukutyyppi);
}

export function isPSA(tunnuslukutyyppi) {
  return _.includes(['BR', 'KOS'], tunnuslukutyyppi);
}

export const viikonpaivaluokat = ['A', 'LA', 'SU'];

export const paastoluokat = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6'];

/* Progress bar laskenta */

export function laskeTayttoaste(tunnusluvut, tyyppi) {
  return Math.round((laske(tunnusluvut) / maksimipisteet[tyyppi]) * 100);
}

export function laskeTayttoasteType(tunnusluvut, tyyppi) {
  var tayttoaste = laskeTayttoaste(tunnusluvut, tyyppi);
  if (tayttoaste > 80) return 'success';
  else if (tayttoaste > 20) return 'warning';
  else return 'danger';
}
const maksimipisteet = {
  TTYT: 17,
  BR: 94,
  KOS: 106,
  SA: 60,
  ME: 48
};

function tyhja(val) {
  return (_.isNaN(val) || _.isNil(val) || (val === ''));
}

function laskeAlue(alue) {
  var annetutArvot = _.omitBy(_.merge(_.omit(alue, ['kustannus', 'kommentti']), alue.kustannus), tyhja);
  return _.size(annetutArvot);
}

function laskeLippuhinta(lippuhinnat) {
  var annetutArvot = _.reject(lippuhinnat, function (n) {
    return (tyhja(n.kausilippuhinta) && tyhja(n.kertalippuhinta));
  });
  // Jos yksikin kentta on taytetty, palautetaan 1 piste
  if (_.size(annetutArvot) > 0) return 1;
  else return 0;
}

function laskeLiikenteenKysyntaJaTarjonta(arvot) {
  var annetutArvot = _.reject(_.concat(_.map(arvot, 'lahdot'), _.map(arvot, 'linjakilometrit'), _.map(arvot, 'nousut')), tyhja);
  return _.size(annetutArvot);
}

function laskeLiikennointikorvaus(arvot) {
  var annetutArvot = _.reject(_.concat(_.map(arvot, 'korvaus'), _.map(arvot, 'nousukorvaus'), _.map(arvot, 'nousut')), tyhja);
  return _.size(annetutArvot);
}

function laskeLipputulo(arvot) {
  var annetutArvot = _.reject(_.concat(_.map(arvot, 'arvolipputulo'), _.map(arvot, 'kausilipputulo'), _.map(arvot, 'kertalipputulo'), _.map(arvot, 'lipputulo')), tyhja);
  return _.size(annetutArvot);
}

function laskeKalusto(arvot) {
  var annetutArvot = _.reject(_.map(arvot, 'lukumaara'), tyhja);
  // Jos yksikin kentta on taytetty, palautetaan 1 piste
  if (_.size(annetutArvot) > 0) return 1;
  else return 0;
}


function laske(arvot) {
  var pisteet = 0;
  _.pickBy(arvot, function (value, key) {
    if (_.isNil(value)) return;
    else if (key === 'alue') {
      pisteet = pisteet + laskeAlue(value);
    } else if (key === 'lippuhinta') {
      pisteet = pisteet + laskeLippuhinta(value);
    } else if ((key === 'liikenneviikko') || (key === 'liikennevuosi')) {
      pisteet = pisteet + laskeLiikenteenKysyntaJaTarjonta(value);
    } else if (key === 'kalusto') {
      pisteet = pisteet + laskeKalusto(value);
    } else if (key === 'liikennointikorvaus') {
      pisteet = pisteet + laskeLiikennointikorvaus(value);
    } else if (key === 'lipputulo') {
      pisteet = pisteet + laskeLipputulo(value);
    }
  });
  return pisteet;
}

