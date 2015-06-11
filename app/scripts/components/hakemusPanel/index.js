'use strict';

function hakemusPanel(opts = {}) {
  return function() {
    return {
      scope: {
        title: '@'
      },
      template: `
        <div class="hakemus-panel panel panel-primary ${opts.className || ''}">
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
