'use strict';

var _ = require('lodash');
var c = require('utils/core');
var t = require('utils/tunnusluvut');
var angular = require('angular');
var Promise = require('bluebird');
var hasPermission = require('utils/hasPermission');

// TODO: tämän voi poistaa jos url:iin ei tule vuotta ja organisaatiota
loadTunnusluvutPromise.$inject = ['$state', 'StatusService', 'TunnuslukuEditService'];
export function loadTunnusluvutPromise($state, StatusService, TunnuslukuEditService) {
  return Promise.props({
    liikennevuosi: Promise.resolve('test') //TunnuslukuEditService.haeKysyntaTarjonta(2016, 1, 'BR')
  }).then(_.identity, StatusService.errorHandler);
};

const types = {
  TTYT: 'Taustatiedot ja yleiset tunnusluvut',
  BR: 'PSA Brutto',
  KOS: 'PSA KOS',
  SA: 'Siirtymäajan liikenne',
  ME: 'ME liikenne'
};

function loadTunnusluvut(vuosi, organisaatioid, tyyppi, scope, TunnuslukuEditService, StatusService) {
  Promise.props({
    liikennevuosi: t.isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeKysyntaTarjonta(vuosi, organisaatioid, tyyppi) : undefined,
    liikenneviikko: t.isPSA(tyyppi) ? TunnuslukuEditService.haeKysyntaTarjontaViikko(vuosi, organisaatioid, tyyppi) : undefined,
    kalusto: t.isPSA(tyyppi) ? TunnuslukuEditService.haeKalusto(vuosi, organisaatioid, tyyppi) : undefined,
    liikennointikorvaus: t.isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeLiikennointikorvaus(vuosi, organisaatioid, tyyppi) : undefined,
    lipputulo: t.isLipputuloSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeLipputulo(vuosi, organisaatioid, tyyppi) : undefined

  }).then(
    tunnusluvut => scope.$evalAsync(scope => scope.tunnusluvut = tunnusluvut),
    StatusService.errorHandler);
}

function integerOrNull(txt) {
  var number = _.parseInt(txt);
  return _.isFinite(number) ? txt : null;
}

angular.module('jukufrontApp')
  .controller('TunnusluvutMuokkausCtrl',
    ['$scope', '$state', 'OrganisaatioService', 'TunnuslukuEditService', 'StatusService', 'KayttajaService',

      function ($scope, $state, OrganisaatioService, TunnuslukuEditService, StatusService, KayttajaService) {

        $scope.vuosi = integerOrNull($state.params.vuosi);
        $scope.organisaatioId = null;

        $scope.hasOrganisaatioSelectPermission = false;
        KayttajaService.hae().then(user => {
          if (hasPermission(user, 'modify-kaikki-tunnusluvut')) {
            $scope.hasOrganisaatioSelectPermission = true;
            $scope.organisaatioId = integerOrNull($state.params.organisaatioid);
          } else if (hasPermission(user, 'modify-omat-tunnusluvut')) {
            $scope.organisaatioId = user.organisaatioid.toString();
          } else {
            StatusService.virhe('', 'Käyttäjällä ei ole käyttöoikeuksia tunnuslukutiedon hallintaan');
          }
        });

        $scope.tunnuslukuTyyppiNimi = function (type) {
          return types[type];
        };

        function tyyppi() {
          return $state.current.tyyppi;
        }

        $scope.vuositayttoaste = Math.floor((Math.random() * 100) + 1);

        $scope.isTabSelected = function isTabSelected(tyyppi) {
          return $state.current.tyyppi === tyyppi;
        };

        $scope.tyyppi = tyyppi;

        $scope.toTab = function toTab(tyyppi) {
          $state.go('app.tunnusluku.syottaminen.' + tyyppi);
        };

        OrganisaatioService.hae().then(
          organisaatiot => $scope.organisaatiot =
            _.filter(organisaatiot,
              org => _.contains(['KS1', 'KS2', 'ELY'], org.lajitunnus)),
          StatusService.errorHandler);

        $scope.$watchGroup(["vuosi", "organisaatioId", "tyyppi()"], (id) => {
          $state.go($state.current.name, {vuosi: id[0], organisaatioid: id[1]}, {
            // prevent the events onStart and onSuccess from firing
            notify: false,
            // prevent reload of the current state
            reload: false,
            // update location
            location: true, //'replace',
            // inherit the current params on the url
            inherit: true
          });

          if (_.all(id, c.isDefinedNotNull)) {
            loadTunnusluvut(id[0], id[1], id[2], $scope, TunnuslukuEditService, StatusService)
          }
        });


        $scope.tallennaHakemus = function () {
          var tallennusPromise = [];

          function pushTallennusPromise(saveFunction, data) {
            tallennusPromise.push(saveFunction($scope.vuosi, $scope.organisaatioId, tyyppi(), data));
          }

          if (t.isLipputuloSopimustyyppi(tyyppi())) {
            pushTallennusPromise(TunnuslukuEditService.tallennaLipputulo, $scope.tunnusluvut.lipputulo);
          }

          if (t.isSopimustyyppi(tyyppi())) {
            pushTallennusPromise(TunnuslukuEditService.tallennaKysyntaTarjonta, $scope.tunnusluvut.liikennevuosi);
            pushTallennusPromise(TunnuslukuEditService.tallennaLiikennointikorvaus, $scope.tunnusluvut.liikennointikorvaus)
          }

          if (t.isPSA(tyyppi())) {
            pushTallennusPromise(TunnuslukuEditService.tallennaKysyntaTarjontaViikko, $scope.tunnusluvut.liikenneviikko);
            pushTallennusPromise(TunnuslukuEditService.tallennaKalusto, $scope.tunnusluvut.kalusto);
          }

          Promise.all(tallennusPromise).then(
            function () {
              StatusService.ok('', 'Tunnuslukujen tallennus onnistui.');
            },
            StatusService.errorHandler);
        }
      }
    ]
  );
