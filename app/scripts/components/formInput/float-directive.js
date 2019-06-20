'use strict';
import * as c from 'utils/core';
import * as d from 'utils/directive';
import * as _ from 'lodash';

const removeInvalidChars = txt => _.replace(txt, /[^\d\s]/g, '');
const removeSpace = txt => _.replace(txt, /\s/g, '');

function join(parts, separator) {
  return _.join(_.filter(parts, c.isNotBlank), separator);
}

function split(inputValue, preferredPointPosition) {
  const position = inputValue[preferredPointPosition] === ',' ?
    preferredPointPosition : _.indexOf(inputValue, ',');

  return position > -1 ?
    [inputValue.substring(0, position), inputValue.substring(position)] :
    [inputValue];
}

/**
 * Removes all invalid characters from user input. Allowed characters:
 * - only one decimal separator
 * - unit symbol in the end of the input
 * - number characters
 *
 * @param inputValue
 * @param unit
 * @param preferredPointPosition
 *  All other decimal separator are removed except in this preferred position.
 *  If preferred position does not contain decimal separator then the first separator is preserved.
 * @returns {string}
 */
export function toValidInput(inputValue, unit, preferredPointPosition) {
  const parts = _.map(split(inputValue, preferredPointPosition), removeInvalidChars);

  return _.join(parts, ',') +
    (_.endsWith(_.trim(inputValue), unit) ? unit : '');
}

/**
 * Parse number from a valid input.
 * @param validInput
 * @param scale number is rounded to
 * @returns {number}
 */
export function parseInput(validInput, scale) {
  const v1 = removeSpace(validInput);
  const v2 = _.startsWith(v1, ',') ? '0' + v1 : v1;
  const result = parseFloat(_.replace(v2, /\,/g, '.'));
  return _.isFinite(result) ? _.round(result, scale) : undefined;
}

export const format = (number, scale, unit) => c.isDefinedNotNull(number) ?
  join([d.formatFloatToFixed(scale, number), unit], '\xa0') : '';
