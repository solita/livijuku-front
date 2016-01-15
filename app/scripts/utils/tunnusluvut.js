'use strict';

var _ = require('lodash');

export function isSopimustyyppi(tunnuslukutyyppi) {
  return _.contains(['BR','KOS','SA','ME'], tunnuslukutyyppi);
}

export function isPSA(tunnuslukutyyppi) {
  return _.contains(['BR','KOS'], tunnuslukutyyppi);
}

export const viikonpaivaluokat = ['A', 'LA', 'SU'];
