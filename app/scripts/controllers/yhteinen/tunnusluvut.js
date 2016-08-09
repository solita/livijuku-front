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
  ASUKASMAARA:"Ilmoita kaikkien toimivalta-alueen kuntien yhteenlaskettu asukasmäärä. Tilastokeskuksen palvelun valintalaatikoissa valitse toimivalta-alueesi kunnat, \"sukupuolet yhteensä\", kyseisen vuoden viimeisin saatavilla oleva asukasluku (esim. 31.12.2014) ja \"Ikäluokat yhteensä\". Tämän jälkeen paina \"Jatka\"-painiketta. Näytölle ilmestyy taulukko, jossa on valitsemiesi kuntien väkiluvut.",
  TYOPAIKKAMAARA: "Koko toimivalta-alue.",
  PENDELOIVIENOSUUS: "Kuinka monta prosenttia alueen kuntien työssäkäyvistä työskentelee toimivalta-alueen ulkopuolella?",
  HENKILOAUTOLIIKENNE:"Koko toimivalta-alueen henkilöautoliikenteen suorite.",
  AUTOISTUMISASTE: "Alueen kuntien asukasmäärällä painotettu keskiarvo autoistumisasteesta.",
  PYSAKKIENLKM: "Kuinka monta fyysistä joukkoliikennepysäkkiä alueella sijaitsee? Tähän lasketaan mukaan kaikki ne pysäkit, joita voidaan käyttää toimivaltaisen viranomaisen liikenteessä.",
  LIPPUHINTA: 'Lippujen asiakashinnat ilmoitetaan arvonlisäverollisena',
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
  return _.isFinite(number) ? number : null;
}

function loadTayttoaste($scope, TunnuslukuEditService, StatusService) {
  TunnuslukuEditService.haeTayttoasteKokoVuosi($scope.vuosi, $scope.organisaatioId).then(
    tayttoaste => { $scope.vuositayttoaste = _.round(tayttoaste * 100, 3) }, StatusService.errorHandler);
}

