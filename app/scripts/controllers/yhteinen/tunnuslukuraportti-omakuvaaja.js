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
  ALL: 'Kaikki tyypit',
  BR:  'PSA brutto',
  KOS: 'PSA KOS',
  SA:  'Siirtymäajan liikenne',
  ME:  'Markkinaehtoinen liikenne'
};

function createMultiBarChart(title, subtitle, xLabel, yLabel) {
  return {
    chart: {
      type: 'multiBarChart',
      height: 450,
      stacked: false,
      reduceXTicks: false,
      x: d => d.x,
      y: d => d.y,
      showValues: false,
      valueFormat: function (d) {
        return d3.format('.02f')(d);
      },
      yAxis: {
        axisLabel: yLabel
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
      text: subtitle
    }
  };
};

function createLineChart(title, subtitle, xLabel, yLabel) {
  return {
    chart: {
      type: 'lineWithFocusChart',
      height: 450,
      interpolate: "linear",
      x: d => d.x,
      y: d => d.y,
      yAxis: {
        axisLabel: yLabel
      },
      xAxis: {
        axisLabel: xLabel,
        tickFormat: d => d3.time.format.utc("%m/%Y") (new Date(d))
      },
      xScale: d3.time.scale.utc(),
      x2Axis: {
        axisLabel: xLabel,
        tickFormat: d => d3.time.format.utc("%m/%Y") (new Date(d))
      }
    },
    title: {
      enable: true,
      text: title
    },
    subtitle: {
      enable: true,
      text: subtitle
    }
  };
};

function createFilter(id, nimi, values, valueKeyToId = _.identity) {
  return {id: id, nimi: nimi, values: values, valueKeyToId: valueKeyToId};
}

const tunnusluvut = [{
    id: "nousut",
    nimi: "Nousut",
    charts: [{
      title: "Nousujen lukumäärä vuositasolla",
      groupBy: ["organisaatioid", "vuosi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit),
        createFilter("kuukausi", "Tarkastelujakso", kuukaudet, key => key === 0 ? "ALL" : key)],
      options: createMultiBarChart("Kysyntä", "Nousua / vuosi", "Vuosi", "Nousua / vuosi")
    }, {
      title: "Nousujen lukumäärä kuukausitasolla",
      groupBy: ["organisaatioid", "kuukausi"],
      filters: [
        createFilter("sopimustyyppitunnus", "Sopimustyyppi", sopimustyypit)],
      options: createLineChart("Kysyntä", "Nousua / kuukausi", "Kuukausi", "Nousua / kuukausi")}]
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

  function listener(id, chart, organisaatiolaji, filters) {
    $q.all([RaporttiService.haeTunnuslukuTilasto(tunnusluku.id,
                                                 _.assign( {organisaatiolajitunnus: organisaatiolaji}, filters),
                                                 chart.groupBy),
            OrganisaatioService.hae()])
      .then(([data, organisaatiot])=> {
              $scope.data[id] = convertToNvd3(data, organisaatiot);
            });
  }

  _.forEach(charts, function(chart, id) {
    const filterPath = 'params.charts[' + id + '].filter';
    $scope.$watchCollection(filterPath,
      filters => listener(id, chart, $scope.params.organisaatiolaji, filters));

    $scope.$watch('params.organisaatiolaji',
      organisaatiolaji => listener(id, chart, organisaatiolaji, _.get($scope.params, filterPath)));
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
