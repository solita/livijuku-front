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
          nousukorvaus: null
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
      tallennaLipputulo: createTallennaOperation('lipputulo')
    }
  }]);
