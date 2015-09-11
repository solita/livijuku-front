'use strict';
/* globals ngModule, inject */

require('test-helpers');
require('../organisaatio');

var assert = require('assert');
var Promise = require('bluebird');

/*
 * Load module
 */

function mockAllOrganisaatioHaku(organisaatiot) {
  inject(function($httpBackend) {
    $httpBackend.when('GET', 'api/organisaatiot').respond(organisaatiot);
  });
}

describe('Organisaatiohaku-palvelut', function() {

  beforeEach(ngModule('services.organisaatio'));

  it('Hae kaikki organisaatiot', function() {

    var organisaatiot = [{id: 1, nimi: "a"}, {id: 2, nimi: "b"}];

    mockAllOrganisaatioHaku(organisaatiot);

    inject(function(OrganisaatioService) {
      OrganisaatioService.hae().then(
        orgs => assert.ok(orgs === organisaatiot, "Virheellinen tulos " + organisaatiot),
        error => assert.fail(error));
    });
  });

  it('Orgnisaatiohaku - byId', function() {

    var organisaatio = {id: 1, nimi: "a"};

    mockAllOrganisaatioHaku([organisaatio, {id: 4, nimi: "foobar"}]);

    inject(function(OrganisaatioService) {
      OrganisaatioService.findById(1).then(
        org => assert.ok(org === organisaatio, "Haku palautti väärän organisaation: " + org),
        error => assert.fail(error));
    });
  });

  it('Orgnisaatiohaku - byId - 404', function() {

    mockAllOrganisaatioHaku([{id: 1, nimi: "a"}, {id: 4, nimi: "foobar"}]);

    inject(function(OrganisaatioService) {
      OrganisaatioService.findById(2).then(
        org => assert.ok(org === undefined, "Haku palautti väärän organisaation: " + org),
        error => assert.fail(error));
    });
  });
});
