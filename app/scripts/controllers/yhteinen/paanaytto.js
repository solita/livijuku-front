'use strict';

var _ = require('lodash');
var angular = require('angular');
var Promise = require('bluebird');

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

  .controller('PaanayttoCtrl', ['$scope', '$rootScope', 'KayttajaService', 'OrganisaatioService', 'StatusService', 'AvustuskohdeService',
    function ($scope, $rootScope, KayttajaService, OrganisaatioService, statusService, avustusKohdeService) {

      var organisaatioPromise = OrganisaatioService.hae();
      var userPromise = KayttajaService.hae();

      var rootScopePromise = Promise.props({
        organisaatiot: OrganisaatioService.hae(),
        user: userPromise,
        userOrganisaatio: userPromise.then(user => OrganisaatioService.findById(user.organisaatioid)).then(org => org.nimi),
        userPankkitilinumero: userPromise.then(user => OrganisaatioService.findById(user.organisaatioid)).then(org => org.pankkitilinumero),
        avustuskohdeLuokat: avustusKohdeService.luokittelu().then(convertAvustuskohdeluokittelu)
      });

      rootScopePromise.then(data => _.merge($rootScope, data), statusService.errorHandler);

      function convertAvustuskohdeluokittelu(data) {
        return _.mapValues(_.indexBy(data, 'tunnus'),
          function(l) {
            l.avustuskohdelajit = _.indexBy(l.avustuskohdelajit, 'tunnus');
            return l;
          })};
  }]);
