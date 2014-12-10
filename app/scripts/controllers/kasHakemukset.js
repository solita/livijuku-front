'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuksetCtrl
 * @description
 * # KasHakemuksetCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasHakemuksetCtrl', function ($scope, $filter, $location, HakemuksetOsasto) {

    $scope.displayed=[];
    var loadData = function () {
      HakemuksetOsasto.getAvustushakemuksetVuosi('2015')
        .then(function (data) {
          $scope.hakemuksetVuosi = [];
          angular.forEach(data, function (hakemus) {
            $scope.hakemuksetVuosi.push({
              hakija: hakemus.osasto,
              hakemuksenTila: hakemus.avustushakemusstatus,
              viimeisinMuutos: $filter('date')(hakemus.aikaleima, 'dd/MM/yyyy HH:mm'),
              diaarinumero: hakemus.diaarinumero,
              kasittelija: hakemus.kasittelija,
              id: hakemus.id
            });
          });
        })
    };
    $scope.getKasHakemus = function (hakemusId){
      console.log('KasHakemukset,getHakemusId:'+hakemusId);
      $location.path('/k/hakemus');
    };
    loadData();
  })
