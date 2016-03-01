'use strict';

var _ = require('lodash');
var c = require('utils/core');

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

export const organisaatiolajit = {
  ALL: 'Kaikki organisaatiot',
  KS1: 'Suuret kaupunkiseudut',
  KS2: 'Keskisuuret kaupunkiseudut',
  KS3: 'Pienet kaupunkiseudut',
  ELY: 'ELY-keskukset',
  $order: ['ALL', 'KS1', 'KS2', 'KS3', 'ELY'],
  $nimi: id => organisaatiolajit[id],
  $id: "organisaatiolajitunnus"
};

export function numberFormat(arvo) {
  if (arvo >= 1000000) return (d3.format('.02f')(arvo / 1000000) + ' M');
  else if ((arvo <= 10) && (arvo % 1 !== 0)) return d3.format('.02f')(arvo);
  return arvo;
}

/* Progress bar laskenta */

export function laskeTayttoaste(tunnusluvut, tyyppi) {
  return Math.round(100 * laske(tunnusluvut) / (maksimipisteet[tyyppi] + joukkoliikennetukipisteet(tunnusluvut)));
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

function joukkoliikennetukipisteet(tunnusluvut) {
  return tunnusluvut.joukkoliikennetuki ? 3 : 0;
}

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

function laskeJoukkoliikennetuki(joukkoliikennetuki) {
  return _.size(_.omitBy(joukkoliikennetuki, tyhja));
}

const pistelaskenta = {
  alue: laskeAlue,
  lippuhinta: laskeLippuhinta,
  joukkoliikennetuki: laskeJoukkoliikennetuki,
  liikenneviikko: laskeLiikenteenKysyntaJaTarjonta,
  liikennevuosi: laskeLiikenteenKysyntaJaTarjonta,
  kalusto: laskeKalusto,
  liikennointikorvaus: laskeLiikennointikorvaus,
  lipputulo: laskeLipputulo
};

function laske(tunnusluvut) {
  return _.reduce(tunnusluvut, function (pisteet, value, key) {
    var laskenta = c.coalesce(pistelaskenta[key], v => 0);
    return pisteet + (value ? laskenta(value) : 0);
  }, 0);
}

