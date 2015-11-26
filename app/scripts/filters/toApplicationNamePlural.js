
'use strict';

var angular = require('angular');

const types = {
  AH0: 'Avustushakemukset',
  MH1: '1. maksatushakemukset',
  MH2: '2. maksatushakemukset',
  ELY: 'ELY hakemukset'
};

angular.module('filters.toApplicationNamePlural', [])
.filter('toApplicationNamePlural', function() {
  return function(type) {
    return types[type];
  };
});
