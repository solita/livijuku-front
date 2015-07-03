'use strict';
/* globals ngModule, inject */

require('test-helpers');

var assert = require('assert');

/*
 * Load module
 */

require('../auth');

describe('Auth', function() {

  beforeEach(ngModule('services.auth'));

  it('should...', inject(function($rootScope, AuthService) {

    /*
     * Mock rootScope state
     */

    $rootScope.sallittu = function() {
      return true;
    };

    $rootScope.user = {
      organisaatioid: 2
    };

    assert.ok(AuthService.hakijaSaaMuokataHakemusta({
      organisaatioid: 2,
      hakemustilatunnus: 'K'
    }));
  }));
});
