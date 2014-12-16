'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuksetCtrl
 * @description
 * # KasHakemuksetCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasSuunnitteluCtrl', function ($scope, $location, $routeParams) {

    $scope.vuosi = $routeParams.vuosi;

    $scope.hakemuksetSuunnittelu = [{
      'hakemusId': '1',
      'hakija': 'Pori',
      'haettuAvustus': 1000000,
      'myonnettavaAvustus': 0
    }, {
      'hakemusId': '2',
      'hakija': 'Hämeenlinna',
      'haettuAvustus': 500000,
      'myonnettavaAvustus': 0
    }, {
      'hakemusId': '3',
      'hakija': 'Joensuu',
      'haettuAvustus': 300000,
      'myonnettavaAvustus': 0
    }];

    $scope.getPaatos = function (hakemusId, avustus){
      $location.path('/k/paatos/'+hakemusId+'/'+avustus);
    };
  })
