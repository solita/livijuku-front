'use strict';

function ModalInstanceCtrl($scope, $modalInstance) {
  $scope.poistu = function () {
    $modalInstance.close();
  };

  $scope.palaa = function () {
    $modalInstance.dismiss('cancel');
  };
}

ModalInstanceCtrl.$inject = ['$scope', '$modalInstance'];

module.exports = function ($modal, $state) {
  return {
    require: '^form',
    link: function (scope, elem, attrs, form) {

      window.onbeforeunload = function () {
        if (form.$dirty) {
        }
      };

      var $stateChangeStartUnbind = scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

        if (!form.$dirty) {
          return;
        }

        event.preventDefault();

        var modalInstance = $modal.open({
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

module.exports.$inject = ['$modal', '$state'];
