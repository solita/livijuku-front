'use strict';

var _ = require('lodash');
var angular = require('angular');
var c = require('utils/core');
var t = require('utils/time');
var tl = require('utils/tunnusluvut');

angular.module('jukufrontApp').controller('KilpailutuksetCtrl',
  ['$scope', '$state', '$element', '$uibModal', 'StatusService', 'OrganisaatioService', 'KilpailutusService',
  function ($scope, $state, $element, $uibModal, StatusService, OrganisaatioService, KilpailutusService) {

  $scope.timeline = {};

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

  $scope.filter = {
    organisaatiot: [],
    organisaatiolajit: []
  };

  //$scope.organisaatiolajit = tl.organisaatiolajit;
  $scope.findOrganisaatiolaji = function (query) {
    return _.map(_.filter(tl.organisaatiolajit.$order, id => id !== 'ALL'), id => ({id: id, nimi: tl.organisaatiolajit.$nimi(id)}));
  };

  OrganisaatioService.hae().then(organisaatiot => {
    $scope.organisaatiot = organisaatiot;
    $scope.timeline.organisaatiot = organisaatiot;
  }, StatusService.errorHandler);

  $scope.findOrganisaatio = function (query) {
    if (c.isBlank(query)) {
      return $scope.organisaatiot;
    } else {
      var re = new RegExp(".*" + _.lowerCase(query) + '.*');
      return _.filter($scope.organisaatiot, org => re.test(_.lowerCase(org.nimi)));
    }
  }

  $scope.newKilpailutus = function () {
    $state.go('app.kilpailutus', {id: 'new'});
  }

  $scope.$watchCollection('filter.organisaatiot', organisaatiot => {
    if (_.isEmpty(organisaatiot)) {
      $scope.timeline.organisaatiot = $scope.organisaatiot;
    } else {
      $scope.timeline.organisaatiot = _.clone(organisaatiot);
    }
  });

  loadKilpailutukset();

  function loadKilpailutukset() {
    KilpailutusService.find($scope.filter).then( kilpailutukset => {
      $scope.kilpailutukset = _.map(kilpailutukset, kilpailutus => {
          const dates = [
            kilpailutus.julkaisupvm,
            kilpailutus.tarjouspaattymispvm,
            kilpailutus.hankintapaatospvm,
            kilpailutus.liikennointialoituspvm,
            kilpailutus.liikennointipaattymispvm,
            c.coalesce(kilpailutus.hankittuoptiopaattymispvm, kilpailutus.liikennointipaattymispvm),
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
  }

  $scope.timeline.options = {
    locales: {
      fi: {
        months: ['Tammi', 'Helmi', 'Maalis', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu']
      }
    },
    locale: 'fi',
    groupOrder: 'id',
    //min: new Date(2016, 1, 1),
    //max: new Date(2030, 1, 1),
    margin: {
      item: 6
    },
    stack: false,
    clickToUse: false,
    orientation: 'both'
  };

  $scope.timeline.events = {
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
