
'use strict';

var angular = require('angular');

const types = {
  TTYT: 'Taustatiedot ja yl. tunnusluvut',
  PSAB: 'PSA Brutto',
  PSAK: 'PSA KOS',
  SL: 'Siirtymäajan liikenne',
  ME: 'ME liikenne'
};

angular.module('filters.toStatisticName', [])
.filter('toStatisticName', function() {
  return function(type) {
    return types[type];
  };
});
