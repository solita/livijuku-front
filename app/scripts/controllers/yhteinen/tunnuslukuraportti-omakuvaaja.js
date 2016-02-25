'use strict';

var _ = require('lodash');
var angular = require('angular');
var c = require('utils/core');

function nimi(id) {
  return this[id];
}

const kuukaudet = {
  ALL: "Koko vuosi", 1: "Tammikuu", 2: "Helmikuu", 3: "Maaliskuu", 4: "Huhtikuu", 5: "Toukokuu",
  6: "Kesäkuu", 7: "Heinäkuu", 8: "Elokuu", 9: "Syyskuu", 10: "Lokakuu", 11: "Marraskuu", 12: "Joulukuu",
  $order: ['ALL'].concat(_.range(1, 13)),
  $nimi: nimi,
  $id: "kuukausi"
};

const paastoluokat = {
  ALL: 'Kaikki', E0: "EURO 0", E1: "EURO 1", E2: "EURO 2", E3: "EURO 3", E4: "EURO 4", E5: "EURO 5/EEV", E6: "EURO 6",
  $order: ['ALL'].concat(_.map(_.range(0, 7), i => 'E' + i)),
  $nimi: nimi,
  $id: "paastoluokkatunnus"
};

const viikonpaivaluokat = {
  A: 'Arkipäivä', LA: 'Lauantai', SU: 'Sunnuntai',
  $order: ['A', 'LA', 'SU'],
  $nimi: nimi,
  $id: "viikonpaivaluokkatunnus"
};

const lipputuloluokat = {
  ALL: 'Kaikki', KE: 'Kertalippu', AR: 'Arvolippu', KA: 'Kausilippu',
  $order: ['ALL', 'KE', 'AR', 'KA'],
  $nimi: nimi,
  $id: "lipputuloluokkatunnus"
};

const lippuhintaluokat = {
  KE: 'Kertalippu', KA: 'Kausilippu',
  $order: ['KE', 'KA'],
  $nimi: v => lippuhintaluokat[v],
  $id: "lippuhintaluokkatunnus"
};

const kustannuslajit = {
  ALL: 'Kaikki', AP: 'Asiakaspalvelu', KP: 'Konsulttipalvelu',
  LP: 'Lipunmyyntipalkkiot', TM: 'Tieto-/maksujärjestelmät', MP: 'Muut palvelut',
  $order: ['ALL', 'AP', 'KP', 'LP', 'TM', 'MP'],
  $nimi: nimi,
  $id: "kustannuslajitunnus"
};

const organisaatiolajit = {
  ALL: 'Kaikki organisaatiot',
  KS1: 'Suuret kaupunkiseudut',
  KS2: 'Keskisuuret kaupunkiseudut',
  KS3: 'Pienet kaupunkiseudut',
  ELY: 'ELY-keskukset',
  $order: ['ALL', 'KS1', 'KS2', 'KS3', 'ELY'],
  $nimi: nimi,
  $id: "organisaatiolajitunnus"
};

const sopimustyypit = {
  ALL: 'Kaikki sopimustyypit',
  BR: 'PSA brutto',
  KOS: 'PSA KOS',
  SA: 'Siirtymäajan liikenne',
  ME: 'Markkinaehtoinen liikenne',
  $order: ['ALL', 'BR', 'KOS', 'SA', 'ME'],
  $nimi: nimi,
  $id: "sopimustyyppitunnus"
};

const vuodet = {
  $order: _.range(2013, 2017).reverse(),
  $nimi: _.identity,
  $id: "vuosi"
};

const vyohykemaarat = {
  $order: _.range(1, 7),
  $nimi: id => id === 1 ? 1 + ' vyöhyke' : id + ' vyöhykettä',
  $id: "vyohykemaara"
};

function arvonTulostus(arvo) {
  if (arvo >= 1000000) return (d3.format('.02f')(arvo / 1000000) + ' M');
  else if ((arvo <= 10) && (arvo % 1 !== 0)) return d3.format('.02f')(arvo);
  return arvo;
}

function createChart(title, xLabel) {
  return {
    chart: {
      height: 450,
      x: d => d[1],
      y: d => d[2],
      yAxis: {
        axisLabel: ''
      },
      xAxis: {
        axisLabel: xLabel
      }
    },
    title: {
      enable: true,
      text: title
    },
    subtitle: {
      enable: true,
      text: ''
    }
  };
};

