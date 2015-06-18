'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    template: `
      <div class="footer navbar">
        <div class="container">
          <div class="col-xs-8">
            <img src="images/juku_logo.svg" class="logo">
            <span>${__VERSION__}</span>
          </div>
          <div class="col-xs-4 footer__domain">
            Liikennevirasto
          </div>
        </div>
      </div>
    `,
    replace: true
  };
};
