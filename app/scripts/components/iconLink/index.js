'use strict';
const transclude = require('utils/transclude');

module.exports = function () {
  return transclude({
    scope: {
      iconFirst: '=',
      icon: '@'
    },
    restrict: 'EA',
    template: `
      <a class="icon-link">
        <span ng-if="iconFirst !== false" class="glyphicon glyphicon-{{icon}}"></span>
        <span transclude></span>
        <span ng-if="iconFirst === false" class="glyphicon glyphicon-{{icon}}"></span>
      </a>
    `
  });
};

