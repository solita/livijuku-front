'use strict';

var _ = require('lodash');

module.exports = function transclude(options) {
  return _.extend({
    transclude: true,
    replace: true,
    link(scope, element, attr, controller, transcludeFn) {
      transcludeFn(scope, function (clone) {
        element.empty().append(clone);
      });
    }
  }, options);
};
