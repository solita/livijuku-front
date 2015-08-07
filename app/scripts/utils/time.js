'use strict';

export function toISOString(date) {
  return date.toISOString().split('T')[0];
}
