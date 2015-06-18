'use strict';

var transclude = require('utils/transclude');

module.exports = function() {
  return transclude({
    template: `
      <div class="row ohje">
        <div class="col-md-12" transclude>
        </div>
      </div>`
  });
};
