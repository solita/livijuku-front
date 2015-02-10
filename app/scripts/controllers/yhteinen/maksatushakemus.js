'use strict';

angular.module('jukufrontApp')
  .controller('MaksatusHakemusCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'HakemusService', 'AvustuskohdeService', 'StatusService', '$upload', 'LiiteService', function ($rootScope, $scope, $location, $routeParams, HakemusService, AvustuskohdeService, StatusService, $upload, LiiteService) {

    function euroSyoteNumeroksi(arvo) {
      return parseFloat(arvo.replace(/[^0-9,]/g, '').replace(',', '.'));
    };

    function haeHaettavaavustus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseFloat((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).haettavaavustus);
      }
      else {
        return 0;
      }
    }

    function haeHakemukset() {
      HakemusService.hae($scope.hakemusid)
        .success(function (data) {
          $scope.avustushakemus = data;
          $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
          $scope.pankkitilinumero = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).pankkitilinumero;
          $scope.aikaleima = new Date();
        })
        .error(function (data) {
          StatusService.virhe('HakemusService.hae(' + $scope.hakemusid + ')', data);
        });
      AvustuskohdeService.hae($scope.hakemusid)
        .success(function (data) {
          $scope.aktiivisetavustuskohteet = data;
          $scope.psa1haettavaavustus = haeHaettavaavustus('PSA-1');
          $scope.psa1omarahoitus = haeOmarahoitus('PSA-1');
          $scope.psa2haettavaavustus = haeHaettavaavustus('PSA-2');
          $scope.psa2omarahoitus = haeOmarahoitus('PSA-2');
          $scope.psamhaettavaavustus = haeHaettavaavustus('PSA-M');
          $scope.psamomarahoitus = haeOmarahoitus('PSA-M');
          $scope.hkslhaettavaavustus = haeHaettavaavustus('HK-SL');
          $scope.hkslomarahoitus = haeOmarahoitus('HK-SL');
          $scope.hkklhaettavaavustus = haeHaettavaavustus('HK-KL');
          $scope.hkklomarahoitus = haeOmarahoitus('HK-KL');
          $scope.hkslhaettavaavustus = haeHaettavaavustus('HK-SL');
          $scope.hkslomarahoitus = haeOmarahoitus('HK-SL');
          $scope.hkllhaettavaavustus = haeHaettavaavustus('HK-LL');
          $scope.hkllomarahoitus = haeOmarahoitus('HK-LL');
          $scope.hktlhaettavaavustus = haeHaettavaavustus('HK-TL');
          $scope.hktlomarahoitus = haeOmarahoitus('HK-TL');
          $scope.kimhaettavaavustus = haeHaettavaavustus('K-IM');
          $scope.kimomarahoitus = haeOmarahoitus('K-IM');
          $scope.kmpkhaettavaavustus = haeHaettavaavustus('K-MPK');
          $scope.kmpkomarahoitus = haeOmarahoitus('K-MPK');
          $scope.kmkhaettavaavustus = haeHaettavaavustus('K-MK');
          $scope.kmkomarahoitus = haeOmarahoitus('K-MK');
          $scope.krthaettavaavustus = haeHaettavaavustus('K-RT');
          $scope.krtomarahoitus = haeOmarahoitus('K-RT');
          $scope.kmhaettavaavustus = haeHaettavaavustus('K-M');
          $scope.kmomarahoitus = haeOmarahoitus('K-M');
          AvustuskohdeService.hae($scope.maksatusHakemus1id)
            .success(function (data) {
              $scope.m1aktiivisetavustuskohteet = data;
              $scope.m1psa1haettavaavustus = haeHaettavaavustus('PSA-1');
              $scope.m1psa1omarahoitus = haeOmarahoitus('PSA-1');
              $scope.m1psa2haettavaavustus = haeHaettavaavustus('PSA-2');
              $scope.m1psa2omarahoitus = haeOmarahoitus('PSA-2');
              $scope.m1psamhaettavaavustus = haeHaettavaavustus('PSA-M');
              $scope.m1psamomarahoitus = haeOmarahoitus('PSA-M');
              $scope.m1hkslhaettavaavustus = haeHaettavaavustus('HK-SL');
              $scope.m1hkslomarahoitus = haeOmarahoitus('HK-SL');
              $scope.m1hkklhaettavaavustus = haeHaettavaavustus('HK-KL');
              $scope.m1hkklomarahoitus = haeOmarahoitus('HK-KL');
              $scope.m1hkslhaettavaavustus = haeHaettavaavustus('HK-SL');
              $scope.m1hkslomarahoitus = haeOmarahoitus('HK-SL');
              $scope.m1hkllhaettavaavustus = haeHaettavaavustus('HK-LL');
              $scope.m1hkllomarahoitus = haeOmarahoitus('HK-LL');
              $scope.m1hktlhaettavaavustus = haeHaettavaavustus('HK-TL');
              $scope.m1hktlomarahoitus = haeOmarahoitus('HK-TL');
              $scope.m1kimhaettavaavustus = haeHaettavaavustus('K-IM');
              $scope.m1kimomarahoitus = haeOmarahoitus('K-IM');
              $scope.m1kmpkhaettavaavustus = haeHaettavaavustus('K-MPK');
              $scope.m1kmpkomarahoitus = haeOmarahoitus('K-MPK');
              $scope.m1kmkhaettavaavustus = haeHaettavaavustus('K-MK');
              $scope.m1kmkomarahoitus = haeOmarahoitus('K-MK');
              $scope.m1krthaettavaavustus = haeHaettavaavustus('K-RT');
              $scope.m1krtomarahoitus = haeOmarahoitus('K-RT');
              $scope.m1kmhaettavaavustus = haeHaettavaavustus('K-M');
              $scope.m1kmomarahoitus = haeOmarahoitus('K-M');
            })
            .error(function (data) {
              StatusService.virhe('AvustuskohdeService.hae(' + $scope.tyyppi + ',' + $scope.maksatusHakemus1id + ')', data);
            });
        })
        .error(function (data) {
          StatusService.virhe('AvustuskohdeService.hae(' + $scope.tyyppi + ',' + $scope.hakemusid + ')', data);
        });

      haeLiitteet();

    };

    function haeLiitteet() {
      LiiteService.haeKaikki($routeParams.id)
        .success(function (data) {
          $scope.liitteet = data;
        })
        .error(function (data) {
          StatusService.virhe('LiiteService.hae(' + $routeParams.id + ')', data);
        });
    }

    function haeOmarahoitus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseFloat((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).omarahoitus);
      }
      else {
        return 0;
      }
    }

    $scope.hakemusid = $routeParams.id;
    $scope.maksatusHakemus1id = $routeParams.m1id;
    $scope.maksatusHakemus2id = $routeParams.m2id;
    $scope.myFiles = [];
    $scope.tyyppi = $routeParams.tyyppi;

    $scope.$watch('myFiles', function () {
      for (var i = 0; i < $scope.myFiles.length; i++) {
        var file = $scope.myFiles[i];
        console.log('Watched:' + file.name);
        $scope.upload = $upload.upload({
          url: 'api/hakemus/' + $routeParams.id + '/liite',
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
    });

    $scope.lahetaAvustushakemus = function () {
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.avustusHakemusForm.$valid) {
        HakemusService.laheta($scope.avustushakemus.id)
          .success(function () {
            StatusService.ok('HakemusService.laheta(' + $scope.avustushakemus.id + ')', 'Lähettäminen onnistui.');
            $location.path('/h/hakemukset');
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.laheta(' + $scope.avustushakemus.id + ')', data);
          });
      }
    };

    $scope.naytaAvustushakemus = function () {
      $location.path('/h/hakemus/esikatselu/' + $scope.avustushakemus.id);
    };

    $scope.omarahoitusRiittava = function (omarahoitus, haettavarahoitus) {
      var omarahoitus2, haettavarahoitus2;
      if ((typeof omarahoitus === 'undefined') || (typeof haettavarahoitus === 'undefined')) return true;
      if (typeof omarahoitus === 'string') {
        omarahoitus2 = euroSyoteNumeroksi(omarahoitus);
      }
      if (typeof haettavarahoitus === 'string') {
        haettavarahoitus2 = euroSyoteNumeroksi(haettavarahoitus);
      }
      if (typeof omarahoitus === 'number') {
        omarahoitus2 = parseFloat(omarahoitus);
      }
      if (typeof haettavarahoitus === 'number') {
        haettavarahoitus2 = parseFloat(haettavarahoitus);
      }
      return haettavarahoitus2 <= omarahoitus2;
    };

    $scope.poistaLiite = function (liiteid) {
      LiiteService.poista($routeParams.id, liiteid)
        .success(function (data) {
          StatusService.ok('LiiteService.poista(' + $routeParams.id + ',' + liiteid + ')', 'Liite poistettiin onnistuneesti');
          haeLiitteet();
        })
        .error(function (data) {
          StatusService.virhe('LiiteService.poista(' + $routeParams.id + ',' + liiteid + ')', data);
        });
    };

    $scope.positiivinenArvo = function (value) {
      return parseFloat(value) >= 0;
    };

    $scope.tallennaAvustushakemus = function () {
      $scope.$broadcast('show-errors-check-validity');
      if ($scope.avustusHakemusForm.$valid) {
        var avustuskohteet = [
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'PSA-1',
            'haettavaavustus': $scope.psa1haettavaavustus,
            'omarahoitus': $scope.psa1omarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'PSA-2',
            'haettavaavustus': $scope.psa2haettavaavustus,
            'omarahoitus': $scope.psa2omarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'PSA-M',
            'haettavaavustus': $scope.psamhaettavaavustus,
            'omarahoitus': $scope.psamomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'HK-SL',
            'haettavaavustus': $scope.hkslhaettavaavustus,
            'omarahoitus': $scope.hkslomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'HK-KL',
            'haettavaavustus': $scope.hkklhaettavaavustus,
            'omarahoitus': $scope.hkklomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'HK-LL',
            'haettavaavustus': $scope.hkllhaettavaavustus,
            'omarahoitus': $scope.hkllomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'HK-TL',
            'haettavaavustus': $scope.hktlhaettavaavustus,
            'omarahoitus': $scope.hktlomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'K-IM',
            'haettavaavustus': $scope.kimhaettavaavustus,
            'omarahoitus': $scope.kimomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'K-MPK',
            'haettavaavustus': $scope.kmpkhaettavaavustus,
            'omarahoitus': $scope.kmpkomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'K-MK',
            'haettavaavustus': $scope.kmkhaettavaavustus,
            'omarahoitus': $scope.kmkomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'K-RT',
            'haettavaavustus': $scope.krthaettavaavustus,
            'omarahoitus': $scope.krtomarahoitus
          },
          {
            'hakemusid': $scope.avustushakemus.id,
            'avustuskohdelajitunnus': 'K-M',
            'haettavaavustus': $scope.kmhaettavaavustus,
            'omarahoitus': $scope.kmomarahoitus
          }
        ];
        AvustuskohdeService.tallenna(avustuskohteet)
          .success(function () {
            var tallennusOk = true;
            if ($scope.avustushakemus.selite !== null) {
              var selitedata = {
                'selite': $scope.avustushakemus.selite,
                'hakemusid': $scope.avustushakemus.id
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
            }
          })
          .error(function (data) {
            StatusService.virhe('AvustuskohdeService.tallenna()', data);
          });
      } else {
        StatusService.virhe('AvustuskohdeService.tallenna()', 'Korjaa lomakkeen virheet ennen tallentamista.');
      }
    };

    $scope.tarkastaAvustushakemus = function () {
      HakemusService.tarkasta($scope.avustushakemus.id)
        .success(function () {
          StatusService.ok('HakemusService.tarkasta(' + $scope.avustushakemus.id + ')', 'Hakemus päivitettiin tarkastetuksi.');
          $location.path('/k/hakemukset');
        })
        .error(function (data) {
          StatusService.virhe('HakemusService.tarkasta(' + $scope.avustushakemus.id + ')', data);
        });
    };

    haeHakemukset();
  }
  ])
;