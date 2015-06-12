'use strict';

module.exports = function () {
  return {
    transclude: true,
    replace: true,
    template: `
      <form class="form" ng-transclude></form>`
  };
};
