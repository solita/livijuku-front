'use strict';

module.exports = function () {
  return {
    transclude: true,
    replace: true,
    template: `
      <div class="form-row" ng-transclude></div>`
  };
};
