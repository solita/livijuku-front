'use strict';

angular.module('jukufrontApp')
  .controller('HakijaHakemusCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'HakemusService', 'AvustuskohdeService', 'StatusService', function ($rootScope, $scope, $location, $routeParams, HakemusService, AvustuskohdeService, StatusService) {
    function haeHaettavaavustus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseInt((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).haettavaavustus);
      }
      else {
        return 0;
      }
    }

    function haeOmarahoitus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseInt((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).omarahoitus);
      }
      else {
        return 0;
      }
    }

    function haeHakemukset() {
      HakemusService.hae($routeParams.id)
        .success(function (data) {
          $scope.avustushakemus = data;
          $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
          $scope.pankkitilinumero = _.find($rootScope.organisaatiot, {'id': $rootScope.user.organisaatioid}).pankkitilinumero;
          $scope.aikaleima = new Date();
        })
        .error(function (data) {
          StatusService.virhe('HakemusService.hae(' + $routeParams.id + ')', data);
        });
      AvustuskohdeService.hae($routeParams.id)
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
        })
        .error(function (data) {
          StatusService.virhe('AvustuskohdeService.hae(' + $routeParams.id + ')', data);
        });

    };

    $scope.lahetaAvustushakemus = function () {
      HakemusService.laheta($scope.avustushakemus.id)
        .success(function () {
          StatusService.ok('HakemusService.laheta(' + $scope.avustushakemus.id + ')', 'Lähettäminen onnistui.');
          $location.path('/h/hakemukset');
        })
        .error(function (data) {
          StatusService.virhe('HakemusService.laheta(' + $scope.avustushakemus.id + ')', data);
        });
    };

    $scope.naytaAvustushakemus = function () {
      $location.path('/h/hakemus/esikatselu/' + $scope.avustushakemus.id);
    };

    $scope.tallennaAvustushakemus = function () {
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
    };

    haeHakemukset();
  }]);
