'use strict';

/*global angular */
var _ = require('lodash');
var $ = require('jquery');

angular.module('jukufrontApp')
  .controller('HakemusCtrl', ['$rootScope', '$scope', '$location', '$routeParams',
    'PaatosService', 'HakemusService', 'AvustuskohdeService', 'StatusService', 'Upload', 'LiiteService', 'CommonService', '$window',
    function ($rootScope, $scope, $location, $routeParams, PaatosService, HakemusService, AvustuskohdeService, StatusService, Upload, LiiteService, common, $window) {

      function haeAvustuskohteet(hakemusid, scopemuuttuja) {
        common.bindPromiseToScope(AvustuskohdeService.hae(hakemusid), $scope, scopemuuttuja,
          function (data) {
            return _.map(
              common.partitionBy(function (v) {
                return v.avustuskohdeluokkatunnus
              }, data),
              function (kohteet) {
                return {
                  avustuskohteet: kohteet,
                  tunnus: (_.first(kohteet).avustuskohdeluokkatunnus)
                }
              });
          }, 'AvustuskohdeService.hae(' + hakemusid + ')');
      }

      function haeHakemukset() {
        HakemusService.hae($scope.hakemusid)
          .success(function (data) {
            $scope.hakemus = data;
            $scope.hakija = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).nimi;
            $scope.pankkitilinumero = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).pankkitilinumero;
            $scope.aikaleima = new Date();
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.hae(' + $scope.hakemusid + ')', data);
          });

        haeLiitteet();

      }

      function haeLiitteet() {
        LiiteService.haeKaikki($scope.hakemusid)
          .success(function (data) {
            $scope.liitteet = _.map(data, function (element) {
              var paate = element.nimi.split('.').pop();
              var nimiosa = element.nimi.substring(0, (element.nimi.length - paate.length - 1));
              return _.extend({}, element, {nimiteksti: nimiosa}, {nimipaate: paate});
            });
          })
          .error(function (data) {
            StatusService.virhe('LiiteService.hae(' + $scope.hakemusid + ')', data);
          });
      }

      function haePaatos() {
        PaatosService.hae($scope.avustushakemusid)
          .success(function (data) {
            $scope.paatos = data;
          })
          .error(function (data) {
            StatusService.virhe('PaatosService.hae(' + $scope.avustushakemusid + ')', data);
          });
      }

      function haeVertailuArvo(data, avustuskohdeluokka, avustuskohdelaji, arvo) {
        return parseFloat((_.find(_.find(data, {'tunnus': avustuskohdeluokka}).avustuskohteet, {
          'avustuskohdeluokkatunnus': avustuskohdeluokka,
          'avustuskohdelajitunnus': avustuskohdelaji
        }))[arvo]);
      }

      $scope.$watch('myFiles', function () {
        if ($scope.myFiles != null) {
          for (var i = 0; i < $scope.myFiles.length; i++) {
            var file = $scope.myFiles[i];
            console.log('Watched:' + file.name);
            $scope.upload = Upload.upload({
              url: 'api/hakemus/' + $scope.hakemusid + '/liite',
              method: 'POST',
              data: {myObj: $scope.myModelObj},
              file: file,
              fileFormDataName: 'liite'
            }).progress(function (evt) {
              console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
            }).success(function (data, status, headers, config) {
              console.log('Liiteen lataus: ' + config.file.name + ' onnistui. Paluuarvo: ' + data);
              StatusService.ok('Liitteen lataus(' + config.file.name + ')', 'Liitteen lataus:' + config.file.name + ' onnistui.');
              haeLiitteet();
            }).error(function (data, status, headers, config) {
              console.log('Liitteen lataus: ' + config.file.name + ' epaonnistui. Paluuarvo: ' + data);
              //StatusService.virhe('Liitteen lataus('+config.file.name+')','Liitteen lataus:' + config.file.name + ' epaonnistui:'+data);
            });
          }
        }
      });

      /**
       * Asettaa liitteen muokkaustilaan
       * @param liitenumero
       */
      $scope.asetaEditTilaan = function (liitenumero) {
        haeLiitteet();
        $scope.editoitavaLiite = liitenumero;
      };

      $scope.asetaLiitenimi = function (nimi) {
        $scope.liitenimi = nimi;
      };

      $scope.haeAvustusProsentti = function (luokka, laji) {
        return AvustuskohdeService.avustusprosentti($scope.vuosi, luokka, laji);
      };

      $scope.haeVertailuarvot = function (avustuskohdeluokka, avustuskohdelaji) {
        var avustushakemusHaettavaAvustus = 0;
        var avustushakemusOmaRahoitus = 0;
        var maksatushakemusHaettavaAvustus = 0;
        var maksatushakemusOmaRahoitus = 0;
        if ($scope.tyyppi !== "AH0" && (typeof $scope.avustushakemusArvot) !== 'undefined') {
          avustushakemusHaettavaAvustus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'haettavaavustus');
          avustushakemusOmaRahoitus = haeVertailuArvo($scope.avustushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'omarahoitus');
        }
        if ($scope.tyyppi === "MH2" && (typeof $scope.maksatushakemusArvot) !== 'undefined') {
          maksatushakemusHaettavaAvustus = haeVertailuArvo($scope.maksatushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'haettavaavustus');
          maksatushakemusOmaRahoitus = haeVertailuArvo($scope.maksatushakemusArvot, avustuskohdeluokka, avustuskohdelaji, 'omarahoitus');
        }
        return {
          'avustushakemusHaettavaAvustus': avustushakemusHaettavaAvustus,
          'avustushakemusOmaRahoitus': avustushakemusOmaRahoitus,
          'maksatushakemusHaettavaAvustus': maksatushakemusHaettavaAvustus,
          'maksatushakemusOmaRahoitus': maksatushakemusOmaRahoitus
        };
      };

      $scope.hasPaatos = function (tyyppi, hakemustilatunnus) {
        return tyyppi == 'AH0' &&
          hakemustilatunnus == 'P' ||
          hakemustilatunnus == 'M';
      };

      $scope.lahetaHakemusTaiTaydennys = function (tila) {
        if (tila == 'K') {
          $scope.lahetaHakemus();
        } else if (tila == 'T0') {
          $scope.lahetaTaydennys();
        }
      };

      $scope.lahetaHakemus = function () {
        $scope.tallennaHakemus();
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.hakemusForm.$valid) {
          HakemusService.lahetaHakemus($scope.hakemusid)
            .success(function () {
              StatusService.ok('HakemusService.lahetaHakemus(' + $scope.hakemusid + ')', 'Lähettäminen onnistui.');
              $location.path('/h/hakemukset');
            })
            .error(function (data) {
              StatusService.virhe('HakemusService.lahetaHakemus(' + $scope.hakemusid + ')', data);
            });
        }
      };

      $scope.lahetaTaydennys = function () {
        $scope.tallennaHakemus();
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.hakemusForm.$valid) {
          HakemusService.lahetaTaydennys($scope.hakemusid)
            .success(function () {
              StatusService.ok('HakemusService.lahetaTaydennys(' + $scope.hakemusid + ')', 'Täydennyksen lähettäminen onnistui.');
              $location.path('/h/hakemukset');
            })
            .error(function (data) {
              StatusService.virhe('HakemusService.lahetaTaydennys(' + $scope.hakemusid + ')', data);
            });
        }
      };

      $scope.liiteNimiTyhja = function (nimi) {
        if (isNaN(nimi)) {
          return true;
        } else {
          return false;
        }
      };

      $scope.naytaHakemus = function (tila) {
        if (tila == 'K' || tila == 'T0') {
          $scope.tallennaHakemus(true);
        } else {
          $window.open('api/hakemus/' + $scope.hakemusid + '/pdf', 'target', '_blank');
        }
      };

      $scope.palaaTallentamattaLiite = function () {
        $scope.editoitavaLiite = -1;
        haeLiitteet();
      };

      $scope.paivitaLiiteNimi = function (liiteid, nimi, paate) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.hakemusForm.$valid) {
          if (nimi != $scope.liiteNimi) {
            var tiedostonimi = nimi + '.' + paate;
            LiiteService.paivitaNimi($scope.hakemusid, liiteid, tiedostonimi)
              .success(function (data) {
                StatusService.ok('LiiteService.paivitaNimi(' + $scope.hakemusid + ',' + liiteid + ',' + tiedostonimi + ')', 'Liitenimi päivitettiin onnistuneesti');
                $scope.editoitavaLiite = -1;
                haeLiitteet();
              })
              .error(function (data) {
                StatusService.virhe('LiiteService.paivitaNimi(' + $scope.hakemusid + ',' + liiteid + ',' + tiedostonimi + ')', data);
              });
          }
        } else {
          StatusService.virhe('LiiteService.paivitaNimi()', 'Anna liitteelle nimi ennen tallentamista.');
        }
      };

      $scope.poistaLiite = function (liiteid) {
        LiiteService.poista($scope.hakemusid, liiteid)
          .success(function (data) {
            StatusService.ok('LiiteService.poista(' + $scope.hakemusid + ',' + liiteid + ')', 'Liite poistettiin onnistuneesti');
            haeLiitteet();
          })
          .error(function (data) {
            StatusService.virhe('LiiteService.poista(' + $scope.hakemusid + ',' + liiteid + ')', data);
          });
      };

      $scope.sumHaettavaAvustus = function () {
        var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
          return l.avustuskohteet
        }));
        return _.sum(avustuskohteet, 'haettavaavustus');
      };

      $scope.tallennaHakemus = function (avaaEsikatselu) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.hakemusForm.$valid) {

          var avustuskohteet = _.flatten(_.map($scope.avustuskohdeluokat, function (l) {
            return l.avustuskohteet
          }));

          AvustuskohdeService.tallenna(avustuskohteet)
            .success(function () {
              var tallennusOk = true;
              if ($scope.hakemus.selite !== null) {
                var selitedata = {
                  'selite': $scope.hakemus.selite,
                  'hakemusid': $scope.hakemusid
                };
                HakemusService.tallennaSelite(selitedata)
                  .success(function () {
                  })
                  .error(function (data) {
                    StatusService.virhe('HakemusService.tallennaSelite(' + selitedata + ')', data);
                    tallennusOk = false;
                  });
              }
              if (tallennusOk) {
                StatusService.ok('AvustuskohdeService.tallenna()', 'Tallennus onnistui.');
                haeHakemukset();
                if (avaaEsikatselu) {
                  $window.open('api/hakemus/' + $scope.hakemusid + '/pdf', 'target', '_blank');
                }
              }
            })
            .error(function (data) {
              StatusService.virhe('AvustuskohdeService.tallenna()', data);
            });
        } else {
          $('input.ng-invalid').focus();
          StatusService.virhe('AvustuskohdeService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
        }
      };

      $scope.tarkastaHakemus = function () {
        HakemusService.tarkastaHakemus($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.tarkastaHakemus(' + $scope.hakemusid + ')', 'Hakemus päivitettiin tarkastetuksi.');
            $location.path('/k/hakemukset/' + $scope.tyyppi);
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.tarkastaHakemus(' + $scope.hakemusid + ')', data);
          });
      };

      $scope.tarkastaTaydennys = function () {
        HakemusService.tarkastaTaydennys($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.tarkastaTaydennys(' + $scope.hakemusid + ')', 'Täydennetty hakemus päivitettiin tarkastetuksi.');
            $location.path('/k/hakemukset/' + $scope.tyyppi);
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.tarkastaTaydennys(' + $scope.hakemusid + ')', data);
          });
      };

      $scope.taydennyspyynto = function () {
        HakemusService.taydennyspyynto($scope.hakemusid)
          .success(function () {
            StatusService.ok('HakemusService.taydennyspyynto(' + $scope.hakemusid + ')', 'Hakemus päivitettiin tädennettäväksi.');
            $location.path('/k/hakemukset/' + $scope.tyyppi);
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.taydennyspyynto(' + $scope.hakemusid + ')', data);
          });
      };

      $scope.allekirjoitusliitetty = false;
      $scope.avustushakemusid = $routeParams.id;
      $scope.editoitavaLiite = -1;
      $scope.liitenimi = '';
      $scope.maksatushakemus1id = $routeParams.m1id;
      $scope.maksatushakemus2id = $routeParams.m2id;
      $scope.myFiles = [];
      $scope.tyyppi = $routeParams.tyyppi;
      $scope.vuosi = $routeParams.vuosi;

      if ($scope.tyyppi === "AH0") {
        $scope.hakemusid = parseInt($scope.avustushakemusid);
      } else if ($scope.tyyppi == "MH1") {
        $scope.hakemusid = parseInt($scope.maksatushakemus1id);
        $scope.ajankohta = '1.1.-30.6.';
        haeAvustuskohteet($scope.avustushakemusid, "avustushakemusArvot");
      } else if ($scope.tyyppi == "MH2") {
        $scope.hakemusid = parseInt($scope.maksatushakemus2id);
        $scope.ajankohta = '1.7.-31.12.';
        haeAvustuskohteet($scope.avustushakemusid, "avustushakemusArvot");
        haeAvustuskohteet($scope.maksatushakemus1id, "maksatushakemusArvot");
      }

      haeHakemukset();
      haeAvustuskohteet($scope.hakemusid, "avustuskohdeluokat");
      haePaatos();
      $window.scrollTo(0, 0);
    }
  ]);
