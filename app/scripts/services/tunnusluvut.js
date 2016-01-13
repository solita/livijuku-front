'use strict';

var angular = require('angular');
var _ = require('lodash');

function liikennetilastotURL(vuosi, organisaatioid, sopimustyyppitunnus) {
  return 'api/liikennetilastot/' + vuosi + '/' + organisaatioid  + '/' + sopimustyyppitunnus;
}

angular.module('services.tunnusluvut', [])

  .factory('TunnuslukuEditService', ['$http', function ($http) {
    return {
      haeKysyntaTarjonta: function (vuosi, organisaatioid, sopimustyyppitunnus) {
        return $http.get(liikennetilastotURL(vuosi, organisaatioid, sopimustyyppitunnus)).then(res =>
          res.data.length === 0 ?
            _.map(_.range(1,13), kuukausi =>
              ({kuukausi: kuukausi,
                nousut: null,
                lahdot: null,
                linjakilometrit: null})) :
            res.data);
      },
      tallennaKysyntaTarjonta: function (vuosi, organisaatioid, sopimustyyppitunnus, kuukaudet) {
        return $http.put(liikennetilastotURL(vuosi, organisaatioid, sopimustyyppitunnus), kuukaudet);
      }
    };
  }]);
