module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      number: '='
    },
    template: `
      <span ng-class="{'badge badge-notify': true, 'is-hidden': number === 0 }">
        {{ number }}
      </div>
    `
  };
};

