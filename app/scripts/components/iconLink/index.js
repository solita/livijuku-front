'use strict';
const transclude = require('utils/transclude');
const _ = require('lodash');


function iconLink(opts = {}) {

  const iconFirstCondition = typeof opts.iconFirst === 'undefined' ? 'iconFirst !== false' : opts.iconFirst;
  const iconLastCondition = typeof opts.iconFirst === 'undefined' ? 'iconFirst === false' : !opts.iconFirst;

  return function() {

    return transclude({
      scope: {
        iconFirst: '=',
        icon: '@'
      },
      restrict: 'EA',
      template: `
        <a class="icon-link ${opts.className || ''}">
          <span ng-if="${iconFirstCondition}" class="glyphicon glyphicon-${opts.icon || '{{icon}}'}"></span>
          <span transclude></span>
          <span ng-if="${iconLastCondition}" class="glyphicon glyphicon-${opts.icon || '{{icon}}'}"></span>
        </a>
      `
    });
  };
}

module.exports = iconLink();
module.exports.compose = iconLink;
