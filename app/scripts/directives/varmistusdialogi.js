'use strict';

var angular = require('angular');
angular.module('jukufrontApp')
  .directive('varmistusdialogi', ['$modal',
    function ($modal) {

      var ModalInstanceCtrl = function ($scope, $modalInstance) {
        $scope.ok = function () {
          $modalInstance.close();
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };

      return {
        restrict: 'A',
        scope: {
          operaatio: "&"
        },
        link: function (scope, element, attrs) {
          element.bind('click', function () {
            var varmistusotsake = attrs.varmistusotsake;
            var varmistusteksti = attrs.varmistusteksti;
            var templateHtml = '<div class="modal-header"><b>'+varmistusotsake+'</b></div><div class="modal-body">' + varmistusteksti + '</div>';
            templateHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">Kyllä</button><button class="btn btn-warning" ng-click="cancel()">Ei</button></div>';

            var modalInstance = $modal.open({
              template: templateHtml,
              controller: ModalInstanceCtrl
            });

            modalInstance.result.then(function () {
              scope.operaatio();
            }, function () {
              //Cancel
            });
          });

        }
      }
    }
  ]);
