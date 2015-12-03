'use strict';

function ModalInstanceCtrl($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

ModalInstanceCtrl.$inject =  ['$scope', '$modalInstance'];

module.exports = function ($modal) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      operaatio: "&",
      varmistusotsake: "@",
      varmistusteksti: "@",
      varmistusteksti2: "@"
    },
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        var modalInstance = $modal.open({
          scope: scope,
          template: require('./index.html'),
          controller: ModalInstanceCtrl
        });

        modalInstance.result.then(function () {
          scope.operaatio();
        }, function () {
          //Cancel
        });
      });

    }
  };
};

module.exports.$inject = ['$modal'];
