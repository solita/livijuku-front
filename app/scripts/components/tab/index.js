module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    scope: {
      selected: '&',
      ely: '&'
    },
    template: `
      <a ui-sref-active="is-selected" ng-class="{'tab is-selected':(selected()&&!ely()),'tab':(!selected()&&!ely()),'tab is-ely-selected':(selected()&&ely()),'tab is-ely':(!selected()&&ely())}">
        <ng-transclude />
      </div>
    `
  };
};

