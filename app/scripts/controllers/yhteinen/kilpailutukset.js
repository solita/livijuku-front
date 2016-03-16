'use strict';

var _ = require('lodash');
var angular = require('angular');
var vis = require('vis');

angular.module('jukufrontApp').controller('KilpailutuksetCtrl', ['$scope', '$state', '$element', function ($scope, $state, $element) {
	var container = $element.find('div')[1],
		groups = [{
			id: 1,
			content: 'Tampere'
		}, {
			id: 2,
			content: 'Helsinki'
		}],
		items = [
    {id: 1, content: 'Kaupunki', start: '2013-04-20', group: 1},
    {id: 2, content: 'Maaseutu', start: '2013-04-14', group: 1},
    {id: 3, content: 'item 3', start: '2013-04-18', group: 2},
    {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19', group: 1},
    {id: 5, content: 'item 5', start: '2013-04-25', group: 2},
    {id: 6, content: 'item 6', start: '2013-04-27', group: 2}
  ],
  	options = {};

	// Create a Timeline
  var timeline = new vis.Timeline(container);
  timeline.setData({
  	groups: groups,
  	items: items
  });
}]);