function createMultiBarChart(title, xLabel, tickvalues) {
  return _.merge(
    createChart(title, xLabel), {
      chart: {
        type: 'multiBarChart',
        stacked: false,
        reduceXTicks: false,
        tooltip: {
          valueFormatter: function (d) {
            return d;
          }
        },
        yAxis: {
          tickFormat: function (d) {
            return arvonTulostus(d);
          }
        },
        xAxis: {
          tickFormat: function (d) {
            if (typeof tickvalues !== 'undefined') return tickvalues[d];
            else return d;
          }
        }
      }
    });
};

function createLineChartKK(title, xLabel) {
  return _.merge(
    createChart(title, "Kuukausi"), {
      chart: {
        type: 'lineWithFocusChart',
        tooltip: {
          valueFormatter: function (d) {
            return d;
          }
        },
        xAxis: {
          tickFormat: d => d3.time.format.utc("%m/%Y")(new Date(d))
        },
        yAxis: {
          tickFormat: function (d) {
            return arvonTulostus(d);
          }
        },
        xScale: d3.time.scale.utc(),
        x2Axis: {
          tickFormat: d => d3.time.format.utc("%m/%Y")(new Date(d))
        }
      }
    });
};

function createFilter(nimi, values, defaultValue = 'ALL') {
  return {id: values.$id, nimi: nimi, values: values, defaultValue: defaultValue};
}

function filterInfoText(filter) {
  function txt(luokka) {
    var v = filter[luokka.$id];
    return c.isDefinedNotNull(v) && v !== 'ALL' ? luokka.$nimi(v) : null;
  }

  var info = _.filter(_.map([sopimustyypit, paastoluokat, viikonpaivaluokat, kustannuslajit], txt), c.isDefinedNotNull).join(', ');
  return info ? ' (' + info + ')' : '';
}

function yTitleTarkastelujakso(title, filter) {
  return title + filterInfoText(filter) + " / " +
    (filter.kuukausi && filter.kuukausi !== 'ALL' ? kuukaudet[filter.kuukausi] : 'vuosi');
}

function group(data, idx, names) {
  return (idx === (data[0].length - 2)) ?
    _.map(data, row => ({
      name: names[idx](row[idx]),
      size: row[idx + 1]
    })) :
    _.map(_.values(_.groupBy(data, row => row[idx])),
      rows => ({
        name: names[idx](rows[0][idx]),
        children: group(rows, idx + 1, names)
      }));

}

function convertToTree(name, names, data, organisaatiot) {
  return data.length > 1 ? [{
    name: name,
    children: group(_.tail(data), 0, [id => _.find(organisaatiot, {id: id}).nimi].concat(names))
  }] : [];
}

function createAlueTunnusluku(id, nimi, desc, unit) {
  return {
    id: "alue-" + id,
    nimi: "Alue - " + nimi,
    charts: [{
      title: "Alueen " + desc + " vuosittain tarkasteltuna",
      yTitle: filter => unit,
      groupBy: ["organisaatioid", "vuosi"],
      filters: [],
      options: createMultiBarChart(nimi, "Vuosi")
    }]
  }
}

