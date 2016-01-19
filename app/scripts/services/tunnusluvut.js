'use strict';

var angular = require('angular');
var _ = require('lodash');
var t = require('utils/tunnusluvut');

function liikennetilastotURL(vuosi, organisaatioid, sopimustyyppitunnus) {
  return 'api/liikennetilastot/' + vuosi + '/' + organisaatioid + '/' + sopimustyyppitunnus;
}

function liikenneviikkoURL(vuosi, organisaatioid, sopimustyyppitunnus) {
  return 'api/liikenneviikko/' + vuosi + '/' + organisaatioid + '/' + sopimustyyppitunnus;
}

function kalustoURL(vuosi, organisaatioid, sopimustyyppitunnus) {
  return 'api/kalusto/' + vuosi + '/' + organisaatioid + '/' + sopimustyyppitunnus;
}

angular.module('services.tunnusluvut', [])

  .factory('TunnuslukuEditService', ['$http', function ($http) {
    return {
      haeKysyntaTarjonta: function (vuosi, organisaatioid, sopimustyyppitunnus) {
        return $http.get(liikennetilastotURL(vuosi, organisaatioid, sopimustyyppitunnus)).then(res =>
          res.data.length === 0 ?
            _.map(_.range(1, 13), kuukausi =>
              ({
                kuukausi: kuukausi,
                nousut: null,
                lahdot: null,
                linjakilometrit: null
              })) :
            res.data);
      },
      tallennaKysyntaTarjonta: function (vuosi, organisaatioid, sopimustyyppitunnus, kuukaudet) {
        return $http.put(liikennetilastotURL(vuosi, organisaatioid, sopimustyyppitunnus), kuukaudet);
      },

      haeKysyntaTarjontaViikko: function (vuosi, organisaatioid, sopimustyyppitunnus) {
        return $http.get(liikenneviikkoURL(vuosi, organisaatioid, sopimustyyppitunnus)).then(res =>
          res.data.length === 0 ?
            _.map(t.viikonpaivaluokat, tunnus =>
              ({
                viikonpaivaluokkatunnus: tunnus,
                nousut: null,
                lahdot: null,
                linjakilometrit: null
              })) :
            res.data);
      },
      tallennaKysyntaTarjontaViikko: function (vuosi, organisaatioid, sopimustyyppitunnus, viikko) {
        return $http.put(liikenneviikkoURL(vuosi, organisaatioid, sopimustyyppitunnus), viikko);
      },
      haeKalusto: function (vuosi, organisaatioid, sopimustyyppitunnus) {
        return $http.get(kalustoURL(vuosi, organisaatioid, sopimustyyppitunnus)).then(res =>
          res.data.length === 0 ?
            _.map(t.paastoluokat, tunnus =>
              ({
                paastoluokkatunnus: tunnus,
                lukumaara: null
              })) :
            res.data);
      },
      tallennaKalusto: function (vuosi, organisaatioid, sopimustyyppitunnus, kalusto) {
        return $http.put(kalustoURL(vuosi, organisaatioid, sopimustyyppitunnus), kalusto);
      }
    };
  }]);
