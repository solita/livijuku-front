
'use strict';

var angular = require('angular');

const types = {
  AH0: 'Avustushakemus',
  MH1: '1. maksatushakemus',
  MH2: '2. maksatushakemus',
  ELY: 'ELY hakemus'
};

angular.module('filters.toApplicationName', [])
.filter('toApplicationName', function() {
  return function(type) {
    return types[type];
  };
});
