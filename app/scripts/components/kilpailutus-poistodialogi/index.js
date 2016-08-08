'use strict';

function ModalInstanceCtrl($scope, $uibModalInstance) {
  $scope.ok = function () {
    $uibModalInstance.close($scope.taydennysselite);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];

module.exports = function ($uibModal, KilpailutusService, StatusService, $state) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      kilpailutusid: "<"
    },
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        var modalInstance = $uibModal.open({
          scope: scope,
          template: require('./index.html'),
          controller: ModalInstanceCtrl
        });
        modalInstance.result.then(function (taydennysselite) {
          KilpailutusService.delete(parseInt(scope.kilpailutusid))
            .then(function () {
                StatusService.ok('', 'Kilpailutus poistettu.');
                $state.go('app.kilpailutukset');
              }, StatusService.errorHandler);
        }, function () {
          //Cancel
        });
      });

    }
  };
};

module.exports.$inject = ['$uibModal', 'KilpailutusService', 'StatusService', '$state'];
