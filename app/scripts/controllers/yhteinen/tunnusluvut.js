'use strict';

var _ = require('lodash');
var c = require('utils/core');
var t = require('utils/tunnusluvut');
var d = require('utils/directive');
var angular = require('angular');
var Promise = require('bluebird');
var hasPermission = require('utils/user').hasPermission;

const types = {
  TTYT: 'Taustatiedot ja yleiset tunnusluvut',
  BR: 'PSA Brutto',
  KOS: 'PSA KOS',
  SA: 'Siirtymäajan liikenne',
  ME: 'ME liikenne'
};

const tunnuslukuTooltips = {
  HENKILOSTO: "Kuinka monta henkilötyövuotta viranomaisella kuluu ko. alueen joukkoliikenteen järjestämiseen, suunnitteluun ja asiakaspalvelutehtäviin. Henkilötyövuodet voi arvioida 0,2 htv:n tarkkuudella.",
  ASIAKASPALVELU: "Ulkoistetut asiakaspalvelutehtävät, esimerkiksi matkakorttien hallinnointi.",
  KONSULTTIPALVELU: "Ulkoiset asiantuntijapalvelut ja konsulttiselvitykset, esimerkiksi järjestelmien tekninen neuvonta, linjastojen suunnittelu, asiakastyytyväisyystutkimukset jne.",
  LIPUNMYYNTIPALKKIOT: "Eri lipunmyyntikanaville maksetut palkkiot.",
  TIETOJAMAKSUJARJ: "Tieto- ja maksujärjestelmien kustannukset vuositasolle jaettuna. Investoinnit sekä järjestelmien ja fyysisten laitteiden ylläpidon ja kehittämisen vuosikustannukset.",
  MUUTPALVELUT: "Muut joukkoliikenteen järjestämiseen, kilpailuttamiseen tai suunnitteluun liittyvät kustannukset. Ei sisällä terminaalien, pysäkki-infran tai kunnossapidon kustannuksia.",
  KUNTIENLKM: "Kuinka monen kunnan alueelle toimivalta-alue ulottuu?",
  VYOHYKKEIDENLKM: "Kuinka monesta joukkoliikenteen lippuvyöhykkeestä alue koostuu? ELY-liikenteessä ilmoitetaan vyöhykemäärä siitä lippualueesta, jossa on eniten vyöhykkeitä.",
  MAAPINTAALA:"Maapinta-ala on kokonaispinta-alaa kuvaavampi esimerkiksi Järvi-Suomessa. Tiedon avulla tarjontaa ja kysyntää voidaan suhteuttaa alueen kokoon.",
  ASUKASMAARA:"Koko toimivalta-alue.",
  TYOPAIKKAMAARA: "Koko toimivalta-alue.",
  PENDELOIVIENOSUUS: "Kuinka monta prosenttia alueen kuntien työssäkäyvistä työskentelee toimivalta-alueen ulkopuolella?",
  HENKILOAUTOLIIKENNE:"Koko toimivalta-alueen henkilöautoliikenteen suorite.",
  AUTOISTUMISASTE: "Alueen kuntien asukasmäärällä painotettu keskiarvo autoistumisasteesta.",
  PYSAKKIENLKM: "Kuinka monta fyysistä joukkoliikennepysäkkiä alueella sijaitsee? Tähän lasketaan mukaan kaikki ne pysäkit, joita voidaan käyttää toimivaltaisen viranomaisen liikenteessä.",
  KERTALIPPU:"Hinta vyöhykkeittäin, 1-6 vyöhykettä.",
  KAUSILIPPU:"Hinta vyöhykkeittäin, 1-6 vyöhykettä."

};

