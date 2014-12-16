'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemusCtrl
 * @description
 * # KasHakemusCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasHakemusCtrl', function ($rootScope, $scope, $location, $routeParams, AvustuskohteetFactory, HakemusFactory) {
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

    $scope.checkAvustushakemus = function () {
      HakemusFactory.tarkasta({'hakemusid': $scope.avustushakemus.id});
      $location.path('/k/hakemukset');
    };

    $scope.loadData = function () {
      HakemusFactory.get({'id': $routeParams.id}, (function (data) {
        $scope.avustushakemus = data;
        $scope.hakija = _.find($rootScope.organisaatiot, {'id': $scope.avustushakemus.organisaatioid}).nimi;
        $scope.aikaleima = new Date();
      }));
      AvustuskohteetFactory.query({'id': $routeParams.id}, (function (data) {
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
      }));
    };
    $scope.loadData();
  }
)

/**
 Osasto.getOsasto('Pori')
 .then(function (data) {
        $scope.osastoTiedot = data;
      });
 HakemuksetOsasto.getAvustushakemus('Pori', '2015')
 .then(function (data) {
        $scope.avustushakemus = data;
      });

 $scope.tarkastaAvustushakemus = function () {
      $scope.avustushakemus.avustushakemusstatus = 'Tarkastettu';
      $scope.avustushakemus.aikaleima =  new Date();
      HakemuksetOsasto.saveAvustushakemus('Pori', '2015',$scope.avustushakemus )
        .then(function (data) {
          $scope.sendAvustushakemusStatus = data;
        });
      $location.path('/k/hakemukset');
    };

 $scope.saveAvustushakemus = function () {
      $scope.avustushakemus.avustushakemusstatus = 'Keskeneräinen';
      $scope.avustushakemus.aikaleima =  new Date();
      HakemuksetOsasto.saveAvustushakemus('Pori', '2015',$scope.avustushakemus )
        .then(function (data) {
          $scope.saveAvustushakemusStatus = data;
        });
    };
 */
