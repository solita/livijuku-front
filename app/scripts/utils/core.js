'use strict';

/**
 * This java script module extends lodash library with some basic common functions.
 */

var _ = require("lodash");

export function second(array) {
  return array[1];
}

/**
 * String is blank if it is only whitespace, null or undefined.
 */
export function isBlank(string) {
  return (isNullOrUndefined(string) || /^\s*$/.test(string));
}

/**
 * Round value to two decimals
 */

export function roundTwoDecimals(number) {
  return Math.round(number*100)/100;
}

/**
 * This function defines the basic idiom in java script to test whether value is defined and it is not null.
 * Note: In java script null and undefined are different values i.e. null !== undefined
 *
 * See:
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined
 * - http://eloquentjavascript.net/01_values.html#h_WAVjYN+DYj
 * - http://stackoverflow.com/questions/4725603/variable-undefined-vs-typeof-variable-undefined
 * - http://stackoverflow.com/questions/27509/detecting-an-undefined-object-property
 */
export function isDefinedNotNull(value) {
  return (value != null);
}

export function isNullOrUndefined(value) {
  return (value == null);
}

var findFirstDefinedValue = _.partialRight(_.find, isDefinedNotNull);

export function coalesce() {
  return findFirstDefinedValue(arguments)
}
