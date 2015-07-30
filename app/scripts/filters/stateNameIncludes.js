'use strict';

var angular = require('angular');

angular.module('filters.stateNameIncludes', [])
.filter('stateNameIncludes', ['$state', function($state) {
  const filter = function stateNameIncludes(name, excludedStates) {
    if(excludedStates.indexOf($state.$current.name) > -1) {
      return false;
    }

    return $state.$current.name && $state.$current.name.indexOf(name) > -1;
  };

  filter.$stateful = true;
  return filter;
}]);
