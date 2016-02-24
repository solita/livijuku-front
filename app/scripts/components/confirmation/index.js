'use strict';

var transclude = require('utils/transclude');

module.exports = function() {
  return transclude({
    scope: {
      ngModel: '=',
      ngDisabled: '='
    },
    template: `
      <label class="confirmation">
        <input type="checkbox" ng-model="ngModel" ng-disabled="ngDisabled">
        <span transclude></span>
      </label>
    `
  });
};
