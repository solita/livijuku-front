'use strict';

angular.module('jukufrontApp')
  .controller('KasHakemusCtrl', ['$rootScope', '$scope', '$location', '$routeParams', 'AvustuskohdeFactory', 'HakemusFactory', function ($rootScope, $scope, $location, $routeParams, AvustuskohdeFactory, HakemusFactory) {
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

    $scope.tarkastaAvustushakemus = function () {
      HakemusFactory.tarkasta($scope.avustushakemus.id)
        .success(function () {
          $location.path('/k/hakemukset');
        })
        .error(function (data) {
          console.log('Virhe: HakemusFactory.tarkasta(' + $scope.avustushakemus.id + '): ' + data);
        });
    };

    $scope.haeAvustusHakemus = function () {
      HakemusFactory.hae($routeParams.id)
        .success(function (data) {
          $scope.avustushakemus = data;
          $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
          $scope.aikaleima = new Date();
        })
        .error(function (data) {
          console.log('Virhe: HakemusFactory.hae(' + $routeParams.id + ') ' + data);
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
          console.log('Virhe: AvustuskohdeFactory.hae(' + $routeParams.id + ') ' + data);
        });
    };

    $scope.haeAvustusHakemus();
  }]
);
