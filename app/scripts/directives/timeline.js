'use strict';
var angular = require('angular');
var vis = require('vis');
angular.module('jukufrontApp')
  .directive('timeline', function () {
    return {
      restrict: 'EA',
      scope: {
        kilpailutukset: '<kilpailutukset',
        options: '<options',
        organisaatiot: '<organisaatiot',
      },
      link: function(scope, element, attrs) {
        var timeline = new vis.Timeline(element.find('div')[0]),
          items = [],
          colors = [
            { 0: '#0085c9', 1: '#ffffff' },
            { 0: 'black', 1: '#ffffff' },
            { 0: '#f2f2f2', 1: 'black' },
            { 0: 'grey', 1: '#ffffff' },
            { 0: 'red', 1: '#ffffff' },
            { 0: 'orange', 1: '#ffffff' }
          ];

        for (var i = 0; i < scope.kilpailutukset.length; i += 1) {
          for (var ii = 0; ii < scope.kilpailutukset[i].dates.length - 1; ii += 1) {
            items.push({
              id: scope.kilpailutukset[i].organisaatioId + '-' + scope.kilpailutukset[i].id + '-' + ii,
              content: ii === 0 ? scope.kilpailutukset[i].name : '&nbsp;',
              start: scope.kilpailutukset[i].dates[ii],
              end: scope.kilpailutukset[i].dates[ii + 1],
              group: scope.kilpailutukset[i].organisaatioId,
              subgroup: scope.kilpailutukset[i].id,
              title: scope.kilpailutukset[i].name,
              style: 'background-color: ' + (colors[ii][0] ? colors[ii][0] : 'brown') + '; color: ' + (colors[ii][1] ? colors[ii][1] : '#ffffff') + '; border: none;' +  (ii === 0 ? ' z-index: 100;' : '')
            });
          }
        }

        timeline.setOptions(scope.options);

        timeline.setData({
          groups: scope.organisaatiot,
          items: items
        });

      },
      template: require('views/yhteinen/timeline.html')
    }
  });