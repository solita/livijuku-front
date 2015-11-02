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

module.exports = function ($uibModal, HakemusService, StatusService, $state) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      hakemusid: "@",
      tyyppi: "@"
    },
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        var modalInstance = $uibModal.open({
          scope: scope,
          template: require('./index.html'),
          controller: ModalInstanceCtrl
        });
        modalInstance.result.then(function (taydennysselite) {
          HakemusService.taydennyspyynto(parseInt(scope.hakemusid), taydennysselite)
            .then(function () {
              StatusService.ok('HakemusService.taydennyspyynto(' + scope.hakemusid + ',' + taydennysselite + ')', 'Hakemus päivitettiin tädennettäväksi.');
              $state.go('app.yhteinen.hakemukset.list', {
                tyyppi: scope.tyyppi
              });
            }, StatusService.errorHandler);
        }, function () {
          //Cancel
        });
      });

    }
  };
};

module.exports.$inject = ['$uibModal', 'HakemusService', 'StatusService', '$state'];
