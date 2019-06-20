'use strict';
/* globals ngModule, inject */

require('test-helpers');

var assert = require('assert');

/*
 * Load module
 */

var t = require('../directive');

describe('Directive utility functions', function() {

  it('Format float', function() {

    assert.equal(t.formatFloat(1), '1');
    assert.equal(t.formatFloat(1.1), '1,1');
    assert.equal(t.formatFloat(1111), '1\xa0111');
    assert.equal(t.formatFloat(11111), '11\xa0111');
    assert.equal(t.formatFloat(111111), '111\xa0111');
    assert.equal(t.formatFloat(1111111), '1\xa0111\xa0111');

    assert.equal(t.formatFloat(1111.1), '1\xa0111,1');
    assert.equal(t.formatFloat(1111.11), '1\xa0111,11');
    assert.equal(t.formatFloat(1111.111), '1\xa0111,111');
    assert.equal(t.formatFloat(1111.1111), '1\xa0111,1111');
    assert.equal(t.formatFloat(1111.11111), '1\xa0111,11111');

  });

  it('Format float to fixed decimal', function() {
    assert.equal(t.formatFloatToFixed(1, 1), '1,0');
    assert.equal(t.formatFloatToFixed(2, 1), '1,00');
    assert.equal(t.formatFloatToFixed(3, 1), '1,000');

    assert.equal(t.formatFloatToFixed(2, 1.1), '1,10');
    assert.equal(t.formatFloatToFixed(2, 1111), '1\xa0111,00');
    assert.equal(t.formatFloatToFixed(2, 11111), '11\xa0111,00');
    assert.equal(t.formatFloatToFixed(2, 111111), '111\xa0111,00');
    assert.equal(t.formatFloatToFixed(2, 1111111), '1\xa0111\xa0111,00');

    assert.equal(t.formatFloatToFixed(2, 1111.1), '1\xa0111,10');
    assert.equal(t.formatFloatToFixed(2, 1111.11), '1\xa0111,11');
    assert.equal(t.formatFloatToFixed(2, 1111.111), '1\xa0111,11');
    assert.equal(t.formatFloatToFixed(2, 1111.1111), '1\xa0111,11');
    assert.equal(t.formatFloatToFixed(2, 1111.11111), '1\xa0111,11');


    assert.equal(t.formatFloatToFixed(2, 100.005), '100,01');

  });
});
