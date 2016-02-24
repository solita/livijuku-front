'use strict';

var _ = require('lodash');
var $ = require('jquery');

module.exports = function transclude(options) {
  return _.extend({
    transclude: true,
    replace: true,
    link(scope, element, attr, controller, transcludeFn) {

      var elem = $(element).find('[transclude]');

      if(elem.length === 0) {
        elem = element;
      }

      if(options.scope) {
        scope = scope.$parent;
      }

      transcludeFn(scope, function (clone) {
        elem.empty().append(clone);
      });
    }
  }, options);
};