function loadTunnusluvut(vuosi, organisaatio, tyyppi, scope, TunnuslukuEditService, StatusService) {
  Promise.props({
    liikennevuosi: t.isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeKysyntaTarjonta(vuosi, organisaatio.id, tyyppi) : undefined,
    liikenneviikko: t.isPSA(tyyppi) ? TunnuslukuEditService.haeKysyntaTarjontaViikko(vuosi, organisaatio.id, tyyppi) : undefined,
    kalusto: t.isPSA(tyyppi) ? TunnuslukuEditService.haeKalusto(vuosi, organisaatio.id, tyyppi) : undefined,
    liikennointikorvaus: t.isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeLiikennointikorvaus(vuosi, organisaatio.id, tyyppi) : undefined,
    lipputulo: t.isLipputuloSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeLipputulo(vuosi, organisaatio.id, tyyppi) : undefined,
    lippuhinta: t.isSopimustyyppi(tyyppi) ? undefined : TunnuslukuEditService.haeLippuhinta(vuosi, organisaatio.id),
    alue: t.isSopimustyyppi(tyyppi) ? undefined : TunnuslukuEditService.haeAlue(vuosi, organisaatio.id),
    joukkoliikennetuki: (!t.isSopimustyyppi(tyyppi) && organisaatio.lajitunnus === 'KS3') ? TunnuslukuEditService.haeJoukkoliikennetuki(vuosi, organisaatio.id) : undefined,
    kommentti: t.isSopimustyyppi(tyyppi) ? TunnuslukuEditService.haeKommentti(vuosi, organisaatio.id, tyyppi) : undefined

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

        $scope.hasOrganisaatioSelectPermission = false;

        // talletetaan organisaatio id talteen - params objekti voi muuttua ennen kuin promisea kutsutaan
        var organisaatioid = $state.params.organisaatioid;
        KayttajaService.hae().then(user => {
          if (hasPermission(user, 'modify-kaikki-tunnusluvut')) {
            $scope.hasOrganisaatioSelectPermission = true;
            $scope.organisaatioId = integerOrNull(organisaatioid);
          } else if (hasPermission(user, 'modify-omat-tunnusluvut')) {
            $scope.organisaatioId = user.organisaatioid;
          } else {
            StatusService.virhe('', 'Käyttäjällä ei ole käyttöoikeuksia tunnuslukutiedon hallintaan');
          }
        });

        $scope.haeTunnuslukuTooltip = tunnus => tunnuslukuTooltips[tunnus];

        $scope.tunnuslukuTyyppiNimi = function (type) {
          return types[type];
        };

        function tyyppi() {
          return $state.current.tyyppi;
        }

        $scope.vuositayttoaste = Math.floor((Math.random() * 100) + 1);
        $scope.tayttoaste = t.laskeTayttoaste;
        $scope.tayttoasteType = t.laskeTayttoasteType;

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
              org => _.includes(['KS1', 'KS2', 'KS3', 'ELY'], org.lajitunnus)),
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

          if (_.every(id, c.isDefinedNotNull)) {
            OrganisaatioService.findById(_.parseInt($scope.organisaatioId)).then(org => {
              $scope.organisaatio = org;
              loadTunnusluvut(id[0], org, id[2], $scope, TunnuslukuEditService, StatusService);
            }, StatusService.errorHandler);
          }
        });


        $scope.tallennaTunnusluvut = function () {
          StatusService.tyhjenna();
          $scope.$broadcast('show-errors-check-validity');

          if (!$scope.tunnusluvutForm.$valid) {
            $scope.$emit('focus-invalid');
            StatusService.virhe('Tunnusluvut.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
            return;
          }
          var tallennusPromise = [];

          function pushTallennusPromise(saveFunction, data) {
            tallennusPromise.push(saveFunction($scope.vuosi, $scope.organisaatioId, tyyppi(), data));
          }

          if (t.isLipputuloSopimustyyppi(tyyppi())) {
            pushTallennusPromise(TunnuslukuEditService.tallennaLipputulo, $scope.tunnusluvut.lipputulo);
          }

          if (t.isSopimustyyppi(tyyppi())) {
            pushTallennusPromise(TunnuslukuEditService.tallennaKysyntaTarjonta, $scope.tunnusluvut.liikennevuosi);
            pushTallennusPromise(TunnuslukuEditService.tallennaLiikennointikorvaus, $scope.tunnusluvut.liikennointikorvaus);
            pushTallennusPromise(TunnuslukuEditService.tallennaKommentti, $scope.tunnusluvut.kommentti);
          } else {
            // Yleiset tiedot tab
            tallennusPromise.push(TunnuslukuEditService.tallennaLippuhinta($scope.vuosi, $scope.organisaatioId, $scope.tunnusluvut.lippuhinta));
            tallennusPromise.push(TunnuslukuEditService.tallennaAlue($scope.vuosi, $scope.organisaatioId, $scope.tunnusluvut.alue));
            tallennusPromise.push(TunnuslukuEditService.tallennaJoukkoliikennetuki($scope.vuosi, $scope.organisaatioId, $scope.tunnusluvut.joukkoliikennetuki));
          }

          if (t.isPSA(tyyppi())) {
            pushTallennusPromise(TunnuslukuEditService.tallennaKysyntaTarjontaViikko, $scope.tunnusluvut.liikenneviikko);
            pushTallennusPromise(TunnuslukuEditService.tallennaKalusto, $scope.tunnusluvut.kalusto);
          }

          Promise.all(tallennusPromise).then(
            function () {
              StatusService.ok('', 'Tunnuslukujen tallennus onnistui.');
              $scope.tunnusluvutForm.$setPristine();
            },
            StatusService.errorHandler);
        };

        // error messages:
        $scope.desimaaliErrorMessage = d.maxErrorMessage("9999999999,99");
        $scope.prosenttiErrorMessage = d.maxErrorMessage("100,00");
        $scope.kokonaislukuErrorMessage = d.maxlengthNumberErrorMessage("999999999");
      }
    ]
  );
