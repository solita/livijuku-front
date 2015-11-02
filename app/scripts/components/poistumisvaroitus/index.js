'use strict';

function ModalInstanceCtrl($scope, $uibModalInstance) {
  $scope.poistu = function () {
    $uibModalInstance.close();
  };

  $scope.palaa = function () {
    $uibModalInstance.dismiss('cancel');
  };
}

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];

module.exports = function ($uibModal, $state) {
  return {
    require: '^form',
    link: function (scope, elem, attrs, form) {

      window.onbeforeunload = function () {
        if (form.$dirty) {
        }
      };

      var $stateChangeStartUnbind = scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        if (!form.$dirty || (attrs.jukuPoistumisvaroitus=='false')) {
          return;
        }

        event.preventDefault();

        var modalInstance = $uibModal.open({
          animation: false,
          template: require('./index.html'),
          controller: ModalInstanceCtrl
        });

        modalInstance.result.then(function () {
          //Poistu
          $stateChangeStartUnbind();
          $state.go(toState, toParams);

        }, function () {
          //Palaa tallentamatta
          event.preventDefault();
        });
      });

      scope.$on('$destroy', function () {
        window.onbeforeunload = null;
        $stateChangeStartUnbind();
      });
    }
  };
};

module.exports.$inject = ['$uibModal', '$state'];
