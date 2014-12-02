'use strict';

/**
 * @ngdoc overview
 * @name jukufrontApp
 * @description
 * # jukufrontApp
 *
 * Main module of the application.
 */
angular
  .module('jukufrontApp', [
    'controllers.MainCtrl',
    'services.dataApi',
    'ui.bootstrap',
    'ui.grid',
    'ui.grid.autoResize',
    'ngRoute',
    'ngMockE2E'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/lahHakemukset.html',
        controller: 'LahHakemuksetCtrl'
      })
      .when('/l/hakemus', {
        templateUrl: 'views/lahHakemus.html',
        controller: 'LahHakemusCtrl'
      })
      .when('/l/hakemukset', {
        templateUrl: 'views/lahHakemukset.html',
        controller: 'LahHakemuksetCtrl'
      })
      .when('/l/tietoajukusta', {
        templateUrl: 'views/lahTietoajukusta.html',
        controller: 'AboutCtrl'
      })
      .when('/k/hakemus', {
        templateUrl: 'views/kasHakemus.html',
        controller: 'KasHakemusCtrl'
      })
      .when('/k/hakemukset', {
        templateUrl: 'views/kasHakemukset.html',
        controller: 'KasHakemuksetCtrl'
      })
      .when('/k/hakemuskaudenhallinta', {
        templateUrl: 'views/kasHakemuskaudenHallinta.html',
        controller: 'KasHakemuskaudenHallintaCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
