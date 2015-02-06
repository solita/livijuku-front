'use strict';
angular
  .module('jukufrontApp', [
    'services.avustuskohde',
    'services.hakemus',
    'services.hakemuskausi',
    'services.kayttaja',
    'services.liite',
    'services.organisaatio',
    'services.suunnittelu',
    'services.status',
    'services.paatos',
    'controllers.MainCtrl',
    'ngResource',
    'smart-table',
    'ui.bootstrap',
    'monospaced.elastic',
    'angularFileUpload',
    'toastr',
    'ngAnimate',
    'ngRoute',
    'ng-currency',
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
        controller: 'HakemusCtrl'
      })
      .when('/h/hakemus/esikatselu/:id', {
        templateUrl: 'views/hakija/hakemusEsikatselu.html',
        controller: 'HakemusCtrl'
      })
      .when('/h/hakemukset', {
        templateUrl: 'views/hakija/hakemukset.html',
        controller: 'HakijaHakemuksetCtrl'
      })
      .when('/h/maksatushakemus/:tyyppi/:id/:m1id/:m2id', {
        templateUrl: 'views/hakija/maksatusHakemus.html',
        controller: 'MaksatusHakemusCtrl'
      })
      .when('/k/hakemus/:id', {
        templateUrl: 'views/kasittelija/hakemus.html',
        controller: 'HakemusCtrl'
      })
      .when('/k/hakemukset', {
        templateUrl: 'views/kasittelija/hakemukset.html',
        controller: 'KasittelijaHakemuksetCtrl'
      })
      .when('/k/hakemuskaudenhallinta', {
        templateUrl: 'views/kasittelija/hakemuskaudenHallinta.html',
        controller: 'KasittelijaHakemuskaudenHallintaCtrl'
      })
      .when('/k/paatos/:vuosi/:tyyppi/:lajitunnus/:hakemusid/:haettuavustus/:avustus', {
        templateUrl: 'views/kasittelija/paatos.html',
        controller: 'KasittelijaPaatosCtrl'
      })
      .when('/k/paatos/esikatselu/:vuosi/:tyyppi/:lajitunnus/:hakemusid/:haettuavustus/:avustus', {
        templateUrl: 'views/kasittelija/paatosEsikatselu.html',
        controller: 'KasittelijaPaatosCtrl'
      })
      .when('/k/suunnittelu/:vuosi/:tyyppi/:lajitunnus', {
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

