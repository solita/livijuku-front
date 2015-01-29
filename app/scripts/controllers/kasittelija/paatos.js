'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaPaatosCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'HakemusService', 'StatusService', 'PaatosService', function ($rootScope, $scope, $routeParams, $location, HakemusService, StatusService, PaatosService) {
    $scope.hakemusid = $routeParams.hakemusid;
    $scope.haettuavustus = $routeParams.haettuavustus;
    $scope.avustus = $routeParams.avustus;
    $scope.vuosi = $routeParams.vuosi;
    $scope.tyyppi = $routeParams.tyyppi;
    $scope.aikaleima = new Date();
    $scope.vanhaArvo = 0;

    function haePaatosTiedot() {
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
          if (data == null) {
            $scope.paatos = {
              myonnettyavustus: 0,
              selite: ""
            };
          } else {
            $scope.paatos = data;
          }
        })
        .error(function (data) {
          StatusService.virhe('PaatosService.hae(' + $scope.hakemusid + ')', data);
        });
    }

    $scope.asetaVanhaArvo = function (arvo) {
      $scope.vanhaArvo = arvo;
    };

    $scope.naytaPaatos = function () {
      $location.path('/k/paatos/esikatselu/' + $scope.vuosi + '/' + $scope.tyyppi + '/' + $scope.hakemusid + '/' + $scope.haettuavustus + '/' + $scope.avustus);
    };

    $scope.tallennaPaatos = function () {
      if (isNaN($scope.paatos.myonnettyavustus)) {
        return;
      }
      var paatosdata = {
        "hakemusid": parseInt($scope.hakemusid),
        "myonnettyavustus": $scope.paatos.myonnettyavustus,
        "selite": $scope.paatos.selite
      }
      PaatosService.tallenna($scope.hakemusid, paatosdata)
        .success(function () {
          StatusService.ok('PaatosService.tallenna()', 'Tallennus onnistui.');
        })
        .error(function (data) {
          StatusService.virhe('PaatosService.tallenna(' + paatosdata + ')', data);
        });
    };

    $scope.tarkistaTyhja = function(arvo){
      if (isNaN(arvo)) {
        $scope.paatos.myonnettyavustus = $scope.vanhaArvo;
      }
    };

    $scope.hyvaksyPaatos = function () {
      PaatosService.hyvaksy($scope.avustushakemus.id)
        .success(function () {
          StatusService.ok('PaatosService.hyvaksy(' + $scope.avustushakemus.id + ')', 'Hakemus päivitettiin päätetyksi.');
          $location.path('/k/suunnittelu/' + $scope.vuosi + '/' + $scope.tyyppi);
        })
        .error(function (data) {
          StatusService.virhe('PaatosService.hyvaksy(' + $scope.avustushakemus.id + ')', data);
        });
    };
    haePaatosTiedot()
  }]);
