'use strict';
var angular = require('angular');
var {isHakija, isKasittelija} = require('utils/user');
var {restrictRoute, defaultView} = require('utils/router');
var hakemuksenTilat = require('utils/hakemuksenTilat');

require('angular-toastr');
require('angular-resource');
require('angular-loading-bar');
require('angular-smart-table');
require('angular-bootstrap');
require('angular-elastic');
require('ng-file-upload');
require('angular-animate');
require('angular-ui-router');
require('ng-currency');
require('angular-bootstrap-show-errors');
require('angular-ui-grid/ui-grid.min.js');
require('angular-ui-validate');
require('angular-i18n/angular-locale_fi-fi');
require('d3/d3.js');
require('angular-nvd3/lib/nv.d3.js');
require('angular-nvd3');
require('angular-xeditable/dist/js/xeditable');

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
    'filters.toClass',
    'filters.stateNameIncludes',
    'filters.toApplicationName',
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
    'ui.router',
    'ng-currency',
    'ui.bootstrap.showErrors',
    'ui.validate',
    'ui.grid',
    'ui.grid.edit',
    'ui.grid.cellNav',
    'nvd3',
    'xeditable'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    function root(url) {
      const opts = {
        abstract: true,
        template: '<ui-view></ui-view>'
      };
      if(url) {
        opts.url = url;
      }
      return opts;
    }

    $stateProvider
      .state('redirect', {
        url: '/',
        controller: ['$state', 'KayttajaService', function($state, KayttajaService) {
          KayttajaService.hae().then(function(user) {
            $state.go(defaultView(user));
          });
        }]
      })
      .state('app', root())
      .state('app.yhteinen', root('/y'))
      .state('app.yhteinen.hakemukset', root('/hakemukset'))
      .state('app.yhteinen.hakemukset.list', {
        url: '/:tyyppi',
        template: require('views/kasittelija/hakemukset.html'),
        controller: 'KasittelijaHakemuksetCtrl'
      })

      /*
       * Hakija
       */

      .state('app.hakija', root('/h'))
      .state('app.hakija.hakemukset', root('/hakemukset'))
      .state('app.hakija.hakemukset.hakemus', restrictRoute(isHakija, {
        url: '/hakemus/:vuosi/:tyyppi/:id/:m1id/:m2id',
        template: require('views/hakemus/index.html'),
        controller: 'HakemusCtrl'
      }))
      .state('app.hakija.hakemukset.elyhakemus', {
        url: '/elyhakemus/:vuosi/:id',
        template: require('views/hakija/elyhakemus.html'),
        controller: 'ElyHakemusCtrl'
      })
      .state('app.hakija.hakemukset.list', restrictRoute(isHakija, {
        url: '/',
        template: require('views/hakija/hakemukset.html'),
        controller: 'HakijaHakemuksetCtrl'
      }))
      .state('app.hakija.tunnusluku', root('/tunnusluvut'))
      .state('app.hakija.tunnusluku.syottaminen', {
        url: '/syottaminen',
        template: require('views/yhteinen/tunnuslukujenSyottaminen.html'),
        controller: 'HakijaTunnusluvutCtrl'
      })
      .state('app.hakija.tunnusluku.raportit', {
        url: '/raportit',
        template: require('views/yhteinen/tunnuslukuraportit.html'),
        controller: 'TunnuslukuraporttiCtrl'
      })
      .state('app.yhteinen.kayttajatiedot', {
        url: '/kayttajatiedot',
        template: require('views/yhteinen/kayttajatiedot.html'),
        controller: 'KayttajatiedotCtrl'
      })
      .state('app.hakija.asetukset', {
        url: '/asetukset',
        template: require('views/hakija/asetukset.html'),
        controller: 'HakijaAsetuksetCtrl'
      })

      /*
       * Käsittelijä
       */

      .state('app.kasittelija', root('/k'))
      .state('app.kasittelija.hakemukset', root('/hakemukset/:tyyppi'))
      .state('app.kasittelija.hakemukset.list', {
        url: '',
        template: require('views/kasittelija/hakemukset.html'),
        controller: 'KasittelijaHakemuksetCtrl'
      })
      .state('app.kasittelija.hakemukset.hakemus', {
        url: '/hakemus/:vuosi/:id/:m1id/:m2id',
        template: require('views/hakemus/index.html'),
        controller: 'HakemusCtrl'
      })
      .state('app.kasittelija.hakemuskaudenhallinta', restrictRoute(isKasittelija, {
        url: '/hakemuskaudenhallinta',
        template: require('views/kasittelija/hakemuskaudenHallinta.html'),
        controller: 'KasittelijaHakemuskaudenHallintaCtrl'
      }))
      .state('app.kasittelija.suunnittelu', restrictRoute(isKasittelija, {
        url: '/suunnittelu/:vuosi/:tyyppi/:lajitunnus',
        template: require('views/kasittelija/suunnittelu.html'),
        controller: 'KasittelijaSuunnitteluCtrl'
      }))
      .state('app.kasittelija.paatos', restrictRoute(isKasittelija, {
        url: '/paatos/:vuosi/:tyyppi/:lajitunnus/:hakemusid/:haettuavustus/:avustus',
        template: require('views/kasittelija/paatos.html'),
        controller: 'KasittelijaPaatosCtrl'
      }));

      // $urlRouterProvider.otherwise('/');
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
  .run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.constants = {
      hakemustyypit: ['AH0', 'MH1', 'MH2'],
      hakemuksenTilat: hakemuksenTilat.getAll()
    };

    $rootScope.$on('$stateChangeError', () => {
      $state.go('redirect');
    });
  }])
  .directive('chronologicalOrder', require('validators/chronologicalOrder'))
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
  .directive('jukuOhjeAvustushakemus', require('components/ohje/avustushakemus'))
  .directive('jukuOhjeMaksatushakemus', require('components/ohje/maksatushakemus'))
  .directive('jukuLiiteLataus', require('components/liiteLataus'))
  .directive('jukuLiiteTarkistaminen', require('components/liiteTarkistaminen'))
  .directive('jukuUserDropdown', require('components/userDropdown'))
  .directive('jukuLinkNext', require('components/navigationLink').next)
  .directive('jukuLinkPrev', require('components/navigationLink').prev)
  .directive('jukuNavigationLinks', require('components/navigationLinks'))
  .directive('jukuFormSection', require('components/formSection'))
  .directive('jukuFormRow', require('components/formRow'))
  .directive('jukuForm', require('components/form'))
  .directive('jukuIconLink', require('components/iconLink'))
  .directive('jukuFileDetails', require('components/fileDetails'))
  .directive('jukuFileActions', require('components/fileActions'))
  .directive('jukuCheckbox', require('components/checkbox'))
  .directive('jukuAvustuskohde', require('components/avustuskohde'))
  .directive('hakemusLabel', require('components/hakemusLabel'))
  .directive('jukuControls', require('components/controls'))
  .directive('jukuControlsButtons', require('components/controls/buttons'))
  .directive('jukuConfirmation', require('components/confirmation'))
  .directive('jukuStatisticDropdown', require('components/statisticDropdown'))
  .directive('jukuPaatosTiedot', require('components/paatosTiedot'));

require('./controllers/hakija/asetukset');
require('./controllers/hakija/hakemukset');
require('./controllers/kasittelija/hakemukset');
require('./controllers/kasittelija/hakemuskaudenHallinta');
require('./controllers/kasittelija/paatos');
require('./controllers/kasittelija/suunnittelu');
require('./controllers/yhteinen/hakemus');
require('./controllers/yhteinen/elyhakemus');
require('./controllers/yhteinen/kayttajatiedot');
require('./controllers/yhteinen/paanaytto');
require('./controllers/yhteinen/tunnusluvut');
require('./controllers/yhteinen/tunnuslukuraportti');
require('./directives/alvmuunnos');
require('./directives/datepickerPopup');
require('./directives/jukuAvustusluokkaPanel');
require('./directives/noenter');
require('./directives/numericOnly');
require('./directives/focusToInvalid');
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
require('./filters/toClass');
require('./filters/stateNameIncludes');
require('./filters/toApplicationName');
