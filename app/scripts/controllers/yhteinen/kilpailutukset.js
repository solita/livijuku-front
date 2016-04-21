'use strict';

var _ = require('lodash');
var angular = require('angular');
var c = require('utils/core');
var t = require('utils/time');

angular.module('jukufrontApp').controller('KilpailutuksetCtrl',
  ['$scope', '$state', '$element', '$uibModal', 'StatusService', 'OrganisaatioService', 'KilpailutusService',
  function ($scope, $state, $element, $uibModal, StatusService, OrganisaatioService, KilpailutusService) {


  $scope.kalustokoko = {
    min: 0,
    max: 100,
    options: {floor: 0, ceil: 100}
  }

  $scope.kohdearvo = {
    min: 0,
    max: 90000000,
    options: {floor: 0, ceil: 90000000}
  }

  OrganisaatioService.hae().then(organisaatiot => {
    $scope.organisaatiot = organisaatiot;
  }, StatusService.errorHandler);

  $scope.newKilpailutus = function () {
    $state.go('app.kilpailutus', {id: 'new'});
  }

  KilpailutusService.find().then( kilpailutukset => {
    $scope.kilpailutukset = _.map(kilpailutukset, kilpailutus => {
        const dates = [
          kilpailutus.julkaisupvm,
          kilpailutus.tarjouspaattymispvm,
          kilpailutus.hankintapaatospvm,
          kilpailutus.liikennointialoituspvm,
          kilpailutus.liikennointipaattymispvm,
          kilpailutus.hankittuoptiopaattymispvm,
          kilpailutus.optiopaattymispvm];

        const maxdate = _.max(dates);

        if (c.isBlank(maxdate)) {
          throw "Kilpailutuksella " + kilpailutus.id + " ei ole yhtään päivämäärää."
        }

        kilpailutus.dates = _.map(dates, (date, index) => t.toLocalMidnight(c.isNotBlank(date) ?
          date :
          c.coalesce(_.find(_.slice(dates, index), c.isNotBlank), maxdate)))

        return kilpailutus;
      });
  }, StatusService.errorHandler);

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
    clickToUse: false,
    orientation: 'both'
  };

  $scope.timelineEvents = {
    select: (properties) => {
      let $target = jQuery(properties.event.target);
      if (!$target.hasClass('link-to-hilma')) {
        $state.go('app.kilpailutus', {
          id: _.split(properties.items[0], '-')[1]
        });
      }
    }
  };

}]);
