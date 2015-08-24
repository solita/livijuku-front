'use strict';

var angular = require('angular');

angular.module('filters.erotteleRoolit', [])
  .filter('erotteleRoolit', function () {
    return function (roolit) {
      if (typeof roolit == 'undefined') return;
      var roolilista = '';
      (roolit).forEach(function (r) {
        roolilista = roolilista + r + ' ';
      });
      return roolilista;
    };
  });
