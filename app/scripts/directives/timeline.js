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
        events: '<events'
      },
      link: function(scope, element, attributes) {
        var timeline = new vis.Timeline(element.find('div')[0]),
          groups = [],
          items = [],
          colors = [
            { 0: '#2479B2', 1: '#ffffff' },
            { 0: '#35ACFF', 1: '#ffffff' },
            { 0: '#B27215', 1: '#ffffff' },
            { 0: '#FFA829', 1: '#ffffff' }
          ], i, ii;

        scope.$watch('organisaatiot', function(value) {
          if (scope.organisaatiot && Object.keys(scope.organisaatiot).length) {
            for (i = 0; i < scope.organisaatiot.length; i += 1) {
              groups.push({
                id: scope.organisaatiot[i].id,
                content: scope.organisaatiot[i].nimi
              });
            }

            for (i = 0; i < scope.kilpailutukset.length; i += 1) {
              for (ii = 0; ii < scope.kilpailutukset[i].dates.length - 1; ii += 1) {
                items.push({
                  id: scope.kilpailutukset[i].organisaatioId + '-' + scope.kilpailutukset[i].id + '-' + ii,
                  content: '&nbsp;',
                  start: scope.kilpailutukset[i].dates[ii],
                  end: scope.kilpailutukset[i].dates[ii + 1],
                  group: scope.kilpailutukset[i].organisaatioId,
                  subgroup: scope.kilpailutukset[i].id,
                  title: scope.kilpailutukset[i].name,
                  style: 'background-color: ' + (colors[ii][0] ? colors[ii][0] : 'brown') + '; color: ' + (colors[ii][1] ? colors[ii][1] : '#ffffff') + '; border: none;'
                });
              }

              items.push({
                id: scope.kilpailutukset[i].organisaatioId + '-' + scope.kilpailutukset[i].id + '-' + ii,
                content: scope.kilpailutukset[i].name,
                start: scope.kilpailutukset[i].dates[0],
                end: scope.kilpailutukset[i].dates[ii],
                group: scope.kilpailutukset[i].organisaatioId,
                subgroup: scope.kilpailutukset[i].id,
                title: scope.kilpailutukset[i].name,
                style: 'background-color: transparent; color: white; border: none; z-index: 2;',
                linkToHilma: scope.kilpailutukset[i].linkToHilma
              });

            }

            scope.options.template = (item) => {
              if (item.linkToHilma) {
                return '<p style="margin: 0;">' + item.content + ' <a class="link-to-hilma" href="' + item.linkToHilma + '" style="background-color: #ffffff; text-transform: uppercase; font-size: 10px; border-radius: 4px; padding: 0.2em;">Hilma</a></p>';
              } else {
                return item.content;
              }
            };

            timeline.setOptions(scope.options);

            Object.keys(scope.events).forEach(key => {
              timeline.on(key, scope.events[key]);
            });

            timeline.setData({
              groups: groups,
              items: items
            });

          }
        });
      },
      template: require('views/yhteinen/timeline.html')
    }
  });
