'use strict';

var angular = require('angular');
var _ = require('lodash');
var c = require('utils/core');
var d = require('utils/directive');
var t = require('utils/tunnusluvut');

var subtitle = {
  enable: true,
  text: 'Suuret kaupunkiseudut'
};

var chartOptions = {
  color: ['#aec7e8', '#1f77b4', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
    '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
    '#6b6ecf', '#b5cf6b', '#bd9e39', '#d6616b', '#a55194', '#9c9ede', '#cedb9c', '#e7ba52', '#ce6dbd', '#de9ed6',
    '#3182bd', '#e6550d', '#fdae6b', '#31a354', '#969696'],
  type: 'multiBarChart',
  height: 500,
  stacked: false,
  showControls: false,
  tooltip: {valueFormatter: t.numberFormatTooltip},
  x: d => d[1],
  y: d => d[2],
  yAxis: {
    axisLabel: '€',
    tickFormat: t.numberFormat
  },
  xAxis: {
    axisLabel: 'Vuosi'
  }
};

var avustusGraph = {
  chart: chartOptions,
  title: {
    enable: true,
    text: 'Joukkoliikenteen haetut ja myönnetyt avustukset'
  },
  subtitle: subtitle
};

var avustusDetailGraph = {
  chart: _.cloneDeep(chartOptions),
  title: {
    enable: true,
    text: 'Haetut avustukset organisaatioittain'
  },
  subtitle: subtitle
};

var avustusPerAsukasGraph = {
  chart: chartOptions,
  title: {
    enable: true,
    text: 'Myönnetty avustus / asukas'
  },
  subtitle: subtitle
};

const avustustyypit = {
  H: 'Haettu avustus',
  M: 'Myönnetty avustus',
  $nimi: id => avustustyypit[id]
};

const avustustyyppiDetailGraph = {
  H: {
    chart: {y: d => d[2]},
    title: {text: 'Haetut avustukset organisaatioittain'}
  },
  M: {
    chart: {y: d => d[3]},
    title: {text: 'Myönnetyt avustukset organisaatioittain'}
  }
};

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiAvustusCtrl',
    ['$scope', '$state', '$timeout', '$window', '$q', 'RaporttiService', 'OrganisaatioService',
      function ($scope, $state, $timeout, $window, $q, RaporttiService, OrganisaatioService) {

        $scope.organisaatiolajit = t.organisaatiolajit;

        $scope.avustus = {
          options: avustusGraph
        };

        $scope.avustusdetail = {
          options: avustusDetailGraph
        };

        $scope.avustusperasukas = {
          options: avustusPerAsukasGraph
        };

        $scope.organisaatiolaji = _.find([$state.params.organisaatiolaji, 'ALL'], c.isNotBlank);
        $scope.avustustyyppi = _.find([$state.params.avustustyyppi, 'M'], c.isNotBlank);

        subtitle.text = t.organisaatiolajit.$nimi($scope.organisaatiolaji);

        d.createTabFunctions($scope, 'organisaatiolaji');
        $scope.toTab = function (tyyppi) {
          $state.go($state.current.name, {organisaatiolaji: tyyppi});
        };

        $scope.$watch("avustustyyppi", (avustustyyppi) => {
          _.merge(avustusDetailGraph, avustustyyppiDetailGraph[avustustyyppi]);
        });

        RaporttiService.haeAvustus($scope.organisaatiolaji).then(avustukset => {
          $scope.avustus.csv = avustukset;
          $scope.avustus.data = _.map(_.values(_.groupBy(_.tail(avustukset), row => row[0])),
            rows => ({
              key: avustustyypit.$nimi(rows[0][0]),
              values: rows
            }));
        });

        function loadAvustusOrganisaatioTilasto(promise, scopename) {
          $q.all([promise, OrganisaatioService.hae()])
          .then(([avustukset, organisaatiot]) => {
            $scope[scopename].csv = t.addOrganisaationimiColumn(avustukset, organisaatiot);
            $scope[scopename].data = t.toOrganisaatioSeriesNvd3(avustukset, organisaatiot);
          });
        }

        loadAvustusOrganisaatioTilasto(RaporttiService.haeAvustusDetails($scope.organisaatiolaji), 'avustusdetail');
        loadAvustusOrganisaatioTilasto(RaporttiService.haeAvustusPerAsukas($scope.organisaatiolaji), 'avustusperasukas');
      }
    ]
  );
