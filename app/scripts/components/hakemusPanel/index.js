'use strict';

function hakemusPanel(opts = {}) {
  return function() {
    return {
      scope: {
        title: '@',
        inactive: '='
      },
      template: `
        <div ng-class="{'hakemus-panel panel panel-primary ${opts.className || ''}': true, 'not-active': inactive}">
          <div class="panel-heading">
            <p class="panel-title">{{ title }}</p>
          </div>
          <div class="panel-body" ng-transclude></div>
        </div>
      `,
      restrict: 'E',
      replace: true,
      transclude: true
    };
  };
}

module.exports = hakemusPanel();
module.exports.compose = hakemusPanel;
