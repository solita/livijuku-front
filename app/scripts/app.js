'use strict';
var angular = require('angular');
var {isHakija, isKasittelija} = require('utils/user');
var {restrictRoute, defaultView} = require('utils/router');
var hakemuksenTilat = require('utils/hakemuksenTilat');
var directive = require('utils/directive');

/**
 * Tämä window muuttuja on ng-file-upload-direktiiviä varten.
 * Tämä direktiivi käyttää elementin document offset laskennassa jqueryn offset toteutusta tai
 * omaa versiota ja oma versio on virheellinen. Virheestä seuraa se että flash-file-select
 * komponentti ei peitä haluttua select-painiketta.
 *
 * Katso:
 * - shim-elem.js funktio: getOffset(obj)
 * - http://api.jquery.com/offset/
 * - http://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document
 * - http://api.jquery.com/offset/
 */
window.jQuery = require('jquery');

/**
 * Alustava xsrf-token arvo, jota käytetään ensimmäiseen backend-pyyntöön.
 * Ensimmäisessä pyynnössä backend antaa vastauksena tietoturvallisen satunnaisluvun.
 * CRSF-hyökkäys esto perustuu double submit cookie -malliin.
 */
document.cookie = "XSRF-TOKEN=unsecure-" + Math.random() + "; path=/";

require('angular-toastr');
require('angular-resource');
require('angular-loading-bar');
require('angular-smart-table');
require('angular-ui-bootstrap');
require('angular-elastic');
require('ng-file-upload');
require('angular-animate');
require('angular-ui-router');
require('ng-currency');
require('angular-bootstrap-show-errors');
require('angular-ui-validate');
require('angular-i18n/angular-locale_fi-fi');
require('d3/d3.js');
require('nvd3/build/nv.d3.js');
require('angular-nvd3/dist/angular-nvd3.js');
require('angular-sanitize');
require('ng-csv');
require('iban/iban.js');

