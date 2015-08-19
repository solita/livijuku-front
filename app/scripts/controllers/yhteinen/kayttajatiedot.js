'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('KayttajatiedotCtrl', ['$scope', '$rootScope', 'KayttajaService', function ($scope, $rootScope, KayttajaService) {

    KayttajaService.haeKaikki()
      .success(function (data) {
        $scope.kayttajat = data;
        $scope.liikenneviraston_henkilot=_.filter(data, function(henkilo){
          return henkilo.organisaatioid === 15;
        });
        var toimivaltaiset = _.filter(data, function(henkilo){
            return henkilo.organisaatioid !== 15;
          });
        $scope.toimivaltaiset_viranomaiset = _.map(toimivaltaiset, function(element) {
          return _.extend({}, element, {organisaationimi:  _.find($rootScope.organisaatiot, {'id': element.organisaatioid}).nimi});
        });


      })
      .error(function (data) {
        StatusService.virhe('KayttajaService.haeKaikki()', data.message);
      });
  }]);
