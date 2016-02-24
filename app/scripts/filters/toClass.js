
'use strict';

var angular = require('angular');

angular.module('filters.toClass', [])
.filter('toClass', function() {
  return function(bool, className) {
    return bool ? className : '';
  };
});
