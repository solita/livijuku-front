'use strict';

var angular = require('angular');
var _ = require('lodash');
var t = require('utils/tunnusluvut');
var c = require('utils/core');
var Promise = require('bluebird');

function isOrganisaatiolaji(laji) {
  return id => laji === 'KS1' && _.includes([1, 10, 12, 13], id) ||
               laji === 'KS2' && id < 15 && !_.includes([1, 10, 12, 13], id) ||
               laji === 'ELY' && id < 25 && id > 15 ||
               laji === 'KS3' && id > 24 ||
               laji === 'ALL'
}

const dimensio = {
  kuukausi: _.map(c.cartesianProduct(_.range(2013, 2016), _.range(1, 13)), row => Date.UTC(row[0], (row[1] - 1))),
  paastoluokkatunnus: _.map(_.range(0,7), i => 'E' + i),
  viikonpaivaluokkatunnus: ['A', 'LA', 'SU'],
  kustannuslajitunnus: ['AP', 'KP', 'LP', 'TM', 'MP'],
  vyohykemaara: _.range(1, 7),
  lippuhintaluokkatunnus: ['KE', 'KA'],
  vuosi: _.range(2013, 2016)
}

function kuukausiToUTC(vuosikk) {
  var year = parseInt(vuosikk.substring(0, 4));
  var kuukausi = parseInt(vuosikk.substring(4));
  return Date.UTC(year, (kuukausi - 1));
}

angular.module('services.tunnusluvut')

  .factory('RaporttiService', ['$http', function ($http) {

    return {
      haeTunnuslukuTilasto: function (tunnusluku, organisaatiolajitunnus, where, groupBy) {
        var queryParams = _.map(_.omitBy(where, value => value === 'ALL'), (value, key) => key + "=" + value).join('&');
        var groupByQueryParams = _.map(groupBy, value => "group-by=" + value).join('&');

        return $http.get('api/tilastot/' + tunnusluku + '/' + organisaatiolajitunnus + '?' + queryParams + '&' + groupByQueryParams).then(
          res => groupBy[1] === 'kuukausi' ?
          _.map(res.data, row => {row[1] = kuukausiToUTC(row[1]); return row}) :
          res.data);
      },
      haeTunnuslukuTilastoDemo: function (tunnusluku, organisaatiolajitunnus, where, groupBy) {
        var laji = organisaatiolajitunnus;

        var column1 = laji ? _.filter(_.range(1, 36), isOrganisaatiolaji(laji)) : _.range(1, 36)
        var column2 = dimensio[groupBy[1]];
        var column3 = dimensio[groupBy[2]];

        var data = column3 ? c.cartesianProduct(column1, column2, column3) : c.cartesianProduct(column1, column2);

        return _.map(data, row => { row.push(Math.floor(Math.random() * 100)); return row });
      },
      haeAvustus: function (organisaatiolajitunnus) {
        return $http.get('api/avustus/' + organisaatiolajitunnus).then(res => res.data);
      }
    }
  }])
;
