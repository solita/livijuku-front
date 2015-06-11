function transitionLink(opts = {}) {
  return function () {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: `
        <a class="view-link">
          ${opts.content}
        </a>
      `
    };
  };
}

module.exports.next = transitionLink({
  content: `
    <ng-transclude></ng-transclude>
    <span class='glyphicon glyphicon-circle-arrow-right'></span>
  `
});

module.exports.prev = transitionLink({
  content: `
    <span class='glyphicon glyphicon-circle-arrow-left'></span>
    <ng-transclude></ng-transclude>
  `
});

