'use strict';

var angular = require('angular');

const types = {
  KS1: 'Suuret kaupunkiseudut',
  KS2: 'Keskisuuret kaupunkiseudut',
  KS3: 'Pienet kaupunkiseudut',
  ELY: 'ELY-keskukset',
  LV: 'Liikennevirasto'
};

angular.module('filters.toApplicantName', [])
  .filter('toApplicantName', function () {
    return function (type) {
      return types[type];
    };
  });
