'use strict';

function ModalInstanceCtrl($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

ModalInstanceCtrl.$inject =  ['$scope', '$uibModalInstance'];

module.exports = function ($uibModal) {
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
        var modalInstance = $uibModal.open({
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

module.exports.$inject = ['$uibModal'];
