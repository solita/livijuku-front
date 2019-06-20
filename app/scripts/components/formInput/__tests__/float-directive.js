'use strict';
/* globals ngModule, inject */

require('test-helpers');

var assert = require('assert');

/*
 * Load module
 */

const f = require('../float-directive');

function assertParseInput(inputValue, expectedValidInput, result, scale, unit, preferredDecimal) {
  const validInput = f.toValidInput(inputValue, unit, preferredDecimal);
  assert.equal(validInput, expectedValidInput);
  assert.equal(f.parseInput(validInput, scale), result);
}

describe('Float only directive', function() {

  it('Parse inputs - invalid characters', function() {

    assertParseInput('1a', '1', 1, 2);
    assertParseInput('1a1', '11', 11, 2);
    assertParseInput('1a1b1', '111', 111, 2);

    assertParseInput('1  1  1  ', '1  1  1  ', 111, 2);

    assertParseInput('1a1a1a', '111a', 111, 2, 'a');
    assertParseInput('1a1a 1a', '11 1a', 111, 2, 'a');
  });

  it('Parse inputs - decimal separator', function() {
    assertParseInput(',', ',', 0, 2);
    assertParseInput(',1', ',1', 0.1, 2);

    assertParseInput('1,1', '1,1', 1.1, 2);
    assertParseInput('1,2,3', '1,23', 1.23, 2);
    assertParseInput('1,2,3', '1,23', 1.23, 2, null, 2);
    assertParseInput('1,2,3', '12,3', 12.3, 2, null, 3);

  });

  it('Parse inputs - rounding', function() {
    assertParseInput('1,005', '1,005', 1.01, 2);
    assertParseInput('1,004', '1,004', 1, 2);
  });
});
