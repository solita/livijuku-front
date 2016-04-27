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
          ['#3385D6', '#ffffff', '1px solid #3385D6'],
          ['#C266EB', '#ffffff', '1px solid #C266EB'],
          ['#FFA033', '#ffffff', '1px solid #FFA033'],
          ['#33BB33', '#ffffff', '1px solid #33BB33'],
          ['#66CCD6', '#ffffff', '1px solid #66CCD6'],
          ['#cfeff2', '#ffffff', '1px dashed #66CCD6; border-left-style: solid']
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
                type: 'range',
                content: '&nbsp;',
                start: startDate,
                end: kilpailutus.dates[index + 1],
                group: kilpailutus.organisaatioid,
                subgroup: kilpailutus.id,
                title: kilpailutus.kohdenimi,
                style: 'background-color: ' + colors[index][0] + '; color: ' + colors[index][1] + '; border: ' + colors[index][2] + '; height: 24px;'
              }));

            subgroup.push({
              id: kilpailutus.organisaatioid + '-' + kilpailutus.id + '-' + (kilpailutus.dates.length - 1),
              //type: 'background',
              content: kilpailutus.kohdenimi,
              start: _.first(kilpailutus.dates),
              end: _.last(kilpailutus.dates),
              group: kilpailutus.organisaatioid,
              subgroup: kilpailutus.id,
              title: kilpailutus.kohdenimi,
              style: 'background-color: transparent; color: white; border: 1px solid transparent; z-index: 2; height: 24px; line-height: 10px; ',
              linkToHilma: kilpailutus.hilmalinkki
            });

            return subgroup;
          });

          scope.options.template = (item) => {
            if (item.linkToHilma) {
              //return '<p>' + item.content + ' &nbsp; <span class="label label-default">Hilma</span> </p>';
              return '<p>' + item.content + ' &nbsp; <a class="link-to-hilma" href="http://' + item.linkToHilma +
                '" style="background-color: #ffffff; font-size: 10px; border-radius: 4px; padding: 0.2em; vertical-align: middle;">Hilma</a></p>';
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
