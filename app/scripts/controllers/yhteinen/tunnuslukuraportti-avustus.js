'use strict';

var angular = require('angular');
var _ = require('lodash');
var c = require('utils/core');
var d = require('utils/directive');
var t = require('utils/tunnusluvut');

function arvonTulostus(arvo) {
  if (arvo >= 1000000) return (d3.format('.02f')(arvo / 1000000) + ' M');
  else if ((arvo <= 10) && (arvo % 1 !== 0)) return d3.format('.02f')(arvo);
  return arvo;
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
      tickFormat: arvonTulostus
    },
    xAxis: {
      axisLabel: 'Vuosi'
    }
  },
  title: {
    enable: true,
    text: 'Joukkoliikenteen valtionavustushakemukset ja päätökset'
  },
  subtitle: {
    enable: true,
    text: 'Suuret kaupunkiseudut'
  }
};

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiAvustusCtrl',
    ['$scope', '$state', '$timeout', '$window', '$q', 'RaporttiService', 'OrganisaatioService',
      function ($scope, $state, $timeout, $window, $q, RaporttiService, OrganisaatioService) {

        $scope.organisaatiolajit = t.organisaatiolajit;

        $scope.avustus = {
          options: avustusGraph
        }

        $scope.organisaatiolaji = c.isBlank($state.params.organisaatiolaji) ? 'KS1' : $state.params.organisaatiolaji;

        d.createTabFunctions($scope, 'organisaatiolaji');
        $scope.toTab = function(tyyppi) {
          $state.go($state.current.name, {organisaatiolaji: tyyppi});
          $scope.avustus.options.subtitle.text = t.organisaatiolajit.$nimi(tyyppi);
        };

        RaporttiService.haeAvustus($scope.organisaatiolaji).then(avustukset => {
          $scope.avustus.data = _.map(_.values(_.groupBy(_.tail(avustukset), row => row[0])),
            rows => ({
              key: rows[0][0] === 1 ? 'Myönnetty' : 'Haettu',
              values: rows
            }))
        });

      }]);
