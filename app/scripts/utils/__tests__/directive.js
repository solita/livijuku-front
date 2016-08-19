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
    assert.equal(t.formatFloat(1111), '1 111');
    assert.equal(t.formatFloat(11111), '11 111');
    assert.equal(t.formatFloat(111111), '111 111');
    assert.equal(t.formatFloat(1111111), '1 111 111');

    assert.equal(t.formatFloat(1111.1), '1 111,1');
    assert.equal(t.formatFloat(1111.11), '1 111,11');
    assert.equal(t.formatFloat(1111.111), '1 111,111');
    assert.equal(t.formatFloat(1111.1111), '1 111,1111');
    assert.equal(t.formatFloat(1111.11111), '1 111,11111');

  });
});
