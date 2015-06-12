'use strict';

module.exports = function () {
  return {
    transclude: true,
    replace: true,
    template: `
      <div class="form" ng-transclude></div>`
  };
};
