'use strict';

export function toISOString(date) {
  return date.toISOString().split('T')[0];
}

export function toUTCTimestamp(date_string) {
  return new Date(Date.parse(date_string+'T00:00:00Z'))
}

export function convertDateToUTC(d) {
  // TODO datepicker fix, should be removed when datepicker works ok
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()+1, 0, 0, 0);
}

export function getUTCDateTimestamp() {
  var now = new Date();
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
}
