'use strict';

var _ = require('lodash');

export function isSopimustyyppi(tunnuslukutyyppi) {
  return _.contains(['BR', 'KOS', 'SA', 'ME'], tunnuslukutyyppi);
}

export function isLipputuloSopimustyyppi(tunnuslukutyyppi) {
  return _.contains(['BR', 'KOS', 'SA'], tunnuslukutyyppi);
}

export function isPSA(tunnuslukutyyppi) {
  return _.contains(['BR', 'KOS'], tunnuslukutyyppi);
}

export const viikonpaivaluokat = ['A', 'LA', 'SU'];

export const paastoluokat = ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6'];

