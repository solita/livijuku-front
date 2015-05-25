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

module.exports = function ($modal, $location) {
  return {
    require: '^form',
    link: function (scope, elem, attrs, form) {

      window.onbeforeunload = function () {
        if (form.$dirty) {
        }
      };

      var $locationChangeStartUnbind = scope.$on('$locationChangeStart', function (event, next, current) {
        var locationpath = $location.path();
        if (!form.$dirty) {
          return
        }
        event.preventDefault();
        var modalInstance = $modal.open({
          animation: false,
          template: require('./index.html'),
          controller: ModalInstanceCtrl
        });
        modalInstance.result.then(function () {
          //Poistu
          $locationChangeStartUnbind();
          $location.path(locationpath);

        }, function () {
          //Palaa tallentamatta
          event.preventDefault();
        });
      });

      scope.$on('$destroy', function () {
        window.onbeforeunload = null;
        $locationChangeStartUnbind();
      });
    }
  };
};

module.exports.$inject = ['$modal', '$location'];
