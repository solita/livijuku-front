'use strict';

var _ = require('lodash');

var tilat = [
  {
    id: '0',
    label: 'Ei käynnissä',
    className: 'label-default'
  },
  {
    id: 'K',
    label: 'Keskeneräinen',
    className: 'label-warning'
  },
  {
    id: 'V',
    label: 'Vireillä',
    className: 'label-primary'
  },
  {
    id: 'T0',
    label: 'Täydennettävänä',
    className: 'label-warning'
  },
  {
    id: 'TV',
    label: 'Täydennetty',
    className: 'label-primary'
  },
  {
    id: 'T',
    label: 'Tarkastettu',
    className: 'label-primary'
  },
  {
    id: 'P',
    label: 'Päätetty',
    className: 'label-success'
  },
  {
    id: 'M',
    label: 'Maksettu',
    className: 'label-success'
  }
];

module.exports = {
  getAll: function() {
    return tilat;
  },
  find: function(id) {
    return _.findWhere(tilat, {id: id});
  }
};
