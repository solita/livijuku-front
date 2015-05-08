'use strict';
var _ = require('lodash');

angular.module('jukufrontApp')
  .run(function ($rootScope) {
    $rootScope.sallittu = function (oikeus) {
      // console.warn('Deprekoitunut $rootScope.sallittu metodi käytössä. Käytä utils/hasPermission funktiota');
      if (typeof $rootScope.user !== 'undefined') {
        for (var i = 0; i < $rootScope.user.privileges.length; i++) {
          if ($rootScope.user.privileges[i] == oikeus) {
            return true;
          }
        }
        return false;
      }
    };
  })

  .controller('PaanayttoCtrl', ['$scope', '$rootScope', '$location', 'KayttajaService', 'OrganisaatioService', 'StatusService', 'AvustuskohdeService', 'CommonService',
    function ($scope, $rootScope, $location, KayttajaService, OrganisaatioService, statusService, avustusKohdeService, common) {

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

      common.bindPromiseToScope(avustusKohdeService.luokittelu(), $rootScope, 'avustuskohdeLuokat',
        function(data) {
          return _.mapValues(_.indexBy(data, 'tunnus'),
            function(l) {
              l.avustuskohdelajit = _.indexBy(l.avustuskohdelajit, 'tunnus');
              return l;
            })},
        'avustusKohdeService.luokittelu()');
  }
  ]
)
;
