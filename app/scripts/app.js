'use strict';
angular
  .module('jukufrontApp', [
    'services.avustuskohde',
    'services.hakemus',
    'services.hakemuskausi',
    'services.kayttaja',
    'services.organisaatio',
    'services.suunnittelu',
    'services.status',
    'controllers.MainCtrl',
    'ngResource',
    'smart-table',
    'ui.bootstrap',
    'monospaced.elastic',
    'angularFileUpload',
    'toastr',
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap.showErrors',
    'ui.validate'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/hakija/hakemukset.html',
        controller: 'HakijaHakemuksetCtrl'
      })
      .when('/h/hakemus/:id', {
        templateUrl: 'views/hakija/hakemus.html',
        controller: 'HakijaHakemusCtrl'
      })
      .when('/h/hakemus/esikatselu/:id', {
        templateUrl: 'views/hakija/hakemusEsikatselu.html',
        controller: 'KasittelijaHakemusCtrl'
      })
      .when('/h/hakemukset', {
        templateUrl: 'views/hakija/hakemukset.html',
        controller: 'HakijaHakemuksetCtrl'
      })
      .when('/k/hakemus/:id', {
        templateUrl: 'views/kasittelija/hakemus.html',
        controller: 'KasittelijaHakemusCtrl'
      })
      .when('/k/hakemukset', {
        templateUrl: 'views/kasittelija/hakemukset.html',
        controller: 'KasittelijaHakemuksetCtrl'
      })
      .when('/k/hakemuskaudenhallinta', {
        templateUrl: 'views/kasittelija/hakemuskaudenHallinta.html',
        controller: 'KasittelijaHakemuskaudenHallintaCtrl'
      })
      .when('/k/paatos/:hakemusid/:avustus', {
        templateUrl: 'views/kasittelija/paatos.html',
        controller: 'KasittelijaPaatosCtrl'
      })
      .when('/k/suunnittelu/:vuosi/:tyyppi', {
        templateUrl: 'views/kasittelija/suunnittelu.html',
        controller: 'KasittelijaSuunnitteluCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

