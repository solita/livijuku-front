'use strict';

const transclude = require('utils/transclude');

module.exports.next = function() {
  return transclude({
    replace: false,
    template: `
      <juku-icon-link icon="circle-arrow-right" icon-first="false"></juku-icon-link>
    `
  });
};

module.exports.prev = function() {
  return transclude({
    replace: false,
    template: `
      <juku-icon-link icon="circle-arrow-left"></juku-icon-link>
    `
  });
};

