'use strict';
var angular = require('angular');
var vis = require('vis');
var _ = require('lodash');
var c = require('utils/core');

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
      var timeline = new vis.Timeline(element.find('div')[0]);
      const colors = [
          ['#2479B2', '#ffffff'],
          ['#35ACFF', '#ffffff'],
          ['#B27215', '#ffffff'],
          ['#FFA829', '#ffffff'],
          ['#ff0000', '#ffffff'],
          ['#ff6666', '#ffffff']
        ];

      scope.$watchGroup(["organisaatiot", "kilpailutukset"], ([organisaatiot, kilpailutukset]) => {
        if (scope.organisaatiot && scope.kilpailutukset) {

          const groups = _.map(organisaatiot, organisaatio => ({
              id: organisaatio.id,
              content: organisaatio.nimi
            }));

          const items = _.flatMap(kilpailutukset, kilpailutus => {

            var subgroup = _.map(_.initial(kilpailutus.dates), (startDate, index) => ({
                id: kilpailutus.organisaatioid + '-' + kilpailutus.id + '-' + index,
                content: '&nbsp;',
                start: startDate,
                end: kilpailutus.dates[index + 1],
                group: kilpailutus.organisaatioid,
                subgroup: kilpailutus.id,
                title: kilpailutus.name,
                style: 'background-color: ' + c.coalesce(colors[index][0], 'brown') + '; color: ' + c.coalesce(colors[index][1], '#ffffff') + '; border: none;'
              }));

            subgroup.push({
              id: kilpailutus.organisaatioid + '-' + kilpailutus.id + '-' + (kilpailutus.dates.length - 1),
              content: kilpailutus.name,
              start: _.first(kilpailutus.dates),
              end: _.last(kilpailutus.dates),
              group: kilpailutus.organisaatioid,
              subgroup: kilpailutus.id,
              title: kilpailutus.name,
              style: 'background-color: transparent; color: white; border: none; z-index: 2;',
              linkToHilma: kilpailutus.linkToHilma
            });

            return subgroup;
          });

          scope.options.template = (item) => {
            if (item.linkToHilma) {
              return '<p style="margin: 0;">' + item.content + ' <a class="link-to-hilma" href="' + item.linkToHilma +
                '" style="background-color: #ffffff; text-transform: uppercase; font-size: 10px; border-radius: 4px; padding: 0.2em;">Hilma</a></p>';
            } else {
              return item.content;
            }
          };

          timeline.setOptions(scope.options);

          _.map(scope.events, (event, key) => {
            timeline.on(key, event);
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
