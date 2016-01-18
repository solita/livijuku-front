'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiOmakuvaajaCtrl', ['$scope', function ($scope) {

    $scope.omakuvaajaTyypit = {
      KS1: 'Suuret kaupunkiseudut',
      KS2: 'Keskisuuret kaupunkiseudut',
      KS3: 'Pienet kaupunkiseudut',
      ELY: 'ELY-keskukset'
    };

    $scope.tyypinNimi = function (tyyppi) {
      return $scope.omakuvaajaTyypit[tyyppi];
    };

    $scope.tunnuslukuNimi = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).nimi;
    };

    $scope.tunnuslukuTitle = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).title;
    };

    $scope.tunnuslukuSubtitle = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).subtitle;
    };

    $scope.update = function () {
      $scope.tunnuslukugraafi.options.title.text = $scope.tunnuslukuTitle();
      $scope.tunnuslukugraafi.options.subtitle.text = $scope.tunnuslukuSubtitle();
      $scope.tunnuslukugraafi.options.chart.yAxis.axisLabel = $scope.tunnuslukuYksikko();
      if ($scope.tunnuslukugraafi.api !== undefined) $scope.tunnuslukugraafi.api.refresh();
    };

    $scope.tunnuslukuYksikko = function () {
      if ($scope.tunnusluvut === undefined || $scope.tunnuslukuId === undefined) return;
      return ( _.find($scope.tunnusluvut, {"id": $scope.tunnuslukuId})).yksikko;
    };

    $scope.tunnusluvut = [
      {
        "id": "1",
        "nimi": "Kysyntä -> Nousua/päivä keskiarvo arkipäivä (Talviliikenne)",
        "title": "Kysyntä",
        "subtitle": "Nousua/päivä keskiarvo arkipäivä (Talviliikenne)",
        "yksikko": "nousua / päivä"
      },
      {
        "id": "2",
        "nimi": "Kysyntä -> Nousua/päivä keskiarvo lauantai (Talviliikenne)",
        "title": "Kysyntä",
        "subtitle": "Nousua/päivä keskiarvo lauantai (Talviliikenne)",
        "yksikko": "nousua / päivä"
      },
      {
        "id": "3",
        "nimi": "Kysyntä -> Nousua/päivä keskiarvo sunnuntai (Talviliikenne)",
        "title": "Kysyntä",
        "subtitle": "Nousua/päivä keskiarvo sunnuntai (Talviliikenne)",
        "yksikko": "nousua / päivä"
      },
      {
        "id": "4",
        "title": "Kysyntä",
        "subtitle": "Linjakilometrit/päivä keskiarvo arkipäivä (Talviliikenne)",
        "nimi": "Kysyntä -> Linjakilometrit/päivä keskiarvo arkipäivä (Talviliikenne)",
        "yksikko": "linja-km / päivä"
      },
      {
        "id": "5",
        "title": "Kysyntä",
        "subtitle": "Linjakilometrit/päivä keskiarvo lauantai (Talviliikenne)",
        "nimi": "Kysyntä -> Linjakilometrit/päivä keskiarvo lauantai (Talviliikenne)",
        "yksikko": "linja-km / päivä"
      },
      {
        "id": "6",
        "title": "Kysyntä",
        "subtitle": "Linjakilometrit/päivä keskiarvo sunnuntai (Talviliikenne)",
        "nimi": "Kysyntä -> Linjakilometrit/päivä keskiarvo sunnuntai (Talviliikenne)",
        "yksikko": "linja-km / päivä"
      },
      {
        "id": "7",
        "title": "Tarjonta",
        "subtitle": "Lähtöä/päivä keskiarvo arkipäivä (Talviliikenne)",
        "nimi": "Tarjonta -> Lähtöä/päivä keskiarvo arkipäivä (Talviliikenne)",
        "yksikko": "lähtöä / päivä"
      },
      {
        "id": "8",
        "title": "Tarjonta",
        "subtitle": "Lähtöä/päivä keskiarvo lauantai (Talviliikenne)",
        "nimi": "Tarjonta -> Lähtöä/päivä keskiarvo lauantai (Talviliikenne)",
        "yksikko": "lähtöä / päivä"
      },
      {
        "id": "9",
        "title": "Tarjonta",
        "subtitle": "Lähtöä/päivä keskiarvo sunnuntai (Talviliikenne)",
        "nimi": "Tarjonta -> Lähtöä/päivä keskiarvo sunnuntai (Talviliikenne)",
        "yksikko": "lähtöä / päivä"
      },
      {
        "id": "10",
        "title": "Kysyntä",
        "subtitle": "Nousua/vuosi",
        "nimi": "Kysyntä -> Nousua/vuosi",
        "yksikko": "nousua / vuosi"
      },
      {
        "id": "11",
        "title": "Kysyntä",
        "subtitle": "Linjakilometrit/vuosi",
        "nimi": "Kysyntä -> Linjakilometrit/vuosi",
        "yksikko": "linja-km / vuosi"
      },
      {
        "id": "12",
        "title": "Tarjonta",
        "subtitle": "Lähtöä/vuosi",
        "nimi": "Tarjonta -> Lähtöä/vuosi",
        "yksikko": "lähtöä / vuosi"
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
  }]);
