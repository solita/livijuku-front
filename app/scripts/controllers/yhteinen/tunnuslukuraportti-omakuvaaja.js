'use strict';

var _ = require('lodash');
var angular = require('angular');
var c = require('utils/core');

function nimi(id) {
  return this[id];
}

const kuukaudet = {
  ALL: "Koko vuosi", 1: "Tammikuu", 2: "Helmikuu", 3: "Maaliskuu", 4: "Huhtikuu", 5: "Toukokuu",
  6: "Kesäkuu", 7: "Heinäkuu", 8: "Elokuu", 9: "Syyskuu", 10: "Lokakuu", 11: "Marraskuu", 12: "Joulukuu",
  $order: ['ALL'].concat(_.range(1,13)),
  $nimi: nimi
};

const paastoluokat = {
  ALL: 'Kaikki', E0: "EURO 0", E1: "EURO 1", E2: "EURO 2", E3: "EURO 3", E4: "EURO 4", E5: "EURO 5/EEV", E6: "EURO 6",
  $order: ['ALL'].concat(_.map(_.range(0,7), i => 'E' + i)),
  $nimi: nimi
};

const viikonpaivaluokat = { A: 'Arkipäivä', LA: 'Lauantai', SU: 'Sunnuntai', $order: ['A', 'LA', 'SU'], $nimi: nimi };

const organisaatiolajit = {
  ALL: 'Kaikki organisaatiot',
  KS1: 'Suuret kaupunkiseudut',
  KS2: 'Keskisuuret kaupunkiseudut',
  KS3: 'Pienet kaupunkiseudut',
  ELY: 'ELY-keskukset',
  $order: ['ALL', 'KS1', 'KS2', 'KS3', 'ELY'],
  $nimi: nimi
};

const sopimustyypit = {
  ALL: 'Kaikki sopimustyypit',
  BR:  'PSA brutto',
  KOS: 'PSA KOS',
  SA:  'Siirtymäajan liikenne',
  ME:  'Markkinaehtoinen liikenne',
  $order: ['ALL', 'BR', 'KOS', 'SA', 'ME'],
  $nimi: nimi
};

const vuodet = {
  $order: _.range(2013, 2017),
  $nimi: _.identity
};

function createChart(title, xLabel) {
  return {
    chart: {
      height: 450,
      x: d => d.x,
      y: d => d.y,
      yAxis: {
        axisLabel: ''
      },
      xAxis: {
        axisLabel: xLabel
      }
    },
    title: {
      enable: true,
      text: title
    },
    subtitle: {
      enable: true,
      text: ''
    }
  };
};

function createMultiBarChart(title, xLabel) {
  return _.merge(
    createChart(title, xLabel), {
    chart: {
      type: 'multiBarChart',
      stacked: false,
      reduceXTicks: false,
      valueFormat: function (d) {
        return d3.format('.02f')(d);
      }
    }
  });
};

function createLineChartKK(title, xLabel) {
  return _.merge(
    createChart(title, "Kuukausi"), {
    chart: {
      type: 'lineWithFocusChart',
      xAxis: {
        tickFormat: d => d3.time.format.utc("%m/%Y") (new Date(d))
      },
      xScale: d3.time.scale.utc(),
      x2Axis: {
        tickFormat: d => d3.time.format.utc("%m/%Y") (new Date(d))
      }
    }
  });
};

function createFilter(id, nimi, values, defaultValue = 'ALL') {
  return {id: id, nimi: nimi, values: values, defaultValue: defaultValue};
}

function yTitleNousut(title, filter) {
  return title +
    (filter.sopimustyyppitunnus && filter.sopimustyyppitunnus !== 'ALL' ?  " (" + sopimustyypit[filter.sopimustyyppitunnus] + ")" : "") + " / " +
    (filter.kuukausi && filter.kuukausi !== 'ALL' ? kuukaudet[filter.kuukausi] : 'Vuosi');
}

function yTitleNousutKK(title, filter) {
  return title +
    (filter.sopimustyyppitunnus && filter.sopimustyyppitunnus !== 'ALL' ?  " (" + sopimustyypit[filter.sopimustyyppitunnus] + ")" : "") + " / Kuukausi";
}

