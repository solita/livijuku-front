'use strict';

var angular = require('angular');
var _ = require('lodash');
var t = require('utils/tunnusluvut');

function tunnuslukuURL(tunnusluku, vuosi, organisaatioid, sopimustyyppitunnus) {
  return 'api/' + tunnusluku + '/' + vuosi + '/' + organisaatioid + '/' + sopimustyyppitunnus;
}

angular.module('services.tunnusluvut', [])

  .factory('TunnuslukuEditService', ['$http', function ($http) {

    function createHakuOperation(tunnusluku, defaultdata) {
      return function (vuosi, organisaatioid, sopimustyyppitunnus) {
        return $http.get(tunnuslukuURL(tunnusluku, vuosi, organisaatioid, sopimustyyppitunnus))
          .then(res =>
            res.data.length === 0 ?
              defaultdata(vuosi, organisaatioid, sopimustyyppitunnus) :
              res.data);
      };
    }

    function createTallennaOperation(tunnusluku) {
      return function (vuosi, organisaatioid, sopimustyyppitunnus, kalusto) {
        return $http.put(tunnuslukuURL(tunnusluku, vuosi, organisaatioid, sopimustyyppitunnus), kalusto);
      };
    }

    return {
      // liikennevuosi
      haeKysyntaTarjonta: createHakuOperation('liikennetilastot',
        () => _.map(_.range(1, 13), kuukausi => ({
          kuukausi: kuukausi,
          nousut: null,
          lahdot: null,
          linjakilometrit: null
        }))),
      tallennaKysyntaTarjonta: createTallennaOperation('liikennetilastot'),

      // liikenneviikko
      haeKysyntaTarjontaViikko: createHakuOperation('liikenneviikko',
        () => _.map(t.viikonpaivaluokat, tunnus => ({
          viikonpaivaluokkatunnus: tunnus,
          nousut: null,
          lahdot: null,
          linjakilometrit: null
        }))),
      tallennaKysyntaTarjontaViikko: createTallennaOperation('liikenneviikko'),

      // kalusto
      haeKalusto: createHakuOperation('kalusto',
        () => _.map(t.paastoluokat, tunnus => ({
          paastoluokkatunnus: tunnus,
          lukumaara: null
        }))),
      tallennaKalusto: createTallennaOperation('kalusto'),

      // liikennöintikorvaus
      haeLiikennointikorvaus: createHakuOperation('liikennointikorvaus',
        () => _.map(_.range(1, 13), kuukausi => ({
          kuukausi: kuukausi,
          korvaus: null,
          nousukorvaus: null,
          nousut: null
        }))),
      tallennaLiikennointikorvaus: createTallennaOperation('liikennointikorvaus'),

      // lipputulo
      haeLipputulo: createHakuOperation('lipputulo',
        () => _.map(_.range(1, 13), kuukausi => ({
          kuukausi: kuukausi,
          kertalipputulo: null,
          arvolipputulo: null,
          kausilipputulo: null,
          lipputulo: null
        }))),
      tallennaLipputulo: createTallennaOperation('lipputulo'),

      // kommentti
      haeKommentti: function (vuosi, organisaatioid, sopimustyyppitunnus) {
        return $http.get('api/kommentti/' + vuosi + '/' + organisaatioid + '/' + sopimustyyppitunnus).then(res =>
          res.data
        )
      },
      tallennaKommentti: function (vuosi, organisaatioid, sopimustyyppitunnus, kommentti) {
        return $http.put('api/kommentti/' + vuosi + '/' + organisaatioid + '/' + sopimustyyppitunnus, {kommentti: kommentti});
      },

      // lippuhinta
      haeLippuhinta: function (vuosi, organisaatioid) {
        return $http.get('api/lippuhinta/' + vuosi + '/' + organisaatioid).then(res =>
          res.data.length === 0 ?
            _.map(_.range(1, 7), vyohykemaara => ({
              vyohykemaara: vyohykemaara,
              kertalippuhinta: null,
              kausilippuhinta: null
            })) :
            res.data)
      },
      tallennaLippuhinta: function (vuosi, organisaatioid, lippuhinta) {
        return $http.put('api/lippuhinta/' + vuosi + '/' + organisaatioid, lippuhinta);
      },

      // alue
      haeAlue: function (vuosi, organisaatioid) {
        return $http.get('api/alue/' + vuosi + '/' + organisaatioid).then(res =>
          (res.data === null || res.data.length === 0) ?
          {
            asukasmaara: null,
            kustannus: {
              asiakaspalvelu: null,
              konsulttipalvelu: null,
              lipunmyyntipalkkio: null,
              jarjestelmat: null,
              muutpalvelut: null
            },
            vyohykemaara: null,
            pysakkimaara: null,
            kommentti: null,
            kuntamaara: null,
            autoistumisaste: null,
            pendeloivienosuus: null,
            tyopaikkamaara: null,
            henkiloautoliikennesuorite: null,
            asiakastyytyvaisyys: null,
            maapintaala: null,
            henkilosto: null
          } :
            res.data)
      },
      tallennaAlue: function (vuosi, organisaatioid, alue) {
        return $http.put('api/alue/' + vuosi + '/' + organisaatioid, alue);
      },

      // joukkoliikennetuki
      haeJoukkoliikennetuki: function (vuosi, organisaatioid) {
        return $http.get('api/joukkoliikennetuki/' + vuosi + '/' + organisaatioid).then(res =>
          (res.data === null || res.data.length === 0) ?
            {PSA: null ,HK: null, K: null} :
            _.mapValues(_.groupBy(res.data, 'avustuskohdeluokkatunnus'), group => _.first(group).tuki ));
      },
      tallennaJoukkoliikennetuki: function (vuosi, organisaatioid, joukkoliikennetuki) {
        return $http.put('api/joukkoliikennetuki/' + vuosi + '/' + organisaatioid,
          _.map(_.toPairs(joukkoliikennetuki), values => _.zipObject(['avustuskohdeluokkatunnus', 'tuki'], values)));
      },

      // täyttöaste
      haeTayttoasteKokoVuosi: function (vuosi, organisaatioid) {
        return $http.get('api/tunnusluku/tayttoaste/' + vuosi + '/' + organisaatioid).then(res => res.data);
      }
    }
  }])
;
