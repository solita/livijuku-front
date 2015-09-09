'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('KayttajatiedotCtrl', ['$scope', '$rootScope', 'KayttajaService', 'StatusService', function ($scope, $rootScope, KayttajaService, StatusService) {

    KayttajaService.haeKaikki()
      .then(function (response) {
        var data = response.data;
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


      }, StatusService.errorHandler);
  }]);
