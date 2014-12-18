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
    'ngResource',
    'services.dataApi',
    'smart-table',
    'ui.bootstrap',
    'monospaced.elastic',
    'angularFileUpload',
    'ngRoute',
    'ngMockE2E'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/lahHakemukset.html',
        controller: 'LahHakemuksetCtrl'
      })
      .when('/l/hakemus/:id', {
        templateUrl: 'views/lahHakemus.html',
        controller: 'LahHakemusCtrl'
      })
      .when('/l/hakemus/esikatselu/:id', {
        templateUrl: 'views/lahHakemusEsikatselu.html',
        controller: 'KasHakemusCtrl'
      })
      .when('/l/hakemukset', {
        templateUrl: 'views/lahHakemukset.html',
        controller: 'LahHakemuksetCtrl'
      })
      .when('/l/tietoajukusta', {
        templateUrl: 'views/lahTietoajukusta.html',
        controller: 'AboutCtrl'
      })
      .when('/k/hakemus/:id', {
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
      .when('/k/paatos/:hakemusid/:avustus', {
        templateUrl: 'views/kasPaatos.html',
        controller: 'KasPaatosCtrl'
      })
      .when('/k/suunnittelu/:vuosi/:tyyppi', {
        templateUrl: 'views/kasSuunnittelu.html',
        controller: 'KasSuunnitteluCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
