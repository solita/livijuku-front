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

export const isNotBlank = txt => !isBlank(txt);

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

export function cartesianProduct() {
    return _.reduce(arguments, function(a, b) {
        return _.flatten(_.map(a, function(x) {
            return _.map(b, function(y) {
                return x.concat([y]);
            });
        }));
    }, [ [] ]);
};

/**
 * This is same as lodash property-function except this supports a default value.
 * The default value is used when the value of the property is not defined i.e. isNotDefined === true.
 * The default isNotDefined function is isNullOrDefined other suitable functions are e.g. isBlank, _.isNaN, _.isNull etc.
 */
export function property(path, defaultValue, isNotDefined) {
  var p = _.property(path);
  var isNotDefined = coalesce(isNotDefined, isNullOrUndefined);
  return function(obj) {
    var value = p(obj);
    return isNotDefined(value) ? defaultValue : value;
  };
}
