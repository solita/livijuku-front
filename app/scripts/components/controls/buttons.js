'use strict';

var transclude = require('utils/transclude');

module.exports = function() {
  return transclude({
    template: `<div class="controls__buttons" transclude></div>`
  });
};
