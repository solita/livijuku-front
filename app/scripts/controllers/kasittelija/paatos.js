'use strict';

var _ = require('lodash');

angular.module('jukufrontApp')
  .controller('KasittelijaPaatosCtrl', ['$rootScope', '$scope', '$routeParams', '$location', 'HakemusService', 'StatusService', 'PaatosService', 'SuunnitteluService','$window', function ($rootScope, $scope, $routeParams, $location, HakemusService, StatusService, PaatosService, SuunnitteluService, $window) {

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

    $scope.hakemusid = parseInt($routeParams.hakemusid);
    $scope.haettuavustus = $routeParams.haettuavustus;
    $scope.avustus = $routeParams.avustus;
    $scope.vuosi = $routeParams.vuosi;
    $scope.tyyppi = $routeParams.tyyppi;
    $scope.lajitunnus = $routeParams.lajitunnus;
    $scope.aikaleima = new Date();
    $scope.vanhaArvo = 0;

    $scope.asetaVanhaArvo = function (arvo) {
      $scope.vanhaArvo = arvo;
    };

    $scope.hyvaksyPaatos = function (paatosForm) {
      if (paatosForm.$valid) {
        var paatosdata = {
          "hakemusid": parseInt($scope.hakemusid),
          "myonnettyavustus": parseFloat($scope.avustus),
          "selite": $scope.paatos.selite
        }
        PaatosService.tallenna($scope.hakemusid, paatosdata)
          .success(function () {
            StatusService.ok('PaatosService.tallenna()', 'Tallennus onnistui.');
            PaatosService.hyvaksy($scope.hakemusid)
              .success(function () {
                StatusService.ok('PaatosService.hyvaksy(' + $scope.hakemusid + ')', 'Hakemus päivitettiin päätetyksi.');
                SuunnitteluService.suunniteltuAvustus(parseFloat($scope.avustus), $scope.hakemusid)
                  .success(function () {
                  })
                  .error(function (data) {
                    StatusService.virhe('SuunnitteluService.suunniteltuAvustus(' + $scope.avustus + ',' + $scope.hakemusid + ')', data);
                  });
                $location.path('/k/suunnittelu/' + $scope.vuosi + '/' + $scope.tyyppi + '/' + $scope.lajitunnus);
              })
              .error(function (data) {
                StatusService.virhe('PaatosService.hyvaksy(' + $scope.hakemusid + ')', data);
              });
            haePaatosTiedot();
          })
          .error(function (data) {
            StatusService.virhe('PaatosService.tallenna(' + paatosdata + ')', data);
          });
      }
      else {
        StatusService.virhe('PaatosService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
      }
    };

    $scope.naytaPaatos = function (tila, paatosForm) {
      if (tila == 'T') {
        if (paatosForm.$valid) {
          $scope.tallennaPaatos(paatosForm);
          $window.open('api/hakemus/'+$scope.hakemusid+'/paatos/1/pdf','target', '_blank');
        } else {
          StatusService.virhe('PaatosService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
        }
      } else {
        $window.open('api/hakemus/'+$scope.hakemusid+'/paatos/1/pdf','target', '_blank');
      }
    };

    $scope.peruPaatos = function () {
      PaatosService.peru($scope.hakemusid)
        .success(function () {
          StatusService.ok('PaatosService.peru(' + $scope.hakemusid + ')', 'Hakemuksen päätös peruttiin.');
          $location.path('/k/suunnittelu/' + $scope.vuosi + '/' + $scope.tyyppi + '/' + $scope.lajitunnus);
        })
        .error(function (data) {
          StatusService.virhe('PaatosService.peru(' + $scope.hakemusid + ')', data);
        });
    };

    $scope.tallennaPaatos = function (paatosForm) {
      if (paatosForm.$valid) {
        var paatosdata = {
          "hakemusid": parseInt($scope.hakemusid),
          "myonnettyavustus": parseFloat($scope.avustus),
          "selite": $scope.paatos.selite
        }
        PaatosService.tallenna($scope.hakemusid, paatosdata)
          .success(function () {
            StatusService.ok('PaatosService.tallenna()', 'Tallennus onnistui.');
            haePaatosTiedot();
          })
          .error(function (data) {
            StatusService.virhe('PaatosService.tallenna(' + paatosdata + ')', data);
          });
      }
      else {
        StatusService.virhe('PaatosService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
      }
    };

    $scope.tarkistaTyhja = function (arvo) {
      if (isNaN(arvo)) {
        $scope.paatos.myonnettyavustus = $scope.vanhaArvo;
      }
    };

    haePaatosTiedot()
  }]);
