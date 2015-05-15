'use strict';

var angular = require('angular');

require('angular-toastr');
require('angular-resource');
require('angular-loading-bar');
require('angular-smart-table');
require('angular-bootstrap');
require('angular-elastic');
require('ng-file-upload');
require('angular-animate');
require('angular-route');
require('ng-currency');
require('angular-bootstrap-show-errors');
require('angular-ui-utils');
require('angular-i18n/angular-locale_fi-fi');

angular
  .module('jukufrontApp', [
    'services.auth',
    'services.avustuskohde',
    'services.hakemus',
    'services.hakemuskausi',
    'services.kayttaja',
    'services.liite',
    'services.organisaatio',
    'services.suunnittelu',
    'services.status',
    'services.paatos',
    'services.common',
    'ngResource',
    'angular-loading-bar',
    'smart-table',
    'ui.bootstrap',
    'ui.bootstrap.tooltip',
    'ui.bootstrap.dropdown',
    'monospaced.elastic',
    'ngFileUpload',
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
        templateUrl: 'views/yhteinen/aloitus.html'
      })
      .when('/h/hakemus/:vuosi/:tyyppi/:id/:m1id/:m2id', {
        templateUrl: 'views/hakija/hakemus.html',
        controller: 'HakemusCtrl'
      })
      .when('/h/hakemukset', {
        templateUrl: 'views/hakija/hakemukset.html',
        controller: 'HakijaHakemuksetCtrl'
      })
      .when('/k/hakemus/:vuosi/:tyyppi/:id/:m1id/:m2id', {
        templateUrl: 'views/kasittelija/hakemus.html',
        controller: 'HakemusCtrl'
      })
      .when('/k/hakemukset/:tyyppi', {
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
      .when('/k/suunnittelu/:vuosi/:tyyppi/:lajitunnus', {
        templateUrl: 'views/kasittelija/suunnittelu.html',
        controller: 'KasittelijaSuunnitteluCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .config(['$httpProvider', function($httpProvider) {
    //http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.Pragma = 'no-cache';
  }])
  .directive('jukuHeader', require('components/header'))
  .directive('jukuSidebar', require('components/sidebar'))
  .directive('jukuFooter', require('components/footer'));

require('./controllers/hakija/hakemukset');
require('./controllers/kasittelija/hakemukset');
require('./controllers/kasittelija/hakemuskaudenHallinta');
require('./controllers/kasittelija/paatos');
require('./controllers/kasittelija/suunnittelu');
require('./controllers/yhteinen/hakemus');
require('./controllers/yhteinen/paanaytto');
require('./directives/hakemuslabel');
require('./directives/hakemussummary');
require('./directives/jkuAvustusluokkaPanel');
require('./directives/jkuAvustuskohde');
require('./directives/noenter');
require('./directives/selectonclick');
require('./services/auth');
require('./services/avustuskohde');
require('./services/common');
require('./services/hakemus');
require('./services/hakemuskausi');
require('./services/kayttaja');
require('./services/liite');
require('./services/organisaatio');
require('./services/paatos');
require('./services/status');
require('./services/suunnittelu');
