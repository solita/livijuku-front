'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp').controller('KilpailutuksetCtrl', ['$scope', '$state', '$element', 'OrganisaatioService', function ($scope, $state, $element, OrganisaatioService) {

  $scope.kalustonKokoMin = 0;
  $scope.kalustonKokoRange = 9990;

  $scope.updateKalustonKokoRange = function () {
    $scope.kalustonKokoRange = parseInt($scope.kalustonKokoRange, 10) < parseInt($scope.kalustonKokoMin, 10) ? $scope.kalustonKokoMin : $scope.kalustonKokoRange;
  };

  OrganisaatioService.hae().then(response => {
    $scope.organisaatiot = response;
  });

  $scope.kilpailutukset = [{
    id: 'kohde-1',
    organisaatioId: 1,
    name: 'Kohde 1',
    dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2016-12-20'), new Date('2017-02-20'), new Date('2017-10-20'), new Date('2019-11-20')]
  }, {
    id: 'kohde-2',
    organisaatioId: 1,
    name: 'Kohde 2',
    dates: [new Date('2016-03-01'), new Date('2016-06-30'), new Date('2016-10-01'), new Date('2017-01-01'), new Date('2017-04-05'), new Date('2018-10-05')]
  }, {
    id: 'kohde-1',
    organisaatioId: 2,
    name: 'Kohde 1',
    dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2017-02-20'), new Date('2018-05-10'), new Date('2018-11-01')]
  }];

  $scope.timelineOptions = {
    locales: {
      fi: {
        months: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu']
      }
    },
    locale: 'fi',
    min: new Date(2016, 1, 1),
    max: new Date(2030, 1, 1),
    stack: false
  };

}]);
