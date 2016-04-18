'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp').controller('KilpailutuksetCtrl',
  ['$scope', '$state', '$element', '$uibModal', 'StatusService', 'OrganisaatioService', 'KilpailutusService',
  function ($scope, $state, $element, $uibModal, StatusService, OrganisaatioService, KilpailutusService) {

  $scope.kalustonKokoMin = 0;
  $scope.kalustonKokoRange = 9990;

  $scope.updateKalustonKokoRange = function () {
    $scope.kalustonKokoRange = parseInt($scope.kalustonKokoRange, 10) < parseInt($scope.kalustonKokoMin, 10) ? $scope.kalustonKokoMin : $scope.kalustonKokoRange;
  };

  OrganisaatioService.hae().then(organisaatiot => {
    $scope.organisaatiot = organisaatiot;
  }, StatusService.errorHandler);


  $scope.kilpailutukset = [{
    id: 'kohde-1',
    organisaatioId: 1,
    name: 'Kohde 1',
    dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2016-12-20'), new Date('2017-12-20')],
    linkToHilma: 'http://www.hankintailmoitukset.fi/fi/'
  }, {
    id: 'kohde-2',
    organisaatioId: 1,
    name: 'Kohde 2',
    dates: [new Date('2016-03-01'), new Date('2016-06-30'), new Date('2016-10-01'), new Date('2017-01-01'), new Date('2018-10-20')],
    linkToHilma: false
  }, {
    id: 'kohde-1',
    organisaatioId: 2,
    name: 'Kohde 1',
    dates: [new Date('2016-04-20'), new Date('2016-06-20'), new Date('2016-09-20'), new Date('2017-02-20'), new Date('2019-12-20')],
    linkToHilma: 'http://www.hankintailmoitukset.fi/fi/'
  }];

  /*
  KilpailutusService.find().then( kilpailutukset => {
    $scope.kilpailutukset = _.map(kilpailutukset, kilpailutus => {
        kilpailutus.dates = [
          kilpailutus.julkaisupvm,
          kilpailutus.tarjouspaattymispvm];
        return kilpailutus;
      });
  }, StatusService.errorHandler);
  */

  $scope.timelineOptions = {
    locales: {
      fi: {
        months: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu']
      }
    },
    locale: 'fi',
    //min: new Date(2016, 1, 1),
    //max: new Date(2030, 1, 1),
    stack: false,
    clickToUse: false
  };

  $scope.timelineEvents = {
    select: (properties) => {
      let $target = jQuery(properties.event.target);
      if (!$target.hasClass('link-to-hilma')) {
        $state.go('app.kilpailutus', {
          id: properties.items[0]
        });
      }
    }
  };

}]);
