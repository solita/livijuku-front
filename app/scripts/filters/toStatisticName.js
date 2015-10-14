
'use strict';

var angular = require('angular');

const types = {
  TTYT: 'Taustatiedot ja yl. tunnusluvut',
  PSAB: 'PSA_Brutto',
  PSAK: 'PSA_KOS',
  SL: 'Siirtymäajan liikenne',
  ME: 'ME'
};

angular.module('filters.toStatisticName', [])
.filter('toStatisticName', function() {
  return function(type) {
    return types[type];
  };
});
