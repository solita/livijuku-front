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

  beforeEach(function () {
    ngModule(function ($provide) {
      $provide.value('$rootScope', {
        sallittu: function() {
          return true;
        },
        user: {
          organisaatioid: 2
        }
      });
    });
  });

  it('should...', inject(function(AuthService) {
    assert.ok(AuthService.hakijaSaaMuokataHakemusta({
      organisaatioid: 2,
      hakemustilatunnus: 'K'
    }));
  }));
});
