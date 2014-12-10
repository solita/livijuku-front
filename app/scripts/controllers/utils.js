'use strict';
/**
 * @ngdoc function
 * @name jukufrontApp.controller:UtilCtrl
 * @description
 * # UtilCtrl
 * Controller of the jukufrontApp. Contains misc functions
 * */
angular.module('jukufrontApp')
  .controller('UtilCtrl', function ($scope, $rootScope, $location, Organisaatiot) {
    $scope.isActive = function (route) {
      return route === $location.path();
    };
    Organisaatiot.getOrganisaatiot()
      .then(function (data) {
        $rootScope.organisaatiot = data;
      });
  })
  .directive('hakemusLabel', function () {
    return {
      scope: {
        tila: '=hakemusLabelTila'
      },
      restrict: 'E',
      link: function (scope, element, attrs) {
        attrs.$observe('tila', function (tilatunnus) {
          var htmlText = '<span class="label label-default">Unknown</span>';
          switch (tilatunnus) {
            case 'K':
              htmlText = '<span class="label label-warning">Käynnissä</span>';
              break;
            case 'V':
              htmlText = '<span class="label label-danger">Vireillä</span>';
              break;
            case 'T':
              htmlText = '<span class="label label-success">Tarkastettu</span>';
              break;
            case 'T0':
              htmlText = '<span class="label label-info">Täydennettävää</span>';
              break;
            case 'TV':
              htmlText = '<span class="label label-danger">Täydennetty</span>';
              break;
            case 'P':
              htmlText = '<span class="label label-success">Päätetty</span>';
              break;
            case 'M':
              htmlText = '<span class="label label-default">Maksettu</span>';
              break;
          }
          element.replaceWith(htmlText);
        });
      }
    };
  })
  .directive('hakemusButton', function () {
    return {
      scope: {
        tila: '=hakemusButtonTila'
      },
      restrict: 'E',
      link: function (scope, element, attrs) {
        attrs.$observe('tila', function (tilatunnus) {
          var htmlText = '<span class="button btn-default">Unknown</span>';
          switch (tilatunnus) {
            case 'K':
              htmlText = '<span class="button btn-warning">Käynnissä</span>';
              break;
            case 'V':
              htmlText = '<span class="button btn-danger">Vireillä</span>';
              break;
            case 'T':
              htmlText = '<span class="button btn-success">Tarkastettu</span>';
              break;
            case 'T0':
              htmlText = '<span class="button btn-info">Täydennettävää</span>';
              break;
            case 'TV':
              htmlText = '<span class="button btn-danger">Täydennetty</span>';
              break;
            case 'P':
              htmlText = '<span class="button btn-success">Päätetty</span>';
              break;
            case 'M':
              htmlText = '<span class="button btn-default">Maksettu</span>';
              break;
          }
          element.replaceWith(htmlText);
        });
      }
    };
  }
)

