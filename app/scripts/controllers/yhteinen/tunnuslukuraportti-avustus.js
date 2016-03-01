'use strict';

var angular = require('angular');
var _ = require('lodash');
var c = require('utils/core');
var d = require('utils/directive');
var t = require('utils/tunnusluvut');

var subtitle = {
  enable: true,
  text: 'Suuret kaupunkiseudut'
}

var avustusGraph = {
  chart: {
    type: 'multiBarChart',
    height: 450,
    stacked: false,
    showControls: false,
    x: function (d) {
      return d[1];
    },
    y: function (d) {
      return d[2];
    },
    yAxis: {
      axisLabel: '',
      tickFormat: t.numberFormat
    },
    xAxis: {
      axisLabel: 'Vuosi'
    }
  },
  title: {
    enable: true,
    text: 'Joukkoliikenteen valtionavustushakemukset ja päätökset'
  },
  subtitle: subtitle
};

var avustusDetailGraph = {
  chart: {
    type: 'multiBarChart',
    height: 450,
    stacked: false,
    x: function (d) {
      return d[1];
    },
    y: function (d) {
      return d[2];
    },
    yAxis: {
      axisLabel: '',
      tickFormat: t.numberFormat
    },
    xAxis: {
      axisLabel: 'Vuosi'
    }
  },
  title: {
    enable: true,
    text: 'Haetut avustukset ryhmitelty organisaatioittain'
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
    chart: {y: d =>  d[2]},
    title: {text: 'Haetut avustukset ryhmitelty organisaatioittain'}
  },
  M: {
    chart: {y: d =>  d[3]},
    title: {text: 'Myönnetyt avustukset ryhmitelty organisaatioittain'}
  }
}

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiAvustusCtrl',
    ['$scope', '$state', '$timeout', '$window', '$q', 'RaporttiService', 'OrganisaatioService',
      function ($scope, $state, $timeout, $window, $q, RaporttiService, OrganisaatioService) {

        $scope.organisaatiolajit = t.organisaatiolajit;

        $scope.avustus = {
          options: avustusGraph
        }

        $scope.avustusdetail = {
          options: avustusDetailGraph
        }

        $scope.organisaatiolaji = _.find([$state.params.organisaatiolaji, 'KS1'], c.isNotBlank); //c.isBlank($state.params.organisaatiolaji) ? 'KS1' : $state.params.organisaatiolaji;
        $scope.avustustyyppi = _.find([$state.params.avustustyyppi, 'H'], c.isNotBlank);

        subtitle.text = t.organisaatiolajit.$nimi($scope.organisaatiolaji);

        d.createTabFunctions($scope, 'organisaatiolaji');
        $scope.toTab = function(tyyppi) {
          $state.go($state.current.name, {organisaatiolaji: tyyppi});
        };

        $scope.$watch("avustustyyppi", (avustustyyppi) => {
          _.merge(avustusDetailGraph, avustustyyppiDetailGraph[avustustyyppi]);
        });

        RaporttiService.haeAvustus($scope.organisaatiolaji).then(avustukset => {
          $scope.avustus.data = _.map(_.values(_.groupBy(_.tail(avustukset), row => row[0])),
            rows => ({
              key: avustustyypit.$nimi(rows[0][0]),
              values: rows
            }))
        });

        $q.all([RaporttiService.haeAvustusDetails($scope.organisaatiolaji),
               OrganisaatioService.hae()])
          .then(([avustukset, organisaatiot]) => {
            $scope.avustusdetail.data = _.map(_.values(_.groupBy(_.tail(avustukset), row => row[0])),
              rows => ({
                key: (_.find(organisaatiot, {id: rows[0][0]})).nimi,
                values: rows
              }));
        });
      }]);
