'use strict';

var _ = require('lodash');
var angular = require('angular');
var pdf = require('utils/pdfurl');
var hasPermission = require('utils/hasPermission');
var Promise = require('bluebird');

function haeHakemus(tyyppi, hakemus) {
  if (hakemus.hakemustyyppitunnus === tyyppi) {
    return hakemus;
  }

  return _.findWhere(hakemus['other-hakemukset'], {
    hakemustyyppitunnus: tyyppi
  });
}

function isElyhakemus(hakemus) {
  return _.contains(['ELY'], hakemus.hakemustyyppitunnus)
}

function isMaksatushakemus(hakemus) {
  return _.contains(['MH1', 'MH2'], hakemus.hakemustyyppitunnus)
}

loadInitialData.$inject = [
  'CommonService', '$stateParams', 'AvustuskohdeService', 'LiikenneSuoriteService',
  'LippuSuoriteService', 'HakemusService', 'KayttajaService', 'PaatosService', 'StatusService', 'ElyHakemusService'];

function loadInitialData(common, $stateParams, AvustuskohdeService, LiikenneSuoriteService, LippuSuoriteService, HakemusService, KayttajaService, PaatosService, StatusService, ElyHakemusService) {
  function haeAvustuskohteet(hakemus) {
    return AvustuskohdeService.hae(hakemus.id).then((data) => {
      return _.map(
        common.partitionBy(v => v.avustuskohdeluokkatunnus, data),
        (kohteet) => ({
          avustuskohteet: kohteet,
          tunnus: (_.first(kohteet).avustuskohdeluokkatunnus)
        }));
    });
  }

  const hakemusId = $stateParams.id;
  const hakemusPromise = HakemusService.hae(hakemusId);

  function isContentVisible(handler) {
    return function (hakemus) {
      if (hakemus.contentvisible) {
        return handler(hakemus);
      } else {
        return null;
      }
    }
  }

  function ifMaksatushakemus(then, defaultvalue) {
    return hakemusPromise.then((hakemus) => {
      if (isMaksatushakemus(hakemus)) {
        return then(hakemus);
      } else {
        return defaultvalue;
      }
    });
  }

  function ifElyhakemus(then, defaultvalue) {
    return hakemusPromise.then((hakemus) => {
      if (isElyhakemus(hakemus)) {
        return then(hakemus);
      } else {
        return defaultvalue;
      }
    });
  }

  var liikenneSuoritteet = ifMaksatushakemus(hakemus => LiikenneSuoriteService.hae(hakemus.id), []);
  var lippuSuoritteet = ifMaksatushakemus(hakemus => LippuSuoriteService.hae(hakemus.id), []);


  return Promise.props({
    hakemus: hakemusPromise,
    user: KayttajaService.hae(),
    paatos: PaatosService.hae(hakemusId),
    avustuskohdeluokat: hakemusPromise.then(isContentVisible(haeAvustuskohteet)),
    avustushakemusArvot: hakemusPromise.then(isContentVisible((hakemus) => {
      if (_.contains(['MH1', 'MH2'], (hakemus.hakemustyyppitunnus))) {
        return haeAvustuskohteet(haeHakemus('AH0', hakemus));
      }
    })),
    ajankohta: hakemusPromise.then((hakemus) => {
      const ajankohdat = {
        MH1: '1.1.-30.6.',
        MH2: '1.7.-31.12.'
      };
      return ajankohdat[hakemus.hakemustyyppitunnus];
    }),
    maksatushakemusArvot: hakemusPromise.then(isContentVisible((hakemus) => {
      if (hakemus.hakemustyyppitunnus === 'MH2') {
        const h = haeHakemus('MH1', hakemus);
        return haeAvustuskohteet(h);
      } else {
        return [];
      }
    })),
    avustushakemusPaatos: ifMaksatushakemus((hakemus) => {
      const id = haeHakemus('AH0', hakemus).id;
      return PaatosService.hae(id);
    }, {}),
    maksatushakemus1Paatos: hakemusPromise.then((hakemus) => {
      if (hakemus.hakemustyyppitunnus === 'MH2') {
        const id = haeHakemus('MH1', hakemus).id;
        return PaatosService.hae(id);
      } else {
        return {};
      }
    }),
    suoritetyypit: ifMaksatushakemus(hakemus => LiikenneSuoriteService.suoritetyypit(), []),
    lipputyypit: ifMaksatushakemus(hakemus => LippuSuoriteService.lipputyypit(), []),
    kehittamishankkeet: ifElyhakemus(hakemus => ElyHakemusService.haeKehityshankkeet(hakemus.id), []),
    maararahatarvetyypit: ifElyhakemus(hakemus => ElyHakemusService.haeMaararahatarvetyypit(), []),
    maararahaTarpeet: ifElyhakemus(hakemus => ElyHakemusService.haeMaararahatarpeet(hakemus.id), []),
    psaLiikenneSuoritteet: liikenneSuoritteet.then(suoritteet => _.filter(suoritteet, 'liikennetyyppitunnus', "PSA")),
    palLiikenneSuoritteet: liikenneSuoritteet.then(suoritteet => _.filter(suoritteet, 'liikennetyyppitunnus', "PAL")),
    kaupunkilippuSuoritteet: lippuSuoritteet.then(suoritteet => _.filter(suoritteet, function (suorite) {
      return suorite.lipputyyppitunnus !== "SE";
    })),
    seutulippuSuoritteet: lippuSuoritteet.then(suoritteet => _.filter(suoritteet, 'lipputyyppitunnus', "SE"))
  }).then(_.identity, StatusService.errorHandler);
}

