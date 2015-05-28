'use strict';

module.exports = function () {
  return {
    scope: {
      tila: '@'
    },
    template: require('./index.html'),
    restrict: 'E'
  };
};
