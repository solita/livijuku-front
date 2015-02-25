'use strict';
angular.module('jukufrontApp')
  .controller('PaanayttoCtrl', ['$scope', '$rootScope', '$location', 'KayttajaService', 'OrganisaatioService', 'StatusService', function ($scope, $rootScope, $location, KayttajaService, OrganisaatioService, statusService) {

    $scope.isActive = function (route) {
      if (route.substr(0, 13) == '/k/hakemukset') {
        return (route.substr(0, 13) == $location.path().substr(0, 13));
      } else {
        return route === $location.path();
      }
    };

    $scope.sallittu = function (oikeus) {
      if (typeof $rootScope.user !== 'undefined') {
        for (var i = 0; i < $rootScope.user.privileges.length; i++) {
          if ($rootScope.user.privileges[i] == oikeus) {
            return true;
          }
        }
        return false;
      }
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
            if ($scope.sallittu('view-hakemuskausi')) {
                $location.path("k/hakemuskaudenhallinta");
            } else {
                $location.path("h/hakemukset");
            }
          }
        )
          .
          error(function (data) {
            statusService.virhe('KayttajaService.hae()', data);
          });
      })
      .error(function (data) {
        statusService.virhe('OrganisaatioService.hae()', data);
      });
  }
  ]
)
;