module.exports.loadInitialData = loadInitialData;
angular.module('jukufrontApp')
  .controller('HakemusCtrl', ['$rootScope', '$scope', '$state', '$stateParams',
    'PaatosService', 'HakemusService', 'AvustuskohdeService', 'LiikenneSuoriteService', 'LippuSuoriteService', 'StatusService', 'CommonService', '$window', 'initials', 'ElyHakemusService',
    function ($rootScope, $scope, $state, $stateParams, PaatosService, HakemusService, AvustuskohdeService, LiikenneSuoriteService, LippuSuoriteService, StatusService, common, $window, initials, ElyHakemusService) {

      _.extend($scope, initials);

      function bindToScope(key) {
        return (value) => {
          $scope[key] = value;
        };
      }

      $scope.lisatoiminto = {
        EI: 0,
        ESIKATSELU: 1,
        LAHETA: 2
      };

      $scope.isHakija = function isHakija(user) {
        return hasPermission(user, 'modify-oma-hakemus') ||
          hasPermission(user, 'allekirjoita-oma-hakemus');
      };

      $scope.isOmaHakemus = function isOmaHakemus(user) {
        return $scope.hakemus.organisaatioid === user.organisaatioid;
      };

      $scope.hasPermission = hasPermission;
      $scope.allekirjoitusliitetty = false;
      $scope.hakemusid = parseInt($stateParams.id, 10);
      $scope.alv = false;

      $scope.backToList = function backToList() {
        if ($scope.isHakija($scope.user) && $scope.isOmaHakemus($scope.user)) {
          return $state.go('app.hakija.hakemukset.omat');
        }
        $state.go('app.yhteinen.hakemukset.list', {
          tyyppi: $scope.hakemus.hakemustyyppitunnus
        });
      };

      $scope.isTabSelected = function isTabSelected(tyyppi) {
        return $scope.hakemus.hakemustyyppitunnus === tyyppi;
      };

      $scope.toApplication = function toApplication(tyyppi) {
        const hakemus = haeHakemus(tyyppi, $scope.hakemus);

        $state.go('app.hakemus', {
          id: hakemus.id
        });
      };

      $scope.getHakija = function getHakija(hakemus) {
        return _.find($rootScope.organisaatiot, {id: hakemus.organisaatioid}).nimi;
      };


      function haeVertailuArvo(data, avustuskohdeluokka, avustuskohdelaji, arvo) {
        return parseFloat((_.find(_.find(data, {'tunnus': avustuskohdeluokka}).avustuskohteet, {
          'avustuskohdeluokkatunnus': avustuskohdeluokka,
          'avustuskohdelajitunnus': avustuskohdelaji
        }))[arvo]);
      }

      function lahetaHakemus() {
        HakemusService.lahetaHakemus($scope.hakemusid).then(
          function () {
            StatusService.ok('HakemusService.lahetaHakemus(' + $scope.hakemusid + ')', 'Lähettäminen onnistui.');
            $state.go('app.hakija.hakemukset.omat');
          }, StatusService.errorHandler);
      }

      function lahetaTaydennys() {
        HakemusService.lahetaTaydennys($scope.hakemusid)
          .then(function () {
            StatusService.ok('HakemusService.lahetaTaydennys(' + $scope.hakemusid + ')', 'Täydennyksen lähettäminen onnistui.');
            $state.go('app.hakija.hakemukset.omat');
          }, StatusService.errorHandler);
      }

      $scope.haePaatosPdf = function () {
        return pdf.getPaatosPdfUrl($scope.hakemusid);
      };

      $scope.haeHakemusPdf = function () {
        return pdf.getHakemusPdfUrl($scope.hakemusid);
      };

      $scope.haeAvustushakemusPaatosPdf = function () {
        return pdf.getPaatosPdfUrl(haeHakemus('AH0', $scope.hakemus).id);
      };

      $scope.haeMaksatushakemus1PaatosPdf = function () {
        return pdf.getPaatosPdfUrl(haeHakemus('MH1', $scope.hakemus).id);
      };

      $scope.haeAvustusProsentti = function (luokka, laji) {
        return AvustuskohdeService.avustusprosentti($scope.hakemus.vuosi, luokka, laji);
      };

      $scope.haeVertailuarvot = function (avustuskohdeluokka, avustuskohdelaji) {
        var avustushakemusHaettavaAvustus = 0;
        var avustushakemusOmaRahoitus = 0;
        var maksatushakemusHaettavaAvustus = 0;
        var maksatushakemusOmaRahoitus = 0;
        if ($scope.hakemus.hakemustyyppitunnus !== 'AH0' && (typeof $scope.avustushakemusArvot) !== 'undefined') {
          avustushakemusHaettavaAvustus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'haettavaavustus');
          avustushakemusOmaRahoitus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'omarahoitus');
        }
        if ($scope.hakemus.hakemustyyppitunnus === 'MH2' && (typeof $scope.maksatushakemusArvot) !== 'undefined') {
          maksatushakemusHaettavaAvustus = haeVertailuArvo($scope.maksatushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'haettavaavustus');
          maksatushakemusOmaRahoitus = haeVertailuArvo($scope.maksatushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'omarahoitus');
        }
        return {
          'avustushakemusHaettavaAvustus': avustushakemusHaettavaAvustus,
          'avustushakemusOmaRahoitus': avustushakemusOmaRahoitus,
          'maksatushakemusHaettavaAvustus': maksatushakemusHaettavaAvustus,
          'maksatushakemusOmaRahoitus': maksatushakemusOmaRahoitus
        };
      };

      $scope.haettuSummaYliMyonnetyn = function () {
        return $scope.sumHaettavaAvustus() > $scope.myonnettyAvustusPerJakso();
      };

      $scope.hakemusKeskenerainen = function () {
        return ($scope.hakemus.hakemustilatunnus === 'K' || $scope.hakemus.hakemustilatunnus === 'T0');
      };

      $scope.hakemusTaydennettavana = function () {
        return ($scope.hakemus.hakemustilatunnus === 'T0');
      };

      $scope.hakemusVireilla = function () {
        return ($scope.hakemus.hakemustilatunnus === 'V' || $scope.hakemus.hakemustilatunnus === 'TV');
      };

      $scope.hasPaatos = function (hakemustilatunnus) {
        return ($scope.paatos && $scope.paatos.voimaantuloaika);
      };

      $scope.hakemustyyppiSaatavilla = function (tyyppi){
        return $scope.hakemus.hakemustyyppitunnus===tyyppi || _.some($scope.hakemus['other-hakemukset'], {hakemustyyppitunnus: tyyppi});
      };

      $scope.maksatushakemus1PaatosOlemassa = function () {
        return ($scope.maksatushakemus1Paatos && $scope.maksatushakemus1Paatos.voimaantuloaika);
      };

      $scope.maksatushakemus1PaatosMaksettu = function () {
        return $scope.maksatushakemus1Paatos.myonnettyavustus;
      };

      $scope.myonnettyAvustusPerJakso = function () {
        if ($scope.onMaksatushakemus1()) {
          return ($scope.avustushakemusPaatos.myonnettyavustus / 2);
        }
        if ($scope.onMaksatushakemus2()) {
          return $scope.avustushakemusPaatos.myonnettyavustus - $scope.maksatushakemus1Paatos.myonnettyavustus;
        }
      };

      $scope.myonnettyAvustusPerVuosi = function () {
        return $scope.avustushakemusPaatos.myonnettyavustus;
      };

      $scope.naytaHakemus = function (tila) {
        if ((tila === 'K' || tila === 'T0') && $scope.isOmaHakemus($scope.user)) {
          $scope.tallennaHakemus($scope.lisatoiminto.ESIKATSELU);
        } else {
          $window.open(pdf.getHakemusPdfUrl($scope.hakemusid));
        }
      };

      $scope.onAvustushakemus = function () {
        return $scope.hakemus.hakemustyyppitunnus === 'AH0';
      };

      $scope.onMaksatushakemus1 = function () {
        return $scope.hakemus.hakemustyyppitunnus === 'MH1';
      };

      $scope.onMaksatushakemus2 = function () {
        return $scope.hakemus.hakemustyyppitunnus === 'MH2';
      };

      $scope.onElyhakemus = function () {
        return $scope.hakemus.hakemustyyppitunnus === 'ELY';
      };

      $scope.isMaksatushakemus = isMaksatushakemus($scope.hakemus);

      $scope.isELYhakemus = isElyhakemus($scope.hakemus);

      $scope.avustushakemusPaatosOlemassa = function () {
        return $scope.avustushakemusPaatos && $scope.avustushakemusPaatos.voimaantuloaika;
      };

      $scope.edellinenHakemusPaatetty = function () {
        if ($scope.onAvustushakemus() || $scope.onElyhakemus()) {
          return true;
        }
        return $scope.avustushakemusPaatosOlemassa();
      };

      $scope.taydennyspyyntoSeliteOlemassa = function () {
        return $scope.hakemus.taydennyspyynto;
      };

      $scope.haeLajitunnus = function (organisaatioid) {
        return _.find($rootScope.organisaatiot, {'id': organisaatioid}).lajitunnus;
      };

      $scope.sumHaettavaAvustus = function () {
        var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
          return l.avustuskohteet;
        }));
        return _.sum(avustuskohteet, 'haettavaavustus');
      };

      $scope.sumHaettavaElyAvustus = function () {
        var maararahatarpeetSum = $scope.hakemus.ely.siirtymaaikasopimukset + $scope.hakemus.ely.joukkoliikennetukikunnat + _.sum($scope.maararahatarpeet, 'sidotut') + _.sum($scope.maararahatarpeet, 'uudet') - _.sum($scope.maararahatarpeet, 'tulot');
        var kehittamishankkeetSum = _.sum($scope.kehittamishankkeet, 'arvo');;
        return (maararahatarpeetSum + kehittamishankkeetSum);
      };

      function validiHakemus() {
        return (($scope.hakemusForm.$valid && ($scope.onAvustushakemus() || $scope.onElyhakemus())) ||
        (($scope.onMaksatushakemus1() || $scope.onMaksatushakemus2()) &&
        $scope.hakemusForm.$valid && !$scope.haettuSummaYliMyonnetyn()));
      }

      $scope.hakemusTallentaminenEnabled = function () {
        return $scope.hakemusKeskenerainen() &&
          $scope.sallittu('modify-oma-hakemus') &&
          $scope.isOmaHakemus($scope.user);
      };

      $scope.tallentaminenDisabledTooltip = function () {
        if (!$scope.sallittu('modify-oma-hakemus')) {
          return "Käyttäjällä ei ole oikeutta muokata hakemuksia";
        } else if (!$scope.isOmaHakemus($scope.user)) {
          return "Vain oman hakemuksen tiedot voi tallentaa";
        } else if (!$scope.hakemusKeskenerainen()) {
          return "Vain keskeneräistä hakemusta voi muokata";
        } else {
          return ""
        }
      };

      $scope.hakemusLahettaminenEnabled = function () {
        return $scope.hakemusKeskenerainen() &&
          ($scope.onElyhakemus() || (($scope.onAvustushakemus() || $scope.onMaksatushakemus1() ||
          $scope.onMaksatushakemus2()) && $scope.allekirjoitusliitetty &&
          $scope.liitteetOlemassa())) &&
          $scope.edellinenHakemusPaatetty() &&
          $scope.sallittu('allekirjoita-oma-hakemus') &&
          $scope.isOmaHakemus($scope.user);
      };

      $scope.lahetysDisabledTooltip = function () {
        if (!$scope.hakemusKeskenerainen()) {
          return "Hakemuksen voi lähettää vain jos se on keskeneräinen";
        } else if (!$scope.sallittu('allekirjoita-oma-hakemus')) {
          return "Käyttäjällä ei ole oikeutta lähettää hakemuksia";
        } else if (!$scope.isOmaHakemus($scope.user)) {
          return "Vain hakijaorganisaation edustajilla on oikeus lähettää hakemus.";
        } else if (($scope.onAvustushakemus() || $scope.onMaksatushakemus1() || $scope.onMaksatushakemus2()) && !$scope.liitteetOlemassa()) {
          return "Allekirjoitusoikeusdokumenttia ei ole liitetty";
        } else if (($scope.onAvustushakemus() || $scope.onMaksatushakemus1() || $scope.onMaksatushakemus2()) && !$scope.allekirjoitusliitetty && $scope.liitteetOlemassa()) {
          return "Olethan merkinnyt \"Olen liittänyt hakemukseen tarvittavat lisätiedot mukaan lukien liitteen allekirjoitusoikeudesta.\"-kohdan valituksi?";
        } else if (!$scope.edellinenHakemusPaatetty()) {
          return "Edeltävää hakemusta ei ole päätetty."
        } else {
          return ""
        }
      };

      $scope.tallennaHakemus = function (lisa_toiminto) {
        var tallennusPromise = [];
        StatusService.tyhjenna();
        $scope.$broadcast('show-errors-check-validity');

        if (!validiHakemus()) {
          $scope.$emit('focus-invalid');
          StatusService.virhe('AvustuskohdeService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
          return;
        }

        if (lisa_toiminto === $scope.lisatoiminto.ESIKATSELU) {
          var ikkuna = $window.open('about:blank', '_blank');
        }

        if (isElyhakemus($scope.hakemus)) {
          tallennusPromise.push(ElyHakemusService.tallennaElyPerustiedot($scope.hakemus.id, $scope.hakemus.ely));
          tallennusPromise.push(ElyHakemusService.tallennaMaararahatarpeet($scope.hakemus.id, $scope.maararahaTarpeet));
          tallennusPromise.push(ElyHakemusService.tallennaKehityshankkeet($scope.hakemus.id, $scope.kehittamishankkeet));
        } else {
          var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
            return l.avustuskohteet;
          }));

          avustuskohteet = _.map(avustuskohteet, function (kohde) {
            return _.omit(kohde, 'alv');
          });

          tallennusPromise.push([AvustuskohdeService.tallenna(avustuskohteet)]);
          if (isMaksatushakemus($scope.hakemus)) {
            tallennusPromise.push(LiikenneSuoriteService.tallenna(
              $scope.hakemus.id, $scope.psaLiikenneSuoritteet.concat($scope.palLiikenneSuoritteet)));
            tallennusPromise.push(LippuSuoriteService.tallenna(
              $scope.hakemus.id, $scope.kaupunkilippuSuoritteet.concat($scope.seutulippuSuoritteet)));
          }
        }

        Promise.all(tallennusPromise)
          .then(function () {
            StatusService.ok('AvustuskohdeService.tallenna()', 'Tallennus onnistui.');
            $scope.hakemusForm.$setPristine();

            HakemusService.hae($scope.hakemusid)
              .then(bindToScope('hakemus'));

            switch (lisa_toiminto) {
              case $scope.lisatoiminto.EI:
                // Pelkka tallennus
                break;
              case $scope.lisatoiminto.ESIKATSELU:
                // Esikatselu
                ikkuna.location.href = pdf.getHakemusPdfUrl($scope.hakemusid);
                break;
              case $scope.lisatoiminto.LAHETA:
                // Laheta
                if ($scope.hakemus.hakemustilatunnus === 'K') {
                  lahetaHakemus();
                } else if ($scope.hakemus.hakemustilatunnus === 'T0') {
                  lahetaTaydennys();
                }
                break;
            }

          }, StatusService.errorHandler);

      };

      $scope.tarkastaHakemus = function () {
        HakemusService.tarkastaHakemus($scope.hakemusid)
          .then(function () {
            StatusService.ok('HakemusService.tarkastaHakemus(' + $scope.hakemusid + ')', 'Hakemus päivitettiin tarkastetuksi.');
            $state.go('app.yhteinen.hakemukset.list', {tyyppi: $scope.hakemus.hakemustyyppitunnus});
          }, StatusService.errorHandler);
      };

      $window.scrollTo(0, 0);
    }
  ]);
