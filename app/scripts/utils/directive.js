'use strict';

var _ = require('lodash');

/**
 * Template function creates a simple element directive, which consists of a html-template.
 * The template source does not change and shares the same scope, where this directive is used.
 */
export function template(content) {
  return _.constant({
    restrict: 'E',
    scope: false,
    template: content
  });
}
