'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:LahHakemusCtrl
 * @description
 * # LahHakemusCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('LahHakemusCtrl', function ($scope, $location, Osasto, $routeParams, HakemusFactory) {
    var loadData = function () {
      HakemusFactory.get({'id': $routeParams.id}, function (data) {
        $scope.avustushakemus = data;
      }, function (error) {
        console.log('lahHakemus.js' + error.toString());
      });
    };
    loadData();
  });

/**
 $scope.aikaleima = Date.now();
 Osasto.getOsasto('Pori')
 .then(function (data) {
        $scope.osastoTiedot = data;
      });
 HakemuksetOsasto.getAvustushakemus('Pori', '2015')
 .then(function (data) {
        $scope.avustushakemus = data;
      });

 $scope.sendAvustushakemus = function () {
      $scope.avustushakemus.avustushakemusstatus = 'Lähetetty';
      $scope.avustushakemus.aikaleima =  new Date();
      HakemuksetOsasto.saveAvustushakemus('Pori', '2015',$scope.avustushakemus )
        .then(function (data) {
          $scope.sendAvustushakemusStatus = data;
        });
      $location.path('/');
    };

 $scope.saveAvustushakemus = function () {
      $scope.avustushakemus.avustushakemusstatus = 'Keskeneräinen';
      $scope.avustushakemus.aikaleima =  new Date();
      HakemuksetOsasto.saveAvustushakemus('Pori', '2015',$scope.avustushakemus )
        .then(function (data) {
          $scope.saveAvustushakemusStatus = data;
        });
    };

 $scope.showAvustushakemus = function () {
    };
 */