angular.module('jukufrontApp')
  .controller('TunnusluvutMuokkausCtrl',
    ['$scope', '$state', 'OrganisaatioService', 'TunnuslukuEditService', 'StatusService', 'KayttajaService',

      function ($scope, $state, OrganisaatioService, TunnuslukuEditService, StatusService, KayttajaService) {

        var currentYear = new Date().getFullYear();

        $scope.vuosi = c.coalesce(integerOrNull($state.params.vuosi), currentYear - 1);

        $scope.vuodet = _.range(currentYear, 2012, -1);

        $scope.hasOrganisaatioSelectPermission = false;

        $scope.haeTunnuslukuTooltip = tunnus => tunnuslukuTooltips[tunnus];
        $scope.tunnuslukuTyyppiNimi = function (type) {
          return types[type];
        };

        $scope.tayttoaste = t.laskeTayttoaste;
        $scope.tayttoasteType = t.laskeTayttoasteType;

        $scope.tyyppi = _.find([$state.params.tyyppi, 'TTYT'], c.isNotBlank);
        d.createTabFunctions($scope, 'tyyppi');

        OrganisaatioService.hae().then(
          organisaatiot => $scope.organisaatiot =
            _.filter(organisaatiot,
              org => _.includes(['KS1', 'KS2', 'KS3', 'ELY'], org.lajitunnus)),
          StatusService.errorHandler);

        $scope.$watchGroup(["vuosi", "organisaatioId", "tyyppi"], id => {
          var stateId = [integerOrNull($state.params.vuosi),
                         integerOrNull($state.params.organisaatioid),
                         (c.isNotBlank($state.params.tyyppi) ? $state.params.tyyppi : null)];

          if (!_.isEqual(id, stateId)) {

            $state.go('app.tunnusluku.syottaminen', {vuosi: id[0], organisaatioid: id[1], tyyppi: id[2]}).then(
              _.noop(),
              function() {
                $scope.vuosi = stateId[0];
                $scope.organisaatioId = stateId[1];
                $scope.tyyppi = stateId[2];
              });
          }
        });

        // talletetaan organisaatio id talteen - params objekti voi muuttua ennen kuin promisea kutsutaan
        var organisaatioid = $state.params.organisaatioid;
        KayttajaService.hae().then(user => {
          $scope.hasLoadAllTunnusluvutPermission = hasPermission(user, 'view-kaikki-tunnusluvut');

          if (hasPermission(user, 'modify-kaikki-tunnusluvut')) {
            $scope.hasOrganisaatioSelectPermission = true;
            $scope.organisaatioId = integerOrNull(organisaatioid);
          } else if (hasPermission(user, 'modify-omat-tunnusluvut')) {
            $scope.organisaatioId = user.organisaatioid;
          } else {
            StatusService.virhe('', 'Käyttäjällä ei ole käyttöoikeuksia tunnuslukutiedon hallintaan');
          }

          if (_.every([$scope.vuosi, $scope.organisaatioId, $scope.tyyppi], c.isDefinedNotNull)) {
            loadTayttoaste($scope, TunnuslukuEditService, StatusService);

            OrganisaatioService.findById(_.parseInt($scope.organisaatioId)).then(org => {
                $scope.organisaatio = org;
                loadTunnusluvut($scope.vuosi, org, $scope.tyyppi, $scope, TunnuslukuEditService, StatusService);
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
            tallennusPromise.push(saveFunction($scope.vuosi, $scope.organisaatioId, $scope.tyyppi, data));
          }

          if (t.isLipputuloSopimustyyppi($scope.tyyppi)) {
            pushTallennusPromise(TunnuslukuEditService.tallennaLipputulo, $scope.tunnusluvut.lipputulo);
          }

          if (t.isSopimustyyppi($scope.tyyppi)) {
            pushTallennusPromise(TunnuslukuEditService.tallennaKysyntaTarjonta, $scope.tunnusluvut.liikennevuosi);
            pushTallennusPromise(TunnuslukuEditService.tallennaLiikennointikorvaus, $scope.tunnusluvut.liikennointikorvaus);
            pushTallennusPromise(TunnuslukuEditService.tallennaKommentti, $scope.tunnusluvut.kommentti);
          } else {
            // Yleiset tiedot tab
            tallennusPromise.push(TunnuslukuEditService.tallennaLippuhinta($scope.vuosi, $scope.organisaatioId, $scope.tunnusluvut.lippuhinta));
            tallennusPromise.push(TunnuslukuEditService.tallennaAlue($scope.vuosi, $scope.organisaatioId, $scope.tunnusluvut.alue));
            tallennusPromise.push(TunnuslukuEditService.tallennaJoukkoliikennetuki($scope.vuosi, $scope.organisaatioId, $scope.tunnusluvut.joukkoliikennetuki));
          }

          if (t.isPSA($scope.tyyppi)) {
            pushTallennusPromise(TunnuslukuEditService.tallennaKysyntaTarjontaViikko, $scope.tunnusluvut.liikenneviikko);
            pushTallennusPromise(TunnuslukuEditService.tallennaKalusto, $scope.tunnusluvut.kalusto);
          }

          Promise.all(tallennusPromise).then(
            function () {
              StatusService.ok('', 'Tunnuslukujen tallennus onnistui.');
              $scope.tunnusluvutForm.$setPristine();
              loadTayttoaste($scope, TunnuslukuEditService, StatusService);
            },
            StatusService.errorHandler);
        };

        // error messages:
        $scope.floatErrorMessage = d.combineErrorMessages(input => input.$error.parse ? 'Virheellisen muotoinen numero' : null, d.maxNumberErrorMessage);
        $scope.desimaaliErrorMessage = d.maxErrorMessage("9 999 999 999,99");
        $scope.prosenttiErrorMessage = d.maxErrorMessage("100,00");
        $scope.kokonaislukuErrorMessage = d.maxlengthNumberErrorMessage("999 999 999");
      }
    ]
  );
