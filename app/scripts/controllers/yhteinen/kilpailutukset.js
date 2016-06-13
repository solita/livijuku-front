'use strict';

var _ = require('lodash');
var angular = require('angular');
var c = require('utils/core');
var t = require('utils/time');
var tl = require('utils/tunnusluvut');
var u = require('utils/user');

angular.module('jukufrontApp').controller('KilpailutuksetCtrl',
  ['$scope', '$state', '$element', '$uibModal', '$q', 'StatusService', 'OrganisaatioService', 'KilpailutusService', 'KayttajaService',
  function ($scope, $state, $element, $uibModal, $q, StatusService, OrganisaatioService, KilpailutusService, KayttajaService) {

  $scope.timeline = {};

  $scope.kalustokoko = {
    min: 0,
    max: 100,
    options: {floor: 0, ceil: 100}
  }

  $scope.kohdearvo = {
    min: 0,
    max: 10000000,
    options: {floor: 0, ceil: 10000000, step: 1000, translate: tl.numberFormatTooltip}
  }

  $scope.filter = {
    organisaatiot: [],
    organisaatiolajit: []
  };

  $q.all([OrganisaatioService.hae(), KayttajaService.hae()]).then(
    ([organisaatiot, user]) => {

      const org = _.find(organisaatiot, {id: user.organisaatioid});
      $scope.filter.organisaatiot = org.lajitunnus !== 'LV' ? [org] : [];

    }, StatusService.errorHandler);

  //$scope.organisaatiolajit = tl.organisaatiolajit;
  $scope.findOrganisaatiolaji = function (query) {
    return _.map(_.filter(tl.organisaatiolajit.$order, id => id !== 'ALL'), id => ({id: id, nimi: tl.organisaatiolajit.$nimi(id)}));
  };

  OrganisaatioService.hae().then(organisaatiot => {
    $scope.organisaatiot = u.filterNotLivi(organisaatiot);
    $scope.timeline.organisaatiot = $scope.organisaatiot;
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

  $scope.$watchCollection('filter.organisaatiot', filterTimelineOrganisaatiot);
  $scope.$watchCollection('filter.organisaatiolajit', filterTimelineOrganisaatiot);
  $scope.$watchGroup(['kalustokoko.min', 'kalustokoko.max', 'kohdearvo.min', 'kohdearvo.max'],
    filterTimelineKilpailutukset);
  $scope.$watchGroup(['kilpailutuskausi', 'liikennointikausi'], loadKilpailutukset);

  function findOrganisaatiotInLajit(lajitunnukset) {
    return _.isEmpty(lajitunnukset) ? [] :
      _.filter($scope.organisaatiot,
               org => _.includes(lajitunnukset, org.lajitunnus))
  }

  function filterTimelineOrganisaatiot() {
    var organisaatiolajitunnukset = _.map($scope.filter.organisaatiolajit, laji => laji.id);

    var organisaatiot = _.unionBy(
      $scope.filter.organisaatiot, findOrganisaatiotInLajit(organisaatiolajitunnukset),
      org => org.id);

    if (_.isEmpty(organisaatiot)) {
      $scope.timeline.organisaatiot = $scope.organisaatiot;
    } else {
      $scope.timeline.organisaatiot = organisaatiot;
    }
  }

  const between = (arvo, interval) => arvo >= interval.min && arvo <= interval.max;
  const isMaxInterval = (interval) => interval.min === interval.options.floor && interval.max === interval.options.ceil

  function filterTimelineKilpailutukset() {
    if (! (isMaxInterval($scope.kalustokoko) && isMaxInterval($scope.kohdearvo))) {
      $scope.timeline.kilpailutukset = _.filter(
        $scope.kilpailutukset,
        kilpailutus => between(kilpailutus.kalusto, $scope.kalustokoko) &&
                       between(kilpailutus.kohdearvo, $scope.kohdearvo) );
    } else {
      $scope.timeline.kilpailutukset = $scope.kilpailutukset;
    }
  }

  const showKausi = (show, value) => show || (!$scope.kilpailutuskausi &&  !$scope.liikennointikausi) ? value : null;
  const showKilpailutuskausi = (date) => showKausi($scope.kilpailutuskausi, date);
  const showLiikennointikausi = (date) => showKausi($scope.liikennointikausi, date);

  function filterKilpailutuksetForKilpailutuskausi(kilpailutukset) {
    return $scope.kilpailutuskausi && !$scope.liikennointikausi ?
      _.filter(kilpailutukset, k => _.some([k.julkaisupvm, k.tarjouspaattymispvm, k.hankintapaatospvm], c.isDefinedNotNull)) :
      kilpailutukset;
  }

  function loadKilpailutukset() {
    KilpailutusService.find().then( kilpailutukset => {
      $scope.kilpailutukset = _.map(filterKilpailutuksetForKilpailutuskausi(kilpailutukset), kilpailutus => {
          const dates = [
            showKilpailutuskausi(kilpailutus.julkaisupvm),
            showKilpailutuskausi(kilpailutus.tarjouspaattymispvm),
            showKilpailutuskausi(kilpailutus.hankintapaatospvm),
            kilpailutus.liikennointialoituspvm,
            showLiikennointikausi(kilpailutus.liikennointipaattymispvm),
            showLiikennointikausi(c.coalesce(kilpailutus.hankittuoptiopaattymispvm, kilpailutus.liikennointipaattymispvm)),
            showLiikennointikausi(kilpailutus.optiopaattymispvm)];


          kilpailutus.dates = _.map(dates, date => c.isNotBlank(date) ? t.toLocalMidnight(date) : null);

          return kilpailutus;
        });

      filterTimelineKilpailutukset();
    }, StatusService.errorHandler);
  }

  $scope.timeline.options = {
    locale: 'fi',
    groupOrder: 'id',
    //min: new Date(2016, 1, 1),
    //max: new Date(2030, 1, 1),
    margin: {
      item: 6
    },
    stack: false,
    clickToUse: false,
    orientation: 'both',
    zoomMin: 604800000,
    zoomMax: 1262400000000
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