const tunnusluvut = [{
    id: "nousut",
    nimi: "Nousut",
    charts: [{
      title: "Nousujen lukumäärä vuosittain tarkasteltuna",
      yTitle: _.partial(yTitleNousut, "Nousut"),
      groupBy: ["organisaatioid", "vuosi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit),
        createFilter("kuukausi", "Tarkastelujakso", kuukaudet)],
      options: createMultiBarChart("Kysyntä", "Vuosi")
    }, {
      title: "Nousujen lukumäärä kuukausitasolla",
      yTitle: _.partial(yTitleNousutKK, "Nousut"),
      groupBy: ["organisaatioid", "kuukausi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit)],
      options: createLineChartKK("Kysyntä")}]
  }, {
    id: "lahdot",
    nimi: "Lähdöt",
    charts: [{
      title: "Lähtöjen lukumäärä vuosittain tarkasteltuna",
      yTitle: _.partial(yTitleNousut, "Lähdöt"),
      groupBy: ["organisaatioid", "vuosi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit),
        createFilter("kuukausi", "Tarkastelujakso", kuukaudet)],
      options: createMultiBarChart("Tarjonta", "Vuosi")
    }, {
      title: "Lähtöjen lukumäärä kuukausitasolla",
      yTitle: _.partial(yTitleNousutKK, "Lähdöt"),
      groupBy: ["organisaatioid", "kuukausi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit)],
      options: createLineChartKK("Tarjonta")}]
  }, {
    id: "linjakilometrit",
    nimi: "Linjakilometrit",
    charts: [{
      title: "Linjakilometrien lukumäärä vuosittain tarkasteltuna",
      yTitle: _.partial(yTitleNousut, "Linjakilometrit"),
      groupBy: ["organisaatioid", "vuosi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit),
        createFilter("kuukausi", "Tarkastelujakso", kuukaudet)],
      options: createMultiBarChart("Tarjonta", "Vuosi")
    }, {
      title: "Linjakilometrien lukumäärä kuukausitasolla",
      yTitle: _.partial(yTitleNousutKK, "Linjakilometrit"),
      groupBy: ["organisaatioid", "kuukausi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit)],
      options: createLineChartKK("Tarjonta")}]
  }, {
    id: "kalusto",
    nimi: "Kalusto",
    charts: [{
      title: "Kaluston lukumäärä vuosittain tarkasteltuna",
      yTitle: _.partial(yTitleNousut, "Kaluston lukumäärä"),
      groupBy: ["organisaatioid", "vuosi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit),
        createFilter("paastoluokka", "Päästöluokka", paastoluokat)],
      options: createMultiBarChart("Kalusto", "Vuosi")
    }, {
      title: "Kaluston lukumäärä valittuna vuonna",
      yTitle: _.partial(yTitleNousut, "Kaluston lukumäärä"),
      groupBy: ["organisaatioid", "paastoluokkatunnus"],
      filters: [
        createFilter("vuosi", "Vuosi", vuodet, '2016'),
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit)],
      options: createMultiBarChart("Kalusto", "Päästöluokka")}]
  }];

function convertToNvd3(data, organisaatiot) {
  return _.map(_.values(_.groupBy(data, row => row[0])),
               rows => ({key: (_.find(organisaatiot, {id: rows[0][0]})).nimi,
                         values: _.map(rows, row => ({x: row[1], y: row[2]})) }));
}

function watchParamsAndRefresh($scope, $q, RaporttiService, OrganisaatioService) {
  var charts = $scope.tunnusluku.charts;
  var tunnusluku = $scope.tunnusluku;

  // init chart data and chart params
  $scope.data = new Array(charts.length);
  $scope.params.charts = new Array(charts.length);

  function listener(id, chart, organisaatiolaji, filters) {
    var ytitle = $scope.tunnusluku.charts[id].yTitle(filters);
    chart.options.subtitle.text = ytitle;
    chart.options.chart.yAxis.axisLabel = ytitle;

    $q.all([RaporttiService.haeTunnuslukuTilasto(tunnusluku.id,
                                                 _.assign( {organisaatiolajitunnus: organisaatiolaji}, filters),
                                                 chart.groupBy),
            OrganisaatioService.hae()])
      .then(([data, organisaatiot])=> {
              $scope.data[id] = convertToNvd3(data, organisaatiot);
            });
  }

  _.forEach(charts, function(chart, id) {
    var defaultFilter = _.map(_.filter(chart.filters, f => c.isDefinedNotNull(f.defaultValue)), f => [f.id, f.defaultValue])
    $scope.params.charts[id] = {filter: c.coalesce(_.zipObject(defaultFilter), {})};

    const filterPath = 'params.charts[' + id + '].filter';
    $scope.$watchCollection(filterPath,
      filters => listener(id, chart, $scope.params.organisaatiolaji, filters));

    $scope.$watch('params.organisaatiolaji',
      organisaatiolaji => listener(id, chart, organisaatiolaji, _.get($scope, filterPath)));
  });
}

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiOmakuvaajaCtrl',
    ['$scope', '$state', '$timeout', '$window', '$q', 'RaporttiService', 'OrganisaatioService',
    function ($scope, $state, $timeout, $window, $q, RaporttiService, OrganisaatioService) {

    $scope.params = {
      tunnuslukuid: $state.params.tunnuslukuid
    };

    $scope.$watch("params.tunnuslukuid", (id) => {
      $state.go($state.current.name, {tunnuslukuid: id});
    });

    $scope.tunnusluvut = tunnusluvut;
    $scope.tunnusluku = _.find(tunnusluvut, {id: $state.params.tunnuslukuid});

    $scope.organisaatiolajit = organisaatiolajit;

    $scope.params.organisaatiolaji = 'KS1';

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $scope.params.organisaatiolaji === tyyppi;
    };

    $scope.toTab = function toTab(tyyppi) {
      $scope.params.organisaatiolaji = tyyppi;
    };

    if ($scope.tunnusluku) {
      watchParamsAndRefresh($scope, $q, RaporttiService, OrganisaatioService);
    };
  }]);