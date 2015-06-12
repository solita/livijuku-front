'use strict';

module.exports = function () {
  return {
    transclude: true,
    replace: true,
    template: `
      <div class="form-section" ng-transclude></div>`
  };
};
