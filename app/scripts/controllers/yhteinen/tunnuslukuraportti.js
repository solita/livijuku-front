'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiCtrl', ['$scope', function ($scope) {
    $scope.nvd3options1 = {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 60,
          left: 55
        },
        x: function (d) {
          return d.label;
        },
        y: function (d) {
          return d.value;
        },
        showValues: true,
        valueFormat: function (d) {
          return d3.format(',.4f')(d);
        },
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'X Axis'
        },
        yAxis: {
          axisLabel: 'Y Axis',
          axisLabelDistance: 30
        }
      }
    };
    $scope.nvd3data1 = [{
      key: "Cumulative Return",
      values: [
        {"label": "A", "value": -29.765957771107},
        {"label": "B", "value": 0},
        {"label": "C", "value": 32.807804682612},
        {"label": "D", "value": 196.45946739256},
        {"label": "E", "value": 0.19434030906893},
        {"label": "F", "value": -98.079782601442},
        {"label": "G", "value": -13.925743130903},
        {"label": "H", "value": -5.1387322875705}
      ]
    }];

    $scope.nvd3options2 = {
      chart: {
        type: 'multiBarChart',
        height: 450,
        x: function (d) {
          return d[0];
        },
        y: function (d) {
          return d[1];
        },
        stacked: true,
        barColor: function (d, i) {
          var colors = d3.scale.category20().range();
          var rnd = Math.floor(Math.random() * colors.length)
          return colors[rnd];
        }
      }
    };

    $scope.nvd3data2 = [
      {
        "key": "Pohjois-Pohjanmaan ELY",
        "values": [[2010, 4726300], [2011, 6190000], [2012, 5740000], [2013, 6026000], [2014, 4983361]]
      }, {
        "key": "Pohjois-Savon ELY",
        "values": [[2010, 8946000], [2011, 10225000], [2012, 9525222], [2013, 7826094], [2014, 6775000]]
      }, {
        "key": "Varsinais-Suomen ELY",
        "values": [[2010, 5044972], [2011, 5885000], [2012, 6900000], [2013, 6985000], [2014, 2980000]]
      }, {
        "key": "Uudenmaan ELY",
        "values": [[2010, 5949922], [2011, 8301474], [2012, 11100000], [2013, 6461517], [2014, 9590919]]
      }, {
        "key": "Etelä-Pohjanmaan ELY",
        "values": [[2010, 3589635], [2011, 4308816], [2012, 4340000], [2013, 4113803], [2014, 3664548]]
      }, {
        "key": "Kaakkois-Suomen ELY",
        "values": [[2010, 3940058], [2011, 4419818], [2012, 5440000], [2013, 1450669], [2014, 1705803]]
      }, {
        "key": "Keski-Suomen ELY",
        "values": [[2010, 3425700], [2011, 4405000], [2012, 3960000], [2013, 2535000], [2014, 1764000]]
      }, {
        "key": "Lapin ELY",
        "values": [[2010, 3416000], [2011, 3980000], [2012, 3990000], [2013, 4165000], [2014, 3987000]]
      }, {
        "key": "Pirkanmaan ELY",
        "values": [[2010, 2988258], [2011, 4392405], [2012, 4120000], [2013, 3762000], [2014, 2415000]]
      }];

  }]);
