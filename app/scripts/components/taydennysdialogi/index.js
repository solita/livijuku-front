'use strict';

function ModalInstanceCtrl($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close($scope.taydennysselite);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}

ModalInstanceCtrl.$inject = ['$scope', '$modalInstance'];

module.exports = function ($modal, HakemusService, StatusService, $location) {
  return {
    restrict: 'A',
    replace: true,
    scope: {
      hakemusid: "@",
      tyyppi: "@"
    },
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        var modalInstance = $modal.open({
          scope: scope,
          template: require('./index.html'),
          controller: ModalInstanceCtrl
        });
        modalInstance.result.then(function (taydennysselite) {
          HakemusService.taydennyspyynto(parseInt(scope.hakemusid), taydennysselite)
            .success(function () {
              StatusService.ok('HakemusService.taydennyspyynto(' + scope.hakemusid + ',' + taydennysselite + ')', 'Hakemus päivitettiin tädennettäväksi.');
              $location.path('/k/hakemukset/' + scope.tyyppi);
            })
            .error(function (data) {
              StatusService.virhe('HakemusService.taydennyspyynto(' + scope.hakemusid + ',' + taydennysselite + ')', data.message);
            });
        }, function () {
          //Cancel
        });
      });

    }
  };
};

module.exports.$inject = ['$modal', 'HakemusService', 'StatusService', '$location'];
