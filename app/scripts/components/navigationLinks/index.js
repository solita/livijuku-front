'use strict';

/*
 * Usage:
 * <juku-navigation-links>
    <juku-link-prev>
      Palaa hakemusten päänäkymään
    </juku-link-prev>
    <juku-link-next>
      Suunnittelu ja päätöksenteko
    </juku-link-next>
 * </juku-navigation-links>
 *
 */

var transclude = require('utils/transclude');

module.exports = function() {
  return transclude({
    template: `<div class="navigation-links" transclude></div>`
  });
};

