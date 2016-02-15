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

function tyhja(val) {
  return (_.isNaN(val) || _.isNil(val) || (val === ''));
}

function laskeAlue(alue) {
  var annetutArvot = _.omitBy(_.merge(_.omit(alue, 'kustannus'), alue.kustannus), tyhja);
  return Object.keys(annetutArvot).length;
}

function laskeLippuhinta(lippuhinnat) {
  var annetutArvot = _.reject(lippuhinnat, function (n) {
    return ((_.isNaN(n.kausilippuhinta) || _.isNil(n.kausilippuhinta)) && (_.isNaN(n.kertalippuhinta) || _.isNil(n.kertalippuhinta)));
  });
  // Jos yksikin kentta on taytetty, palautetaan 1 piste
  if (annetutArvot.length > 0) return 1;
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
    }
    else {
      pisteet = pisteet + 1;
    }

  });
  return pisteet;
}

export function laskeTayttoaste(tunnusluvut, tyyppi) {
  return Math.round((laske(tunnusluvut)/haeMaksimi(tyyppi))*100);
}

function haeMaksimi(id) {
  return _.find(maksimipisteet, {id: id}).max;
}

const maksimipisteet = [
  {
    id: 'TTYT',
    max: 18
  },
  {
    id: 'BR',
    max: 18
  },
  {
    id: 'KOS',
    max: 18
  },
  {
    id: 'SA',
    max: 18
  },
  {
    id: 'ME',
    max: 18
  }
];


export const viikonpaivaluokat = ['A', 'LA', 'SU'];

export const paastoluokat = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6'];

