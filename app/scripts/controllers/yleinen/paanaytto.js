'use strict';
angular.module('jukufrontApp')
  .controller('PaanayttoCtrl', ['$scope', '$rootScope', '$location', 'KayttajaService', 'OrganisaatioService', 'StatusService', function ($scope, $rootScope, $location, KayttajaService, OrganisaatioService, statusService) {

    $scope.isActive = function (route) {
      return route === $location.path();
    };

    OrganisaatioService.hae()
      .success(function (data) {
        $rootScope.organisaatiot = data;
        KayttajaService.hae()
          .success(function (data) {
            $rootScope.user = data;
            $rootScope.userOrganisaatio = _.find($rootScope.organisaatiot, {'id': $rootScope.user.organisaatioid}).nimi;
            statusService.ok('KayttajaService.hae()', 'Käyttäjätiedot haettu onnistuneesti.' );
          })
          .error(function (data) {
            statusService.virhe('KayttajaService.hae()', data);
          });
      })
      .error(function (data) {
        statusService.virhe('OrganisaatioService.hae()', data);
      });
  }]
)
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
              htmlText = '<span class="label label-warning">Keskeneräinen</span>';
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
            case 'FEK':
              htmlText = '<span class="label label-default">Ei käynnissä</span>';
              break;
          }
          element.replaceWith(htmlText);
        });
      }
    };
  });