const tunnusluvut = [{
  id: "nousut",
  nimi: "Nousut",
  charts: [{
    title: "Nousujen lukumäärä vuosittain tarkasteltuna",
    yTitle: _.partial(yTitleTarkastelujakso, "Nousut"),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Tarkastelujakso", kuukaudet)],
    options: createMultiBarChart("Kysyntä", "Vuosi")
  }, {
    title: "Nousujen lukumäärä kuukausitasolla",
    yTitle: filter => "Nousut" + filterInfoText(filter) + " / kuukausi",
    groupBy: ["organisaatioid", "kuukausi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createLineChartKK("Kysyntä")
  }]
}, {
  id: "lahdot",
  nimi: "Lähdöt",
  charts: [{
    title: "Lähtöjen lukumäärä vuosittain tarkasteltuna",
    yTitle: _.partial(yTitleTarkastelujakso, "Lähdöt"),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Tarkastelujakso", kuukaudet)],
    options: createMultiBarChart("Tarjonta", "Vuosi")
  }, {
    title: "Lähtöjen lukumäärä kuukausitasolla",
    yTitle: filter => "Lähdöt" + filterInfoText(filter) + " / kuukausi",
    groupBy: ["organisaatioid", "kuukausi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createLineChartKK("Tarjonta")
  }]
}, {
  id: "linjakilometrit",
  nimi: "Linjakilometrit",
  charts: [{
    title: "Linjakilometrien lukumäärä vuosittain tarkasteltuna",
    yTitle: _.partial(yTitleTarkastelujakso, "Linjakilometrit"),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Tarkastelujakso", kuukaudet)],
    options: createMultiBarChart("Tarjonta", "Vuosi")
  }, {
    title: "Linjakilometrien lukumäärä kuukausitasolla",
    yTitle: filter => "Linjakilometrit" + filterInfoText(filter) + " / kuukausi",
    groupBy: ["organisaatioid", "kuukausi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createLineChartKK("Tarjonta")
  }]
}, {
  id: "nousut-viikko",
  nimi: "Nousut (päivä)",
  charts: [{
    title: "Nousijat keskimääräisenä talviliikenteen (syyskuu-toukokuu) arkipäivänä, lauantaina tai sunnuntaina",
    yTitle: filter => "Nousut" + filterInfoText(filter),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Viikonpäivä", viikonpaivaluokat, 'A')],
    options: createMultiBarChart("Kysyntä", "Vuosi")
  }, {
    title: "Valitun vuoden talviliikenteen nousijat viikonpäiväluokittain (arkipäivänä/lauantaina/sunnuntaina)",
    yTitle: filter => "Nousut" + filterInfoText(filter) + " / päivä vuonna " + filter.vuosi,
    groupBy: ["organisaatioid", "viikonpaivaluokkatunnus"],
    filters: [
      createFilter("Vuosi", vuodet, '2016'),
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createMultiBarChart("Kysyntä", "Viikonpäiväluokka", viikonpaivaluokat)
  }]
}, {
  id: "lahdot-viikko",
  nimi: "Lähdöt (päivä)",
  charts: [{
    title: "Vuorotarjonta keskimääräisenä talviliikenteen (syyskuu-toukokuu) arkipäivänä/lauantaina/sunnuntaina vuosittain",
    yTitle: filter => "Lähdöt" + filterInfoText(filter),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Viikonpäivä", viikonpaivaluokat, 'A')],
    options: createMultiBarChart("Tarjonta", "Vuosi")
  }, {
    title: "Valitun vuoden talviliikenteen vuorotarjonta viikonpäiväluokittain",
    yTitle: filter => "Lähdöt" + filterInfoText(filter) + " / päivä vuonna " + filter.vuosi,
    groupBy: ["organisaatioid", "viikonpaivaluokkatunnus"],
    filters: [
      createFilter("Vuosi", vuodet, '2016'),
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createMultiBarChart("Tarjonta", "Viikonpäiväluokka", viikonpaivaluokat)
  }]
}, {
  id: "linjakilometrit-viikko",
  nimi: "Linjakilometrit (päivä)",
  charts: [{
    title: "Linjakilometrit keskimääräisenä talviliikenteen (syyskuu-toukokuu) arkipäivänä/lauantaina/sunnuntaina vuosittain",
    yTitle: filter => "Linjakilometrit" + filterInfoText(filter),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Viikonpäivä", viikonpaivaluokat, 'A')],
    options: createMultiBarChart("Tarjonta", "Vuosi")
  }, {
    title: "Valitun vuoden talviliikenteen linjakilometrit viikonpäiväluokittain (arkipäivänä/lauantaina/sunnuntaina)",
    yTitle: filter => "Linjakilometrit" + filterInfoText(filter) + " / päivä vuonna " + filter.vuosi,
    groupBy: ["organisaatioid", "viikonpaivaluokkatunnus"],
    filters: [
      createFilter("Vuosi", vuodet, '2016'),
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createMultiBarChart("Tarjonta", "Viikonpäiväluokka", viikonpaivaluokat)
  }]
}, {
  id: "liikennointikorvaus",
  nimi: "Liikennöintikorvaus",
  charts: [{
    title: "Liikennöintikorvaus vuosittain tarkasteltuna",
    yTitle: _.partial(yTitleTarkastelujakso, "Liikennöintikorvaus"),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Tarkastelujakso", kuukaudet)],
    options: createMultiBarChart("Liikennöintikorvaus", "Vuosi")
  }, {
    title: "Liikennöintikorvaus kuukausitasolla",
    yTitle: filter => "Liikennöintikorvaus" + filterInfoText(filter) + " / kuukausi",
    groupBy: ["organisaatioid", "kuukausi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createLineChartKK("Liikennöintikorvaus")
  }]
}, {
  id: "lipputulo",
  nimi: "Lipputulo",
  charts: [{
    title: "Lipputulo vuosittain tarkasteltuna",
    yTitle: _.partial(yTitleTarkastelujakso, "Lipputulo €"),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Lipputyyppi", lipputuloluokat),
      createFilter("Tarkastelujakso", kuukaudet)],
    options: createMultiBarChart("Lipputulo", "Vuosi")
  }, {
    title: "Lipputulo kuukausitasolla",
    yTitle: filter => "Lipputulo" + filterInfoText(filter) + " / kuukausi",
    groupBy: ["organisaatioid", "kuukausi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Lipputyyppi", lipputuloluokat)],
    options: createLineChartKK("Lipputulo")
  }]
}, {
  id: "kalusto",
  nimi: "Kalusto",
  charts: [{
    title: "Kaluston lukumäärä vuosittain tarkasteltuna",
    yTitle: filter => "Kaluston lukumäärä" + filterInfoText(filter),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Sopimustyyppi", sopimustyypit),
      createFilter("Päästöluokka", paastoluokat)],
    options: createMultiBarChart("Kalusto", "Vuosi")
  }, {
    title: "Kaluston lukumäärä päästöluokittain",
    yTitle: filter => "Kaluston lukumäärä" + filterInfoText(filter) + ' vuonna ' + filter.vuosi,
    groupBy: ["organisaatioid", "paastoluokkatunnus"],
    filters: [
      createFilter("Vuosi", vuodet, '2016'),
      createFilter("Sopimustyyppi", sopimustyypit)],
    options: createMultiBarChart("Kalusto", "Päästöluokka", paastoluokat)
  }]
}, {
  id: "kustannukset",
  nimi: "Kustannukset",
  charts: [{
    title: "Kustannukset vuosittain tarkasteltuna",
    yTitle: filter => "Kustannukset" + filterInfoText(filter) + ' € / vuosi',
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Kustannuslaji", kustannuslajit)],
    options: createMultiBarChart("Kustannukset", "Vuosi")
  }, {
    title: "Vuoden kustannukset kustannuslajeittain",
    yTitle: filter => "Kustannukset (€)" + filterInfoText(filter) + ' vuonna ' + filter.vuosi,
    groupBy: ["organisaatioid", "kustannuslajitunnus"],
    filters: [
      createFilter("Vuosi", vuodet, '2016')],
    options: createMultiBarChart("Kustannukset", "Kustannuslaji", kustannuslajit)
  }]
}, {
  id: "lippuhinnat",
  nimi: "Lippuhinnat",
  charts: [{
    title: "Lippuhinnat vuosittain tarkasteltuna",
    yTitle: filter => "Lippuhinta" + filterInfoText(filter),
    groupBy: ["organisaatioid", "vuosi"],
    filters: [
      createFilter("Lipputyyppi", lippuhintaluokat, 'KE'),
      createFilter("Vyöhykemäärä", vyohykemaarat, '1')],
    options: createMultiBarChart("Lippuhinnat", "Vuosi")
  }, {
    title: "Vuoden lippuhinnat vyöhykeittäin ja lipputyypeittäin",
    yTitle: filter => undefined,
    data: _.partial(convertToTree, "Lippuhinnat", [vyohykemaarat.$nimi, lippuhintaluokat.$nimi]),
    groupBy: ["organisaatioid", "vyohykemaara", "lippuhintaluokkatunnus"],
    filters: [createFilter("Vuosi", vuodet, '2016')],
    options: {
      chart: {
        type: 'sunburstChart',
        height: 450
        //mode: "size"
      }
    }
  }]
},
  createAlueTunnusluku('kuntamaara', 'Kuntamäärä', 'kuntien lukumäärä', 'Lukumäärä (kpl)'),
  createAlueTunnusluku('vyohykemaara', 'Vyöhykemäärä', 'vyöhykkeiden lukumäärä', 'Lukumäärä (kpl)'),
  createAlueTunnusluku('pysakkimaara', 'Pysäkkimäärä', 'pysäkkien lukumäärä', 'Lukumäärä (kpl)'),
  createAlueTunnusluku('maapintaala', 'Maapinta-ala', 'maapintaala', 'Neliökilometri (km2)'),
  createAlueTunnusluku('asukasmaara', 'Asukasmäärä', 'asukkaiden lukumäärä', 'Lukumäärä (kpl)'),
  createAlueTunnusluku('tyopaikkamaara', 'Työpaikkamäärä', 'työpaikkojen lukumäärä', 'Lukumäärä (kpl)'),
  createAlueTunnusluku('henkilosto', 'Henkilöstö', 'suunnittelun ja organisaation henkilöstö', 'Henkilötyövuotta'),
  createAlueTunnusluku('pendeloivienosuus', 'Pendelöivien osuus', 'pendelöivien osuus (oman kunnan ulkopuolella työssäkäynti)', 'Prosenttia työssäkäyvistä (%)'),
  createAlueTunnusluku('henkiloautoliikennesuorite', 'Henkilöautoliikennesuorite', 'henkilöautoliikennesuorite', 'km / vuosi'),
  createAlueTunnusluku('autoistumisaste', 'Autoistumisaste', 'autoistumisaste', 'Autoa (kpl) / 1000 asukasta'),
  createAlueTunnusluku('asiakastyytyvaisyys', 'Asiakastyytyväisyys', 'tyytyväisten joukkoliikenteen käyttäjien osuus', 'Prosenttia (%)')];

function convertToNvd3(data, organisaatiot) {
  return _.map(_.values(_.groupBy(_.tail(data), row => row[0])),
    rows => ({
      key: (_.find(organisaatiot, {id: rows[0][0]})).nimi,
      values: rows
    }));
}

function watchParamsAndRefresh($scope, $q, RaporttiService, OrganisaatioService) {
  var charts = $scope.tunnusluku.charts;
  var tunnusluku = $scope.tunnusluku;

  // init chart data and chart params
  $scope.data = new Array(charts.length);
  $scope.csv = new Array(charts.length);

  $scope.params.charts = new Array(charts.length);

  function listener(id, chart, organisaatiolaji, filters) {
    var ytitle = $scope.tunnusluku.charts[id].yTitle(filters);
    if (ytitle) {
      chart.options.subtitle.text = ytitle;
      chart.options.chart.yAxis.axisLabel = ytitle;
    }
    const conversion = c.coalesce(chart.data, convertToNvd3);

    $q.all([RaporttiService.haeTunnuslukuTilasto(tunnusluku.id, organisaatiolaji, filters, chart.groupBy),
        OrganisaatioService.hae()])
      .then(([data, organisaatiot])=> {

        $scope.csv[id] = data;
        if (chart.options.chart.type === 'sunburstChart') {
          $scope.params.charts[id].api.updateWithData(conversion(data, organisaatiot));
        } else {
          $scope.data[id] = conversion(data, organisaatiot);
        }
      });
  }

  _.forEach(charts, function (chart, id) {
    var defaultFilter = _.map(_.filter(chart.filters, f => c.isDefinedNotNull(f.defaultValue)), f => [f.id, f.defaultValue])
    $scope.params.charts[id] = {filter: c.coalesce(_.fromPairs(defaultFilter), {})};

    const filterPath = '[params.organisaatiolaji, params.charts[' + id + '].filter]';
    $scope.$watch(filterPath, ([organisaatiolaji, filter]) => listener(id, chart, organisaatiolaji, filter), true);

    /*$scope.$watch('params.organisaatiolaji',
     organisaatiolaji => listener(id, chart, organisaatiolaji, _.get($scope, filterPath)));*/
  });
}

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiOmakuvaajaCtrl',
    ['$scope', '$state', '$timeout', '$window', '$q', 'RaporttiService', 'OrganisaatioService',
      function ($scope, $state, $timeout, $window, $q, RaporttiService, OrganisaatioService) {

        $scope.params = {
          tunnuslukuid: $state.params.tunnuslukuid
        };

        $scope.$watch("params.tunnuslukuid", (id) => {
          $state.go($state.current.name, {tunnuslukuid: id});
        });

        $scope.tunnusluvut = tunnusluvut;
        $scope.tunnusluku = _.find(tunnusluvut, {id: $state.params.tunnuslukuid});

        $scope.organisaatiolajit = organisaatiolajit;

        $scope.params.organisaatiolaji = 'KS1';

        $scope.isTabSelected = function isTabSelected(tyyppi) {
          return $scope.params.organisaatiolaji === tyyppi;
        };

        $scope.toTab = function toTab(tyyppi) {
          $scope.params.organisaatiolaji = tyyppi;
        };

        if ($scope.tunnusluku) {
          watchParamsAndRefresh($scope, $q, RaporttiService, OrganisaatioService);
        }
        ;
      }]);
