module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: `
      <div class="navigation">
        <ng-transclude />
      </div>
    `
  };
};

