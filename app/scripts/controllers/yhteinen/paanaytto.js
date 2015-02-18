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
            $rootScope.userOrganisaatioLajitunnus = _.find($rootScope.organisaatiot, {'id': $rootScope.user.organisaatioid}).lajitunnus;
            statusService.ok('KayttajaService.hae()', 'Käyttäjätiedot haettu onnistuneesti.');
          })
          .error(function (data) {
            statusService.virhe('KayttajaService.hae()', data);
          });
      })
      .error(function (data) {
        statusService.virhe('OrganisaatioService.hae()', data);
      });
  }]
);
