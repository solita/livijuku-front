'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiOmakuvaajaCtrl', ['$scope', '$timeout', '$window', function ($scope, $timeout, $window) {

    $scope.omakuvaajaTyypit = {
      KS1: 'Suuret kaupunkiseudut',
      KS2: 'Keskisuuret kaupunkiseudut',
      KS3: 'Pienet kaupunkiseudut',
      ELY: 'ELY-keskukset'
    };

    const alinayttoluokat = {KK: "KK", KL: "KL"};

    const kuukaudet = ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
      "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];

    const kalustoluokat = ["EURO 0", "EURO 1", "EURO 2", "EURO 3", "EURO 4", "EURO 5/EEV", "EURO 6"];

    const viikonpaivaluokat = {A: "Arkipäivä", LA: 'Lauantai', SU: 'Sunnuntai'};

    $scope.$watch('fetching', function () {
      if (!$scope.fetching) {
        $timeout(function () {
          $window.dispatchEvent(new Event('resize'));
          $scope.fetching = true;
        }, 200);
      }
    });

    $scope.kuukausiNimi = function (kuukausi) {
      return kuukaudet[kuukausi - 1];
    };

    $scope.viikonpaivaluokkaNimi = function (tunnus) {
      return viikonpaivaluokat[tunnus];
    };

    $scope.tyypinNimi = function (tyyppi) {
      return $scope.omakuvaajaTyypit[tyyppi];
    };

    $scope.kalustoluokkaNimi = function (luokka) {
      return kalustoluokat[luokka];
    };

    $scope.hasKuukausitaso = function () {
      return $scope.tunnuslukuAlinaytto() === alinayttoluokat.KK;
    };

    $scope.hasKalustoluokkaTaso = function () {
      return $scope.tunnuslukuAlinaytto() === alinayttoluokat.KL;
    };

    $scope.tunnuslukuAliotsake = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).aliotsake;
    };

    $scope.tunnuslukuAlinaytto = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).alinaytto;
    };

    $scope.tunnuslukuAlinayttoOtsake = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).alinayttootsake;
    };

    $scope.tunnuslukuAlinayttoYksikkoY = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).alinayttoyksikkoY;
    };

    $scope.tunnuslukuAlinayttoYksikkoX = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).alinayttoyksikkoX;
    };

    $scope.tunnuslukuNimi = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).nimi;
    };

    $scope.tunnuslukuOtsake = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).otsake;
    };

    $scope.tunnuslukuYksikko = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).yksikko;
    };

    $scope.update = function () {
      $scope.tunnuslukugraafi.options.title.text = $scope.tunnuslukuOtsake();
      $scope.tunnuslukugraafi.options.subtitle.text = $scope.tunnuslukuAliotsake();
      $scope.tunnuslukugraafi.options.chart.yAxis.axisLabel = $scope.tunnuslukuYksikko();
      if ($scope.tunnuslukugraafi.api !== undefined) $scope.tunnuslukugraafi.api.refresh();
      $scope.updateVuosi();
    };

    $scope.updateVuosi = function () {
      $scope.tunnuslukuAligraafi.options.title.text = $scope.tunnuslukuAlinayttoOtsake();
      $scope.tunnuslukuAligraafi.options.subtitle.text = 'Vuosi ' + $scope.vuosi;
      $scope.tunnuslukuAligraafi.options.chart.yAxis.axisLabel = $scope.tunnuslukuAlinayttoYksikkoY();
      $scope.tunnuslukuAligraafi.options.chart.xAxis.axisLabel = $scope.tunnuslukuAlinayttoYksikkoX();
      if ($scope.tunnuslukuAligraafi.api !== undefined) $scope.tunnuslukuAligraafi.api.refresh();
      $scope.fetching = false;
    };

    $scope.vuodet = function () {
      if ($scope.tunnuslukuData === undefined) return;
      return _.keysIn(_.find($scope.tunnuslukuData, {'tyyppi': $scope.aktiivinenTyyppi}).tunnuslukuid);
    };

    $scope.tunnusluvut = [
      {
        "id": "1",
        "nimi": "Kysyntä -> Nousua/päivä keskiarvo arkipäivä (Talviliikenne)",
        "otsake": "Kysyntä",
        "aliotsake": "Nousua/päivä keskiarvo arkipäivä (Talviliikenne)",
        "yksikko": "nousua / päivä"
      },
      {
        "id": "2",
        "nimi": "Kysyntä -> Nousua/päivä keskiarvo lauantai (Talviliikenne)",
        "otsake": "Kysyntä",
        "aliotsake": "Nousua/päivä keskiarvo lauantai (Talviliikenne)",
        "yksikko": "nousua / päivä"
      },
      {
        "id": "3",
        "nimi": "Kysyntä -> Nousua/päivä keskiarvo sunnuntai (Talviliikenne)",
        "otsake": "Kysyntä",
        "aliotsake": "Nousua/päivä keskiarvo sunnuntai (Talviliikenne)",
        "yksikko": "nousua / päivä"
      },
      {
        "id": "4",
        "otsake": "Kysyntä",
        "aliotsake": "Linjakilometrit/päivä keskiarvo arkipäivä (Talviliikenne)",
        "nimi": "Kysyntä -> Linjakilometrit/päivä keskiarvo arkipäivä (Talviliikenne)",
        "yksikko": "linja-km / päivä"
      },
      {
        "id": "5",
        "otsake": "Kysyntä",
        "aliotsake": "Linjakilometrit/päivä keskiarvo lauantai (Talviliikenne)",
        "nimi": "Kysyntä -> Linjakilometrit/päivä keskiarvo lauantai (Talviliikenne)",
        "yksikko": "linja-km / päivä"
      },
      {
        "id": "6",
        "otsake": "Kysyntä",
        "aliotsake": "Linjakilometrit/päivä keskiarvo sunnuntai (Talviliikenne)",
        "nimi": "Kysyntä -> Linjakilometrit/päivä keskiarvo sunnuntai (Talviliikenne)",
        "yksikko": "linja-km / päivä"
      },
      {
        "id": "7",
        "otsake": "Tarjonta",
        "aliotsake": "Lähtöä/päivä keskiarvo arkipäivä (Talviliikenne)",
        "nimi": "Tarjonta -> Lähtöä/päivä keskiarvo arkipäivä (Talviliikenne)",
        "yksikko": "lähtöä / päivä"
      },
      {
        "id": "8",
        "otsake": "Tarjonta",
        "aliotsake": "Lähtöä/päivä keskiarvo lauantai (Talviliikenne)",
        "nimi": "Tarjonta -> Lähtöä/päivä keskiarvo lauantai (Talviliikenne)",
        "yksikko": "lähtöä / päivä"
      },
      {
        "id": "9",
        "otsake": "Tarjonta",
        "aliotsake": "Lähtöä/päivä keskiarvo sunnuntai (Talviliikenne)",
        "nimi": "Tarjonta -> Lähtöä/päivä keskiarvo sunnuntai (Talviliikenne)",
        "yksikko": "lähtöä / päivä"
      },
      {
        "id": "10",
        "otsake": "Kysyntä",
        "aliotsake": "Nousua/vuosi",
        "nimi": "Kysyntä -> Nousua/vuosi",
        "yksikko": "nousua / vuosi",
        "alinaytto": "KK",
        "alinayttootsake": "Nousua per kuukausi",
        "alinayttoyksikkoX": "Kuukausi",
        "alinayttoyksikkoY": "nousua / kuukausi"
      },
      {
        "id": "11",
        "otsake": "Kysyntä",
        "aliotsake": "Linjakilometrit/vuosi",
        "nimi": "Kysyntä -> Linjakilometrit/vuosi",
        "yksikko": "linja-km / vuosi",
        "alinaytto": "KK",
        "alinayttootsake": "Linjakilometrit per kuukausi",
        "alinayttoyksikkoX": "Kuukausi",
        "alinayttoyksikkoY": "linja-km / kuukausi"
      },
      {
        "id": "12",
        "otsake": "Tarjonta",
        "aliotsake": "Lähtöä/vuosi",
        "nimi": "Tarjonta -> Lähtöä/vuosi",
        "yksikko": "lähtöä / vuosi",
        "alinaytto": "KK",
        "alinayttootsake": "Lähtöä per kuukausi",
        "alinayttoyksikkoX": "Kuukausi",
        "alinayttoyksikkoY": "lähtöä / kuukausi"
      },
      {
        "id": "13",
        "otsake": "Liikenteen kalusto yhteensä",
        "aliotsake": "Liikennekokonaisuuteen sitoutuneen kaluston määrä",
        "nimi": "Liikenteen kalusto yhteensä",
        "yksikko": "linja-autoa",
        "alinaytto": "KL",
        "alinayttootsake": "Liikenteen kalusto päästöluokittain",
        "alinayttoyksikkoX": "Päästöluokka",
        "alinayttoyksikkoY": "linja-autoa"
      }
    ];
    $scope.tunnuslukuData = [
      {
        "tyyppi": "KS1",
        "organisaatiot": ["Oulu", "HSL", "Tampere", "Turku"],
        "tunnuslukuid": {
          "2010": [75.4, 77.0, 77.3, 80.1],
          "2011": [77.2, 80.3, 78.0, 82.4],
          "2012": [83.4, 88.3, 73.5, 86.3],
          "2013": [90.2, 85.6, 77.4, 71.4],
          "2014": [85.3, 91.2, 83.4, 78.3]
        }
      }, {
        "tyyppi": "KS2",
        "organisaatiot": ["Hämeenlinna", "Joensuu", "Jyväskylä", "Kotka", "Kouvola", "Kuopio", "Lahti", "Lappeenranta", "Pori", "Vaasa"],
        "tunnuslukuid": {
          "2010": [65.4, 76.3, 44.6, 76.2, 78.3, 55.3, 75.3, 89.4, 77.3, 73.6],
          "2011": [64.5, 77.2, 49.3, 79.1, 79.9, 62.7, 73.9, 82.5, 72.3, 74.2],
          "2012": [67.2, 79.1, 57.1, 73.7, 73.1, 67.3, 75.8, 87.3, 75.2, 76.7],
          "2013": [68.6, 87.5, 52.3, 79.2, 75.3, 62.1, 75.0, 83.4, 79.1, 74.6],
          "2014": [62.6, 86.5, 62.2, 84.7, 78.2, 69.5, 71.3, 86.3, 84.2, 77.9]
        }
      },
      {
        "tyyppi": "KS3",
        "organisaatiot": ["Kokkola", "Seinäjoki", "Imatra", "Kemi", "Rovaniemi", "Kajaani", "Mikkeli", "Savonlinna", "Hyvinkää", "Riihimäki", "Salo", "Rauma"],
        "tunnuslukuid": {
          "2010": [65.4, 76.3, 44.6, 76.2, 78.3, 55.3, 75.3, 89.4, 77.3, 73.6, 75, 75],
          "2011": [64.5, 77.2, 49.3, 79.1, 79.9, 62.7, 73.9, 82.5, 72.3, 74.2, 76, 76],
          "2012": [67.2, 79.1, 57.1, 73.7, 73.1, 67.3, 75.8, 87.3, 75.2, 76.7, 77, 77],
          "2013": [68.6, 87.5, 52.3, 79.2, 75.3, 62.1, 75.0, 83.4, 79.1, 74.6, 78, 78],
          "2014": [62.6, 86.5, 62.2, 84.7, 78.2, 69.5, 71.3, 86.3, 84.2, 77.9, 79, 79]
        }
      },
      {
        "tyyppi": "ELY",
        "organisaatiot": ["Pohjois-Pohjanmaan ELY", "Pohjois-Savon ELY", "Varsinais-Suomen ELY", "Uudenmaan ELY", "Etelä-Pohjanmaan ELY", "Kaakkois-Suomen ELY", "Keski-Suomen ELY", "Lapin ELY", "Pirkanmaan ELY"],
        "tunnuslukuid": {
          "2010": [56.3, 66.6, 62.3, 74.2, 79.4, 75.6, 76.3, 77.4, 80.2],
          "2011": [56.3, 65.9, 63.6, 77.3, 86.1, 79.1, 74.8, 71.4, 87.1],
          "2012": [52.8, 69.3, 67.2, 78.1, 81.2, 83.4, 78.2, 76.3, 88.8],
          "2013": [56.1, 74.1, 70.1, 79.9, 82.5, 86.3, 79.1, 79.2, 89.9],
          "2014": [57.6, 77.3, 74.3, 83.5, 87.2, 89.1, 83.4, 88.2, 84.2]
        }
      }
    ];

    $scope.tunnuslukugraafi = {};
    $scope.tunnuslukuAligraafi = {};
    $scope.aktiivinenTyyppi = 'KS1';
    $scope.aktiivinenOrganisaatio = _.find($scope.tunnuslukuData, {'tyyppi': $scope.aktiivinenTyyppi}).organisaatiot[0];
    $scope.aktiivinenOrganisaatioVuosi = 2010;

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $scope.aktiivinenTyyppi === tyyppi;
    };

    $scope.isEly = function isEly(tyyppi) {
      return tyyppi === 'ELY';
    };

    $scope.toTab = function toTab(tyyppi) {
      $scope.aktiivinenTyyppi = tyyppi;
      $scope.aktiivinenOrganisaatio = _.find($scope.tunnuslukuData, {'tyyppi': $scope.aktiivinenTyyppi}).organisaatiot[0];
      $scope.aktiivinenOrganisaatioVuosi = 2010;
      if ($scope.tunnuslukugraafi.api !== undefined) $scope.tunnuslukugraafi.api.refresh();
      if ($scope.tunnuslukuAligraafi.api !== undefined) $scope.tunnuslukuAligraafi.api.refresh();
    };

    $scope.exportCsvMultibar = function (data) {
      var tulos = [];
      for (var i in data) {
        var rivi = {};
        rivi['\ '] = data[i].key;
        for (var arvo in data[i].values) {
          rivi[' ' + data[i].values[arvo].x] = Math.round(data[i].values[arvo].y * 1000) / 1000;
        }
        tulos.push(rivi);
      }
      return tulos;
    };

    $scope.exportCsvPieChart = function (data) {
      var tulos = [];
      for (var i in data) {
        var rivi = {};
        rivi['\ '] = data[i].x;
        rivi[' €'] = data[i].y;
        tulos.push(rivi);
      }
      return tulos;
    };

    $scope.tunnuslukugraafi.options = {
      chart: {
        type: 'multiBarChart',
        height: 450,
        stacked: false,
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        showValues: false,
        valueFormat: function (d) {
          return d3.format('.02f')(d);
        },
        yAxis: {
          axisLabel: ''
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: ''
      },
      subtitle: {
        enable: true,
        text: ''
      }
    };

    $scope.tunnuslukugraafi.data = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.tunnuslukuData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(dataPerTyyppi, 'tunnuslukuid')) {
          vuosiValues.push({
            x: vuosi,
            y: Math.floor((Math.random() * 10) + 1) * 0.1 * _.result(dataPerTyyppi, 'tunnuslukuid')[vuosi][i]
          });
        }
        paluuArvot.push({
          key: _.result(dataPerTyyppi, 'organisaatiot')[i],
          values: vuosiValues
        });
      }
      return paluuArvot;
    };

    $scope.tunnuslukuAligraafi.options = {
      chart: {
        type: 'multiBarChart',
        height: 450,
        stacked: false,
        reduceXTicks: false,
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        showValues: false,
        valueFormat: function (d) {
          return d3.format('.02f')(d);
        },
        yAxis: {
          axisLabel: ''
        },
        xAxis: {
          axisLabel: ''
        }
      },
      title: {
        enable: true,
        text: ''
      },
      subtitle: {
        enable: true,
        text: ''
      }
    };

    $scope.tunnuslukuAligraafi.data = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.tunnuslukuData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var values = [];
        if ($scope.hasKuukausitaso()) {
          for (var k = 0; k < kuukaudet.length; k++) {
            values.push({
              x: $scope.kuukausiNimi(k + 1),
              y: Math.floor((Math.random() * 10) + 1) * 0.1 * 33
            });
          }
        }
        if ($scope.hasKalustoluokkaTaso()) {
          for (var k = 0; k < kalustoluokat.length; k++) {
            values.push({
              x: $scope.kalustoluokkaNimi(k),
              y: Math.floor((Math.random() * 10) + 1) * 0.1 * 33
            });
          }
        }

        paluuArvot.push({
          key: _.result(dataPerTyyppi, 'organisaatiot')[i],
          values: values
        });
      }
      return paluuArvot;
    };
  }]);
