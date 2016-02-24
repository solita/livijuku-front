'use strict';

var transclude = require('utils/transclude');

module.exports = function() {
  return transclude({
    template: `<form class="form"></form>`
  });
};
