'use strict';

var _ = require('lodash');
var angular = require('angular');
var c = require('utils/core');

const kuukaudet = ["Koko vuosi", "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
                   "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

const kalustoluokat = { E0: "EURO 0", E1: "EURO 1", E2: "EURO 2", E3: "EURO 3", E4: "EURO 4", E5: "EURO 5/EEV", E6: "EURO 6" };

const viikonpaivaluokat = {A: 'Arkipäivä', LA: 'Lauantai', SU: 'Sunnuntai'};

const organisaatiolajit = {
  ALL: 'Kaikki organisaatiot',
  KS1: 'Suuret kaupunkiseudut',
  KS2: 'Keskisuuret kaupunkiseudut',
  KS3: 'Pienet kaupunkiseudut',
  ELY: 'ELY-keskukset'
};

const sopimustyypit = {
  ALL: 'Kaikki sopimustyypit',
  BR:  'PSA brutto',
  KOS: 'PSA KOS',
  SA:  'Siirtymäajan liikenne',
  ME:  'Markkinaehtoinen liikenne'
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
      showValues: false,
      valueFormat: function (d) {
        return d3.format('.02f')(d);
      }
    }
  });
};

function createLineChart(title, xLabel) {
  return _.merge(
    createChart(title, xLabel), {
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

function createFilter(id, nimi, values, valueKeyToId = _.identity, defaultValue = 'ALL') {
  return {id: id, nimi: nimi, values: values, defaultValue: defaultValue, valueKeyToId: valueKeyToId};
}

function yTitleNousut(filter) {
  return "Nousut" +
    (filter.sopimustyyppitunnus && filter.sopimustyyppitunnus !== 'ALL' ?  " (" + sopimustyypit[filter.sopimustyyppitunnus] + ")" : "") + " / " +
    (filter.kuukausi && filter.kuukausi !== 'ALL' ? kuukaudet[filter.kuukausi] : 'Vuosi');
}

function yTitleNousutKK(filter) {
  return "Nousut" +
    (filter.sopimustyyppitunnus && filter.sopimustyyppitunnus !== 'ALL' ?  " (" + sopimustyypit[filter.sopimustyyppitunnus] + ")" : "") + " / Kuukausi";
}

const tunnusluvut = [{
    id: "nousut",
    nimi: "Nousut",
    charts: [{
      title: "Nousujen lukumäärä vuosittain tarkasteltuna",
      yTitle: yTitleNousut,
      groupBy: ["organisaatioid", "vuosi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit),
        createFilter("kuukausi", "Tarkastelujakso", kuukaudet, key => key === 0 ? "ALL" : key)],
      options: createMultiBarChart("Kysyntä", "Vuosi")
    }, {
      title: "Nousujen lukumäärä kuukausitasolla",
      yTitle: yTitleNousutKK,
      groupBy: ["organisaatioid", "kuukausi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit)],
      options: createLineChart("Kysyntä", "Kuukausi")}]
  }];

function convertToNvd3(data, organisaatiot) {
  return _.map(_.values(_.groupBy(data, row => row[0])),
               rows => ({key: (_.find(organisaatiot, {id: rows[0][0]})).nimi,
                         values: _.map(rows, row => ({x: row[1], y: row[2]})) }));
}

function watchParamsAndRefresh($scope, $q, RaporttiService, OrganisaatioService) {
  var charts = $scope.tunnusluku.charts;
  var tunnusluku = $scope.tunnusluku;
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
