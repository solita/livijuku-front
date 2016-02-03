'use strict';

var angular = require('angular');
var _ = require('lodash');
var t = require('utils/tunnusluvut');
var c = require('utils/core');
var Promise = require('bluebird');

function isOrganisaatiolaji(laji) {
  return row => laji === 'KS1' && _.contains([1, 10, 12, 13], row[0]) ||
                laji === 'KS2' && row[0] < 15 && !_.contains([1, 10, 12, 13], row[0]) ||
                laji === 'ELY' && row[0] < 25 && row[0] > 15 ||
                laji === 'KS3' && row[0] > 24 ||
                laji === 'ALL'
}

const dimensio2 = {
  kuukausi: _.map(c.cartesianProduct(_.range(2013, 2016), _.range(1, 13)), row => Date.UTC(row[0], (row[1] - 1))),
  paastoluokkatunnus: _.map(_.range(0,7), i => 'E' + i),
  viikonpaivaluokkatunnus: ['A', 'LA', 'SU'],
  vuosi: _.range(2013, 2016)
}

angular.module('services.tunnusluvut')

  .factory('RaporttiService', ['$http', function ($http) {

    return {
      haeTunnuslukuTilasto: function (tunnusluku, where, groupBy) {
        var laji = where.organisaatiolajitunnus;
        var column2 = dimensio2[groupBy[1]];

        var data = _.map(c.cartesianProduct(_.range(1, 36), column2), row => { row.push(Math.random() * 100); return row });

        return Promise.resolve(laji ? _.filter(data, isOrganisaatiolaji(laji)) : data);
      }
    }
  }])
;
