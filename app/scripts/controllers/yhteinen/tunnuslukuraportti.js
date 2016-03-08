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

const colors = ['#aec7e8', '#1f77b4', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
                '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
                '#6b6ecf', '#b5cf6b', '#bd9e39', '#d6616b', '#a55194', '#9c9ede', '#cedb9c', '#e7ba52', '#ce6dbd', '#de9ed6',
                '#3182bd', '#e6550d', '#fdae6b', '#31a354', '#969696'];

const chartOptions = ytitle => ({
  color: colors,
  type: 'multiBarChart',
  height: 500,
  stacked: false,
  showControls: false,
  tooltip: {valueFormatter: t.numberFormatTooltip},
  x: d => d[1],
  y: d => d[2],
  yAxis: {
    axisLabel: ytitle,
    tickFormat: t.numberFormat
  },
  xAxis: {
    axisLabel: 'Vuosi'
  }
});

const createGraph = (title, ytitle) => ({
  options: {
    chart: chartOptions(ytitle),
    title: {
      enable: true,
      text: title
    },
    subtitle: subtitle
  }
});

function toOrganisaatioSeriesNvd3(data, organisaatiot) {
  return _.map(_.values(_.groupBy(_.tail(data), row => row[0])),
              rows => ({
                key: (_.find(organisaatiot, {id: rows[0][0]})).nimi,
                values: rows
              }));
}

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiCtrl',
    ['$scope', '$state', '$timeout', '$window', '$q', 'RaporttiService', 'OrganisaatioService',
      function ($scope, $state, $timeout, $window, $q, RaporttiService, OrganisaatioService) {

        $scope.organisaatiolajit = t.organisaatiolajit;

        $scope.asiakastyytyvaisyys = createGraph('Tyytyväisyys joukkoliikenteeseen', '%');
        $scope.nousut = createGraph('Matkustajamäärät', 'henkilöä');
        $scope.lahdot = createGraph('Lähtöjen määrä', 'kpl');
        $scope.linjakilometrit = createGraph('Linjakilometrit', 'km');
        $scope.avustusperasukas = createGraph('Valtion rahoitus asukasta kohden', '€');
        $scope.omarahoitusperasukas = createGraph('Toimivaltaisen viranomaisen omarahoitus asukasta kohden', '€');

        $scope.organisaatiolaji = _.find([$state.params.organisaatiolaji, 'ALL'], c.isNotBlank);

        subtitle.text = t.organisaatiolajit.$nimi($scope.organisaatiolaji);

        d.createTabFunctions($scope, 'organisaatiolaji');
        $scope.toTab = function (tyyppi) {
          $state.go($state.current.name, {organisaatiolaji: tyyppi});
        };

        function loadTunnusluku(tunnuslukuid, scopename) {
          $q.all([RaporttiService.haeTunnuslukuTilasto(tunnuslukuid, $scope.organisaatiolaji, {}, ['organisaatioid', 'vuosi']),
                OrganisaatioService.hae()])
          .then(([data, organisaatiot]) => {
            $scope[scopename].data = toOrganisaatioSeriesNvd3(data, organisaatiot);
          })
        }

        loadTunnusluku('alue-asiakastyytyvaisyys', 'asiakastyytyvaisyys');
        loadTunnusluku('nousut', 'nousut');
        loadTunnusluku('lahdot', 'lahdot');
        loadTunnusluku('linjakilometrit', 'linjakilometrit');

        $q.all([RaporttiService.haeAvustusPerAsukasta($scope.organisaatiolaji),
                OrganisaatioService.hae()])
          .then(([avustukset, organisaatiot]) => {
            $scope.avustusperasukas.data = toOrganisaatioSeriesNvd3(avustukset, organisaatiot);
          });

        $q.all([RaporttiService.haeOmarahoitusPerAsukas($scope.organisaatiolaji),
                OrganisaatioService.hae()])
          .then(([rahoitus, organisaatiot]) => {
            $scope.omarahoitusperasukas.data = toOrganisaatioSeriesNvd3(rahoitus, organisaatiot);
          });
      }
    ]
  );
