module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: `
      <div class="tabs">
        <ng-transclude />
      </div>
    `
  };
};

