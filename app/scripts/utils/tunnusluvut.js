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

export function laskeTayttoaste(tunnusluvut, tyyppi) {

  var tunnusluvutArray = _.flatMap(tunnusluvut);
 // console.log('array:',tunnusluvutArray);

  /*
  _.forOwn(tunnusluvutArray, function(value, key) {
    console.log('t-value:',value);
   // console.log('non-null', _.compact(_.values(value)));
  });
  */
  return 33;
}

export const viikonpaivaluokat = ['A', 'LA', 'SU'];

export const paastoluokat = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6'];

