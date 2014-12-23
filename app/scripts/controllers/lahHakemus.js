'use strict';

angular.module('jukufrontApp')
  .controller('LahHakemusCtrl', function ($rootScope, $scope, $location, $routeParams, HakemusFactory, AvustuskohdeFactory) {
    function getHaettavaavustus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseInt((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).haettavaavustus);
      }
      else {
        return 0;
      }
    }

    function getOmarahoitus(avustuskohdelaji) {
      if (_.some($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})) {
        return parseInt((_.find($scope.aktiivisetavustuskohteet, {'avustuskohdelajitunnus': avustuskohdelaji})).omarahoitus);
      }
      else {
        return 0;
      }
    }

    $scope.haeHakemukset = function () {
      HakemusFactory.hae($routeParams.id)
        .success(function (data) {
          $scope.avustushakemus = data;
          $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
          $scope.aikaleima = new Date();
        })
        .error(function (data) {
          console.log('Virhe: HakemusFactory.hae(' + $routeParams.id + '): ' + data);
        });
      AvustuskohdeFactory.hae($routeParams.id)
        .success(function (data) {
          $scope.aktiivisetavustuskohteet = data;
          $scope.psa1haettavaavustus = getHaettavaavustus('PSA-1');
          $scope.psa1omarahoitus = getOmarahoitus('PSA-1');
          $scope.psa2haettavaavustus = getHaettavaavustus('PSA-2');
          $scope.psa2omarahoitus = getOmarahoitus('PSA-2');
          $scope.psamhaettavaavustus = getHaettavaavustus('PSA-M');
          $scope.psamomarahoitus = getOmarahoitus('PSA-M');
          $scope.hkslhaettavaavustus = getHaettavaavustus('HK-SL');
          $scope.hkslomarahoitus = getOmarahoitus('HK-SL');
          $scope.hkklhaettavaavustus = getHaettavaavustus('HK-KL');
          $scope.hkklomarahoitus = getOmarahoitus('HK-KL');
          $scope.hkslhaettavaavustus = getHaettavaavustus('HK-SL');
          $scope.hkslomarahoitus = getOmarahoitus('HK-SL');
          $scope.hkllhaettavaavustus = getHaettavaavustus('HK-LL');
          $scope.hkllomarahoitus = getOmarahoitus('HK-LL');
          $scope.hktlhaettavaavustus = getHaettavaavustus('HK-TL');
          $scope.hktlomarahoitus = getOmarahoitus('HK-TL');
          $scope.kimhaettavaavustus = getHaettavaavustus('K-IM');
          $scope.kimomarahoitus = getOmarahoitus('K-IM');
          $scope.kmpkhaettavaavustus = getHaettavaavustus('K-MPK');
          $scope.kmpkomarahoitus = getOmarahoitus('K-MPK');
          $scope.kmkhaettavaavustus = getHaettavaavustus('K-MK');
          $scope.kmkomarahoitus = getOmarahoitus('K-MK');
          $scope.krthaettavaavustus = getHaettavaavustus('K-RT');
          $scope.krtomarahoitus = getOmarahoitus('K-RT');
          $scope.kmhaettavaavustus = getHaettavaavustus('K-M');
          $scope.kmomarahoitus = getOmarahoitus('K-M');
        })
        .error(function (data) {
          console.log('Virhe: AvustuskohdeFactory.hae(' + $routeParams.id + '): ' + data);
        });

    };

    $scope.lahetaAvustushakemus = function () {
      HakemusFactory.laheta($scope.avustushakemus.id)
        .success(function () {
          $location.path('/l/hakemukset');
        })
        .error(function (data) {
          console.log('Virhe: HakemusFactory.laheta(' + $scope.avustushakemus.id + '): ' + data);
        });
    };

    $scope.naytaAvustushakemus = function () {
      $location.path('/l/hakemus/esikatselu/' + $scope.avustushakemus.id);
    };

    $scope.tallennaAvustuskohteet = function (avustuskohteet) {
      AvustuskohdeFactory.tallenna(avustuskohteet)
        .success(function () {
          $scope.haeHakemukset();
        })
        .error(function (data) {
          console.log('Virhe: AvustuskohdeFactory.tallenna():' + data);
        });
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
      $scope.tallennaAvustuskohteet(avustuskohteet);
      if ($scope.avustushakemus.selite !== null) {
        var selitedata = {
          'selite': $scope.avustushakemus.selite,
          'hakemusid': $scope.avustushakemus.id
        };
        HakemusFactory.tallennaSelite(selitedata)
          .success(function () {
          })
          .error(function (data) {
            console.log('Virhe: HakemusFactory.tallennaSelite(' + selitedata + '):' + data);
          });
      }
    };

    $scope.haeHakemukset();
  });
