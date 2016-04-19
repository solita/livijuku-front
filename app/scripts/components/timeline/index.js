'use strict';
var angular = require('angular');
var vis = require('vis');
var _ = require('lodash');

export function timeline () {
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
        ];

      scope.$watchGroup(["organisaatiot", "kilpailutukset"], ([organisaatiot, kilpailutukset]) => {
        if (scope.organisaatiot && scope.kilpailutukset) {

          groups = _.map(organisaatiot, organisaatio => ({
              id: organisaatio.id,
              content: organisaatio.nimi
            }));

          items = _.flatMap(kilpailutukset, kilpailutus => {
            var subgroup = [];
            var ii = 0;

            for (ii = 0; ii < kilpailutus.dates.length - 1; ii += 1) {
              subgroup.push({
                id: kilpailutus.organisaatioId + '-' + kilpailutus.id + '-' + ii,
                content: '&nbsp;',
                start: kilpailutus.dates[ii],
                end: kilpailutus.dates[ii + 1],
                group: kilpailutus.organisaatioId,
                subgroup: kilpailutus.id,
                title: kilpailutus.name,
                style: 'background-color: ' + (colors[ii][0] ? colors[ii][0] : 'brown') + '; color: ' + (colors[ii][1] ? colors[ii][1] : '#ffffff') + '; border: none;'
              });
            }

            subgroup.push({
              id: kilpailutus.organisaatioId + '-' + kilpailutus.id + '-' + ii,
              content: kilpailutus.name,
              start: _.first(kilpailutus.dates),
              end: _.last(kilpailutus.dates),
              group: kilpailutus.organisaatioId,
              subgroup: kilpailutus.id,
              title: kilpailutus.name,
              style: 'background-color: transparent; color: white; border: none; z-index: 2;',
              linkToHilma: kilpailutus.linkToHilma
            });

            return subgroup;
          });

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
    template: require('./index.html')
  }
};
