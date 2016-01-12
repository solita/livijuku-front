'use strict';

var _ = require('lodash');

var tilat = [
  {
    id: '0',
    label: 'Ei käynnissä',
    className: 'hakemus-tila-eikaynnissa'
  },
  {
    id: 'K',
    label: 'Keskeneräinen',
    className: 'hakemus-tila-keskenerainen'
  },
  {
    id: 'V',
    label: 'Vireillä',
    className: 'hakemus-tila-vireilla'
  },
  {
    id: 'T0',
    label: 'Täydennettävänä',
    className: 'hakemus-tila-taydennettavana'
  },
  {
    id: 'TV',
    label: 'Täydennetty',
    className: 'hakemus-tila-taydennetty'
  },
  {
    id: 'T',
    label: 'Tarkastettu',
    className: 'hakemus-tila-tarkastettu'
  },
  {
    id: 'P',
    label: 'Päätetty',
    className: 'hakemus-tila-paatetty'
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
