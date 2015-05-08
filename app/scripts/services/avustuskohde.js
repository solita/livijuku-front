'use strict';

angular.module('services.avustuskohde', [])

  .factory('AvustuskohdeService', ['$http', function ($http) {
    return {
      avustusprosentti: function (vuosi, luokka, laji) {
        var avustusprosentti = 50;
        if (luokka=='K' && laji=='RT') {
          avustusprosentti = 30;
        }
          return avustusprosentti;
      },
      hae: function (hakemusid) {
        return $http.get('api/hakemus/avustuskohteet/' + hakemusid);
      },
      luokittelu: function () {
        return $http.get('api/avustuskohdeluokittelu');
      },
      tallenna: function (avustuskohteet) {
        return $http.put('api/avustuskohteet', avustuskohteet);
      }
    };
  }]);
