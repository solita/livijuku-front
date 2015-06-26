'use strict';

var transclude = require('utils/transclude');

module.exports = function() {
  return transclude({
    scope: {
      ngModel: '='
    },
    template: `
      <div class="checkbox">
        <label>
          <input type="checkbox" ng-model="ngModel">
          <span transclude></span>
        </label>
      </div>
    `
  });
};
