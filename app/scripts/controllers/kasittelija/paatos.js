'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaPaatosCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'HakemusService', 'StatusService', 'PaatosService', function ($rootScope, $scope, $routeParams, $location, HakemusService, StatusService, PaatosService) {
    $scope.hakemusid = $routeParams.hakemusid;
    $scope.haettuavustus = $routeParams.haettuavustus;
    $scope.avustus = $routeParams.avustus;
    $scope.vuosi = $routeParams.vuosi;
    $scope.tyyppi = $routeParams.tyyppi;
    $scope.aikaleima = new Date();

    HakemusService.hae($scope.hakemusid)
      .success(function (data) {
        $scope.avustushakemus = data;
        $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
      })
      .error(function (data) {
        StatusService.virhe('HakemusService.hae(' + $routeParams.id + ')', data);
      });

    PaatosService.hae($scope.hakemusid)
      .success(function (data) {
        $scope.paatos = data;
      })
      .error(function (data) {
        StatusService.virhe('PaatosService.hae(' + $scope.hakemusid + ')', data);
      });

    $scope.naytaPaatos = function () {
      $location.path('/k/paatos/esikatselu/'+$scope.vuosi+'/'+$scope.tyyppi+'/'+$scope.hakemusid+'/'+$scope.haettuavustus+'/'+$scope.avustus);
    };

    $scope.tallennaPaatos = function(){

      var paatosdata = {
        "hakemusid": parseInt($scope.hakemusid),
        "myonnettyavustus": $scope.paatos.myonnettyavustus,
        "selite": $scope.paatos.selite
      }
      PaatosService.tallenna($scope.hakemusid,paatosdata)
        .success(function () {
          StatusService.ok('PaatosService.tallenna()', 'Tallennus onnistui.');
        })
        .error(function (data) {
          StatusService.virhe('PaatosService.tallenna(' + paatosdata + ')', data);
        });
    }

    $scope.lahetaPaatos = function () {
      PaatosService.tarkasta($scope.avustushakemus.id)
        .success(function () {
          StatusService.ok('HakemusService.tarkasta(' + $scope.avustushakemus.id + ')', 'Hakemus päivitettiin tarkastetuksi.');
          $location.path('/k/hakemukset');
        })
        .error(function (data) {
          StatusService.virhe('HakemusService.tarkasta(' + $scope.avustushakemus.id + ')', data);
        });
    };

  }]);
