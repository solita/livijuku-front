'use strict';
var angular = require('angular');
var {isHakija, isKasittelija} = require('utils/user');
var {restrictRoute, defaultView} = require('utils/router');

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
require('angular-ui-grid/ui-grid.min.js');
require('angular-ui-validate');
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
    'filters.toApplicantName',
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
    'ui.validate',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.rowEdit',
    'ui.grid.resizeColumns'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        template: '<div></div>',
        controller: ['$location', 'KayttajaService', function($location, KayttajaService) {
          KayttajaService.hae().then(function(user) {
            $location.path(defaultView(user));
          });
        }]
      })
      .when('/y/hakemukset/:tyyppi', {
        template: require('views/kasittelija/hakemukset.html'),
        controller: 'KasittelijaHakemuksetCtrl'
      })
      .when('/h/hakemus/:vuosi/:tyyppi/:id/:m1id/:m2id', restrictRoute(isHakija, {
        template: require('views/hakija/hakemus.html'),
        controller: 'HakemusCtrl'
      }))
      .when('/h/hakemukset', restrictRoute(isHakija, {
        template: require('views/hakija/hakemukset.html'),
        controller: 'HakijaHakemuksetCtrl'
      }))
      .when('/h/tunnuslukujensyottaminen', {
        template: require('views/hakija/tunnuslukujenSyottaminen.html'),
        controller: 'HakijaTunnusluvutCtrl'
      })
      .when('/h/tunnuslukuraportit', {
        template: require('views/hakija/tunnuslukuraportit.html'),
        controller: 'HakijaTunnusluvutCtrl'
      })
      .when('/k/hakemus/:vuosi/:tyyppi/:id/:m1id/:m2id', {
        template: require('views/kasittelija/hakemus.html'),
        controller: 'HakemusCtrl'
      })
      .when('/k/hakemuskaudenhallinta', restrictRoute(isKasittelija, {
        template: require('views/kasittelija/hakemuskaudenHallinta.html'),
        controller: 'KasittelijaHakemuskaudenHallintaCtrl'
      }))
      .when('/k/paatos/:vuosi/:tyyppi/:lajitunnus/:hakemusid/:haettuavustus/:avustus', restrictRoute(isKasittelija, {
        template: require('views/kasittelija/paatos.html'),
        controller: 'KasittelijaPaatosCtrl'
      }))
      .when('/k/suunnittelu/:vuosi/:tyyppi/:lajitunnus', restrictRoute(isKasittelija, {
        template: require('views/kasittelija/suunnittelu.html'),
        controller: 'KasittelijaSuunnitteluCtrl'
      }))
      .otherwise({
        redirectTo: '/'
      });
  }])
  .config(['$httpProvider', function ($httpProvider) {
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
  .run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeError', () => $location.path('/'));
  }])
  .directive('jukuHeader', require('components/header'))
  .directive('jukuSidebar', require('components/sidebar'))
  .directive('jukuNavigation', require('components/navigation'))
  .directive('jukuFooter', require('components/footer'))
  .directive('jukuTabs', require('components/tabs'))
  .directive('jukuTab', require('components/tab'))
  .directive('jukuBadge', require('components/badge'))
  .directive('jukuPoistumisvaroitus', require('components/poistumisvaroitus'))
  .directive('jukuVarmistusdialogi', require('components/varmistusdialogi'))
  .directive('jukuTaydennysdialogi', require('components/taydennysdialogi'))
  .directive('hakemuksenTila', require('components/hakemuksenTila'))
  .directive('hakemusSummary', require('components/hakemusSummary'))
  .directive('hakemusPanel', require('components/hakemusPanel'))
  .directive('hakemuskausiPanel', require('components/hakemuskausiPanel'))
  .directive('hakemusLaatikko', require('components/hakemusLaatikko'))
  .directive('jukuOhje', require('components/ohje'))
  .directive('jukuLiiteLataus', require('components/liiteLataus'))
  .directive('jukuLiiteTarkistaminen', require('components/liiteTarkistaminen'))
  .directive('jukuUserDropdown', require('components/userDropdown'))
  .directive('jukuLinkNext', require('components/navigationLink').next)
  .directive('jukuLinkPrev', require('components/navigationLink').prev)
  .directive('jukuFormSection', require('components/formSection'))
  .directive('jukuFormRow', require('components/formRow'))
  .directive('jukuForm', require('components/form'))
  .directive('jukuIconLink', require('components/iconLink'))
  .directive('jukuFileDetails', require('components/fileDetails'))
  .directive('jukuFileActions', require('components/fileActions'))
  .directive('jukuCheckbox', require('components/checkbox'))
  .directive('jukuAvustuskohde', require('components/avustuskohde'))
  .directive('hakemusLabel', require('components/hakemusLabel'))
  .directive('jukuStatisticDropdown', require('components/statisticDropdown'));

require('./controllers/hakija/hakemukset');
require('./controllers/hakija/tunnusluvut');
require('./controllers/kasittelija/hakemukset');
require('./controllers/kasittelija/hakemuskaudenHallinta');
require('./controllers/kasittelija/paatos');
require('./controllers/kasittelija/suunnittelu');
require('./controllers/yhteinen/hakemus');
require('./controllers/yhteinen/paanaytto');
require('./directives/alvmuunnos');
require('./directives/datepickerPopup');
require('./directives/jukuAvustusluokkaPanel');
require('./directives/noenter');
require('./directives/numericOnly');
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
require('./filters/toApplicantName');