angular
  .module('jukufrontApp', [
    'services.auth',
    'services.avustuskohde',
    'services.seuranta',
    'services.hakemus',
    'services.elyhakemus',
    'services.hakemuskausi',
    'services.kayttaja',
    'services.liite',
    'services.organisaatio',
    'services.suunnittelu',
    'services.status',
    'services.paatos',
    'services.common',
    'services.config',
    'services.tunnusluvut',
    'filters.toApplicantName',
    'filters.toStatisticName',
    'filters.toClass',
    'filters.stateNameIncludes',
    'filters.toApplicationName',
    'filters.toApplicationNamePlural',
    'filters.erotteleRoolit',
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
    'nvd3',
    'ngSanitize',
    'ngCsv'
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
      .state('app.hakemus', {
        url: '/hakemukset/:id',
        template: require('views/hakemus/index.html'),
        controller: 'HakemusCtrl',
        resolve: {
          initials: require('./controllers/yhteinen/hakemus').loadInitialData
        }
      })
      .state('app.yhteinen', root('/y'))
      .state('app.yhteinen.hakemukset', root('/hakemukset'))
      .state('app.yhteinen.hakemukset.list', {
        url: '/:tyyppi',
        template: require('views/yhteinen/hakemukset.html'),
        controller: 'KaikkiHakemuksetCtrl'
      })
      .state('app.yhteinen.kayttajatiedot', {
        url: '/kayttajatiedot',
        template: require('views/yhteinen/kayttajatiedot.html'),
        controller: 'KayttajatiedotCtrl'
      })
      .state('app.yhteinen.asetukset', {
        url: '/asetukset',
        template: require('views/yhteinen/asetukset.html'),
        controller: 'AsetuksetCtrl'
      })
      .state('app.yhteinen.asiakastuki', {
        url: '/asiakastuki',
        template: require('views/yhteinen/asiakastuki.html')
      })
      /*
       * Hakija
       */

      .state('app.hakija', root('/h'))
      .state('app.hakija.hakemukset', root('/hakemukset'))
      .state('app.hakija.hakemukset.omat', restrictRoute(isHakija, {
        url: '/',
        template: require('views/hakija/hakemukset.html'),
        controller: 'HakijaHakemuksetCtrl'
      }))

      /*
       * Tunnuslukujen syöttäminen
       */

      .state('app.tunnusluku', root('/tunnusluvut'))
      .state('app.tunnusluku.syottaminen', {
        url: '/syottaminen',
        template: require('views/tunnusluvut/muokkaus.html'),
        controller: 'TunnusluvutMuokkausCtrl',
        redirectTo: 'app.tunnusluku.syottaminen.TTYT',
        resolve: {
          tunnusluvut: require('./controllers/yhteinen/tunnusluvut').loadTunnusluvutPromise
        }
      })
      .state('app.tunnusluku.syottaminen.TTYT', {
        url: '/ttyt',
        template: require('views/tunnusluvut/muokkaus-ttyt.html')
      })
      .state('app.tunnusluku.syottaminen.BR', {
        url: '/br',
        template: require('views/tunnusluvut/muokkaus-psab.html')
      })
      .state('app.tunnusluku.syottaminen.KOS', {
        url: '/kos',
        template: require('views/tunnusluvut/muokkaus-psak.html')
      })
      .state('app.tunnusluku.syottaminen.SA', {
        url: '/sa',
        template: require('views/tunnusluvut/muokkaus-sl.html')
      })
      .state('app.tunnusluku.syottaminen.ME', {
        url: '/me',
        template: require('views/tunnusluvut/muokkaus-me.html')
      })

      /*
       * Tunnuslukujen raportointi
       */

      .state('app.tunnusluku.valtionavustuskuvaajat', {
        url: '/valtionavustuskuvaajat',
        template: require('views/tunnusluvut/raportit-valtionavustuskuvaajat.html'),
        controller: 'TunnuslukuraporttiCtrl'
      })
      .state('app.tunnusluku.tunnuslukukuvaajat', {
        url: '/tunnuslukukuvaajat',
        template: require('views/tunnusluvut/raportit-tunnuslukukuvaajat.html'),
        controller: 'TunnuslukuraporttiCtrl'
      })
      .state('app.tunnusluku.omakuvaaja', {
        url: '/omakuvaaja',
        template: require('views/tunnusluvut/raportit-omakuvaaja.html'),
        controller: 'TunnuslukuraporttiCtrl'
      })

      /*
       * Käsittelijä
       */

      .state('app.kasittelija', root('/k'))
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

      $urlRouterProvider.otherwise('/');
  }])
  .config(['$httpProvider', function ($httpProvider) {
    //http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
    //initialize get if not there
    if(!$httpProvider.defaults.headers.get) {
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
      hakemustyypit: ['AH0', 'MH1', 'MH2', 'ELY'],
      hakemuksenTilat: hakemuksenTilat.getAll(),
      hakijaTyypit: ['KS1', 'KS2', 'ELY'],
      tunnuslukuTyypit: ['TTYT','BR','KOS','SA','ME']
    };

    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params)
      }
    });

    $rootScope.$on('$stateChangeError', () => {
      $state.go('redirect');
    });
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
  .directive('jukuOhjeAvustushakemus', require('components/ohje/avustushakemus'))
  .directive('jukuOhjeMaksatushakemus', require('components/ohje/maksatushakemus'))
  .directive('jukuLiiteLataus', require('components/liiteLataus'))
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
  .directive('jukuPaatosTiedot', require('components/paatosTiedot'))
  .directive('jukuTunnusluvutLiikenteenKysyntaTarjonta', require('components/tunnusluvut/liikenteenKysyntaTarjonta'))
  .directive('jukuTunnusluvutLisatiedot', require('components/tunnusluvut/lisatiedot'))
  .directive('jukuTunnusluvutKalusto', require('components/tunnusluvut/kalusto'))
  .directive('jukuTunnusluvutLipputulot', require('components/tunnusluvut/lipputulot'))
  .directive('jukuTunnusluvutLiikennointikorvaukset', require('components/tunnusluvut/liikennointikorvaukset'))
  .directive('jukuTunnusluvutTarjouskilpailut', require('components/tunnusluvut/tarjouskilpailut'))
  .directive('jukuSeurantaLiikenne', require('components/seuranta/liikenne'))
  .directive('jukuSeurantaLippu', require('components/seuranta/lippu'))
  .directive('jukuElyForms', directive.template(require('views/hakemus/ely-forms.html')))
  .directive('jukuAvustuskohteet', directive.template(require('views/hakemus/avustuskohteet.html')))
  .directive('jukuElyMaararahatarpeet', require('components/ely/maararahatarpeet'))
  .directive('jukuElyKehittamishankkeet', require('components/ely/kehittamishankkeet'))
  .directive('jukuSeurantaForms', directive.template(require('views/hakemus/seuranta-forms.html')))
  .directive('jukuUploadHakuohjeButton', directive.template(require('views/kasittelija/hakuohje-upload-button.html')))
  .directive('jukuUploadElyhakuohjeButton', directive.template(require('views/kasittelija/elyhakuohje-upload-button.html')))
  .directive('jukuHakuohje', directive.template(require('views/kasittelija/hakuohje-hallinta.html')))
  .directive('jukuHakemuskausiTyypit', directive.template(require('views/kasittelija/hakemuskausi-hakemustyypit.html')))
  .directive('jukuDeleteKayttajaLink', directive.template(require('views/yhteinen/delete-kayttaja-link.html')))
  .directive('bindModel', directive.bindModel)
  .directive('formGroupCompact', require("components/formInput").formGroupCompact)
  .directive('formGroup', require("components/formInput").formGroup)
  .directive('integerOnly', require("components/formInput").integerParser);

require('./controllers/hakija/hakemukset');
require('./controllers/kasittelija/hakemuskaudenHallinta');
require('./controllers/kasittelija/paatos');
require('./controllers/kasittelija/suunnittelu');
require('./controllers/yhteinen/asetukset');
require('./controllers/yhteinen/hakemukset');
require('./controllers/yhteinen/hakemus');
require('./controllers/yhteinen/kayttajatiedot');
require('./controllers/yhteinen/paanaytto');
require('./controllers/yhteinen/tunnusluvut');
require('./controllers/yhteinen/tunnuslukuraportti');
require('./directives/alvmuunnos');
require('./directives/jukuAvustusluokkaPanel');
require('./directives/noenter');
require('./directives/numericOnly');
require('./directives/numericIntegerOnly');
require('./directives/numericKmOnly');
require('./directives/focusToInvalid');
require('./directives/selectonclick');
require('./services/auth');
require('./services/avustuskohde');
require('./services/seuranta');
require('./services/common');
require('./services/config');
require('./services/hakemus');
require('./services/elyhakemus');
require('./services/hakemuskausi');
require('./services/kayttaja');
require('./services/liite');
require('./services/organisaatio');
require('./services/paatos');
require('./services/status');
require('./services/suunnittelu');
require('./services/tunnusluvut');
require('./filters/erotteleRoolit');
require('./filters/toApplicantName');
require('./filters/toClass');
require('./filters/stateNameIncludes');
require('./filters/toApplicationName');
require('./filters/toApplicationNamePlural');
require('./filters/toStatisticName');
