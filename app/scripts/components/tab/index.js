module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    scope: {
      selected: '&'
    },
    template: `
      <a ui-sref-active="is-selected" ng-class="selected() ? 'tab is-selected' : 'tab'">
        <ng-transclude />
      </div>
    `
  };
};

