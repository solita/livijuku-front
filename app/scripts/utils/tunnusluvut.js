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
  if (arvo > 999) return d3.format('.4s')(arvo);
  else return (arvo % 1) === 0 ? arvo : d3.format('.02f')(arvo);
}

export function numberFormatTooltip(arvo) {
  return c.isNullOrUndefined(arvo) ? "Tietoa ei määritetty" :
    (arvo % 1) === 0 ? d3.format(',')(arvo) : d3.format(',.02f')(arvo);
}

export function toOrganisaatioSeriesNvd3(data, organisaatiot) {
  var body = _.tail(data);
  var xdimension = _.uniq(_.map(body, r => r[1]));
  var organisaatiorows = _.values(_.groupBy(body, row => row[0]));

  function augmentNullValues(rows) {
    var oganisaatioid = rows[0][0];
    var groupByX = _.mapValues(_.groupBy(rows, row => row[1]), v => _.first(v));
    return _.map(xdimension, x => groupByX[x] ? groupByX[x] : [oganisaatioid, x, null, null]);
  }
  return _.map(organisaatiorows,
               rows => ({
                key: (_.find(organisaatiot, {id: rows[0][0]})).nimi,
                values: augmentNullValues(rows)
               }));
}

export function missingOrganisaatiot(data, allOrganisaatiot, organisaatiolajitunnus) {

  var organisaatiotInData = _.uniq(_.map(_.tail(data), r => r[0]));

  var organisaatiotInLaji = organisaatiolajitunnus === 'ALL' ?
    _.filter(allOrganisaatiot, org => org.lajitunnus !== 'LV') :
    _.filter(allOrganisaatiot, {lajitunnus: organisaatiolajitunnus});

  return _.filter(organisaatiotInLaji, org => !_.includes(organisaatiotInData, org.id));
}

/**
 * Muuta vuosi+kuukausi (esim. 201601) tieto unix ajanhetkeksi.
 */
export function kuukausiToUTC(vuosikk) {
  var year = parseInt(vuosikk.substring(0, 4));
  var kuukausi = parseInt(vuosikk.substring(4));
  return Date.UTC(year, (kuukausi - 1));
}

/**
 * Lisää organisaatio nimi sarake taulukkomuotoiseen dataan. Datassa organisaatioId on 1. sarake. Nimi tulee 2. sarakkeeksi.
 */
export function addOrganisaationimiColumn(data, organisaatiot) {
  const header = _.clone(_.head(data));

  // Note: splice is a mutating operation
  header.splice(1, 0, 'organisaationimi');

  const body = _.map(_.tail(data), row => {
    var result = _.clone(row);
    result.splice(1, 0, _.find(organisaatiot, {id: row[0]}).nimi);
    return result;
  });

  return _.concat([header], body);
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

