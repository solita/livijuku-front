'use strict';

var _ = require('lodash');
var angular = require('angular');
var $ = require('jquery');

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiCtrl', ['$scope', function ($scope) {
    const data = {
      MYONNETTY: "myonnetyt",
      HAETTU: "haetut"
    };

    const tyypit = {
      KS1: 'Suuret kaupunkiseudut',
      KS2: 'Keskisuuret kaupunkiseudut',
      KS3: 'Pienet kaupunkiseudut',
      ELY: 'ELY-keskukset'
    };

    function aliotsake() {
      if ($scope.isMyonnettyAktiivinen()) return "Myönnetyt jaoteltuna";
      else return "Haetut jaoteltuna";
    }

    function tyypinNimi(tyyppi) {
      return tyypit[tyyppi];
    }

    $scope.avustusData = [
      {
        "tyyppi": "KS1",
        "organisaatiot": ["Oulu", "HSL", "Tampere", "Turku"],
        "organisaatiotAsukkaat": [150000, 1100000, 275000, 180000],
        "haetut": {
          "2010": [320500, 5213000, 998530, 831311],
          "2011": [790000, 6230000, 1990872, 989371],
          "2012": [988990, 5553495, 2265000, 1457016],
          "2013": [2653000, 8000000, 3355000, 3357290],
          "2014": [3649759, 8015000, 3430000, 4400000]
        },
        "myonnetyt": {
          "2010": [320500, 5213309, 998530, 831311],
          "2011": [790000, 6229319, 1990872, 989371],
          "2012": [913990, 5553495, 1751951, 1457016],
          "2013": [1314775, 5821548, 2538098, 2377717],
          "2014": [1751255, 6096802, 2805226, 2069717]
        },
        "tyytyvaisyys": {
          "2010": [75.4, 77.0, 77.3, 80.1],
          "2011": [77.2, 80.3, 78.0, 82.4],
          "2012": [83.4, 88.3, 73.5, 86.3],
          "2013": [90.2, 85.6, 77.4, 71.4],
          "2014": [85.3, 91.2, 83.4, 78.3]
        },
        "psa-matkustajat": {
          "2010": [1359492, 363542, 1990000, 1180000, 646800, 823313, 2187624, 700000, 1180419, 732526],
          "2011": [1477181, 437110, 1965000, 1111000, 966500, 1135340, 2389200, 754330, 1323489, 839377],
          "2012": [1592264, 540702, 1951500, 1174000, 1123441, 1059000, 2110350, 838045, 1375860, 914610],
          "2013": [1693099, 539238, 2041050, 977000, 982000, 1249100, 2679170, 662160, 1622061, 1031826],
          "2014": [1459000, 741300, 5059250, 1278000, 1069000, 1249100, 6775500, 1108829, 1439534, 1281000]
        },
        "siirtymaajan-matkustajat": {
          "2010": [320500, 5213309, 998530, 831311],
          "2011": [790000, 6229319, 1990872, 989371],
          "2012": [913990, 5553495, 1751951, 1457016],
          "2013": [1314775, 5821548, 2538098, 2377717],
          "2014": [1751255, 6096802, 2805226, 2069717]
        }
      }, {
        "tyyppi": "KS2",
        "organisaatiot": ["Hämeenlinna", "Joensuu", "Jyväskylä", "Kotka", "Kouvola", "Kuopio", "Lahti", "Lappeenranta", "Pori", "Vaasa"],
        "organisaatiotAsukkaat": [70000, 55000, 65000, 480000, 35000, 40000, 69000, 42000, 35000, 37000],
        "haetut": {
          "2010": [1359492, 363542, 1990000, 1180000, 646800, 823313, 2187624, 700000, 1180419, 732526],
          "2011": [1477181, 437110, 1965000, 1111000, 966500, 1135340, 2389200, 754330, 1323489, 839377],
          "2012": [1592264, 540702, 1951500, 1174000, 1123441, 1059000, 2110350, 838045, 1375860, 914610],
          "2013": [1693099, 539238, 2041050, 977000, 982000, 1249100, 2679170, 662160, 1622061, 1031826],
          "2014": [1459000, 741300, 5059250, 1278000, 1069000, 1249100, 6775500, 1108829, 1439534, 1281000]
        },
        "myonnetyt": {
          "2010": [838383, 338622, 1294000, 864739, 560004, 722005, 1009696, 479562, 959244, 490000],
          "2011": [951391, 377650, 1266067, 703223, 625653, 834432, 1074844, 567670, 960700, 482000],
          "2012": [1073901, 457208, 1115100, 702635, 500230, 1152741, 1228289, 558468, 997200, 350000],
          "2013": [985000, 515000, 1238000, 775000, 555000, 1249100, 1380000, 662160, 1162000, 395000],
          "2014": [985000, 515000, 1238000, 775000, 555000, 1249100, 1380000, 662160, 1162000, 395000]
        },
        "tyytyvaisyys": {
          "2010": [65.4, 76.3, 44.6, 76.2, 78.3, 55.3, 75.3, 89.4, 77.3, 73.6],
          "2011": [64.5, 77.2, 49.3, 79.1, 79.9, 62.7, 73.9, 82.5, 72.3, 74.2],
          "2012": [67.2, 79.1, 57.1, 73.7, 73.1, 67.3, 75.8, 87.3, 75.2, 76.7],
          "2013": [68.6, 87.5, 52.3, 79.2, 75.3, 62.1, 75.0, 83.4, 79.1, 74.6],
          "2014": [62.6, 86.5, 62.2, 84.7, 78.2, 69.5, 71.3, 86.3, 84.2, 77.9]
        },
        "psa-matkustajat": {
          "2010": [1359492, 363542, 1990000, 1180000, 646800, 823313, 2187624, 700000, 1180419, 732526],
          "2011": [1477181, 437110, 1965000, 1111000, 966500, 1135340, 2389200, 754330, 1323489, 839377],
          "2012": [1592264, 540702, 1951500, 1174000, 1123441, 1059000, 2110350, 838045, 1375860, 914610],
          "2013": [1693099, 539238, 2041050, 977000, 982000, 1249100, 2679170, 662160, 1622061, 1031826],
          "2014": [1459000, 741300, 5059250, 1278000, 1069000, 1249100, 6775500, 1108829, 1439534, 1281000]
        },
        "siirtymaajan-matkustajat": {
          "2010": [838383, 338622, 1294000, 864739, 560004, 722005, 1009696, 479562, 959244, 490000],
          "2011": [951391, 377650, 1266067, 703223, 625653, 834432, 1074844, 567670, 960700, 482000],
          "2012": [1073901, 457208, 1115100, 702635, 500230, 1152741, 1228289, 558468, 997200, 350000],
          "2013": [985000, 515000, 1238000, 775000, 555000, 1249100, 1380000, 662160, 1162000, 395000],
          "2014": [985000, 515000, 1238000, 775000, 555000, 1249100, 1380000, 662160, 1162000, 395000]
        }
      }, {
        "tyyppi": "ELY",
        "organisaatiot": ["Pohjois-Pohjanmaan ELY", "Pohjois-Savon ELY", "Varsinais-Suomen ELY", "Uudenmaan ELY", "Etelä-Pohjanmaan ELY", "Kaakkois-Suomen ELY", "Keski-Suomen ELY", "Lapin ELY", "Pirkanmaan ELY"],
        "organisaatiotAsukkaat": [120000, 100000, 150000, 320000, 1535000, 150000, 230000, 234666, 200000],
        "haetut": {
          "2010": [4726300, 8946000, 5044972, 5949922, 3589635, 3940058, 3425700, 3416000, 2988258],
          "2011": [6190000, 10225000, 5885000, 8301474, 4308816, 4419818, 4405000, 3980000, 4392405],
          "2012": [5740000, 9525222, 6900000, 11100000, 4340000, 5440000, 3960000, 3990000, 4120000],
          "2013": [6026000, 7826094, 6985000, 6461517, 4113803, 1450669, 2535000, 4165000, 3762000],
          "2014": [4983361, 6775000, 2980000, 9590919, 3664548, 1705803, 1764000, 3987000, 2415000]
        },
        "myonnetyt": {
          "2010": [4577000, 8653000, 4756000, 6272000, 3264000, 3539000, 3186000, 3284000, 3073000],
          "2011": [4423000, 8594000, 4802000, 6225000, 3579000, 3662000, 3183000, 3293000, 3036000],
          "2012": [4209000, 8250000, 4803000, 6303000, 3507000, 3457000, 3003000, 3324000, 3141000],
          "2013": [4100000, 6900000, 2800000, 4600000, 3450000, 1450000, 1900000, 3350000, 2200000],
          "2014": [3879000, 6695000, 2586000, 5095000, 3192000, 3065000, 1684000, 3138000, 1985000]
        },
        "tyytyvaisyys": {
          "2010": [56.3, 66.6, 62.3, 74.2, 79.4, 75.6, 76.3, 77.4, 80.2],
          "2011": [56.3, 65.9, 63.6, 77.3, 86.1, 79.1, 74.8, 71.4, 87.1],
          "2012": [52.8, 69.3, 67.2, 78.1, 81.2, 83.4, 78.2, 76.3, 88.8],
          "2013": [56.1, 74.1, 70.1, 79.9, 82.5, 86.3, 79.1, 79.2, 89.9],
          "2014": [57.6, 77.3, 74.3, 83.5, 87.2, 89.1, 83.4, 88.2, 84.2]
        },
        "psa-matkustajat": {
          "2010": [4726300, 8946000, 5044972, 5949922, 3589635, 3940058, 3425700, 3416000, 2988258],
          "2011": [6190000, 10225000, 5885000, 8301474, 4308816, 4419818, 4405000, 3980000, 4392405],
          "2012": [5740000, 9525222, 6900000, 11100000, 4340000, 5440000, 3960000, 3990000, 4120000],
          "2013": [6026000, 7826094, 6985000, 6461517, 4113803, 1450669, 2535000, 4165000, 3762000],
          "2014": [4983361, 6775000, 2980000, 9590919, 3664548, 1705803, 1764000, 3987000, 2415000]
        },
        "siirtymaajan-matkustajat": {
          "2010": [4577000, 8653000, 4756000, 6272000, 3264000, 3539000, 3186000, 3284000, 3073000],
          "2011": [4423000, 8594000, 4802000, 6225000, 3579000, 3662000, 3183000, 3293000, 3036000],
          "2012": [4209000, 8250000, 4803000, 6303000, 3507000, 3457000, 3003000, 3324000, 3141000],
          "2013": [4100000, 6900000, 2800000, 4600000, 3450000, 1450000, 1900000, 3350000, 2200000],
          "2014": [3879000, 6695000, 2586000, 5095000, 3192000, 3065000, 1684000, 3138000, 1985000]
        }
      }
    ];

    $scope.tyypit = _.pluck($scope.avustusData, 'tyyppi');
    $scope.aktiivinenTyyppi = $scope.tyypit[0];
    $scope.aktiivinenOsajoukko = data.MYONNETTY;
    $scope.aktiivinenOrganisaatio = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi}).organisaatiot[0];
    $scope.aktiivinenOrganisaatioVuosi = 2010;
    $scope.aktiivinenOrganisaatioVuosiHaettu = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi}).haetut["2010"][0];
    $scope.aktiivinenOrganisaatioAsukkaat = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi}).organisaatiotAsukkaat[0];

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $scope.aktiivinenTyyppi === tyyppi;
    };

    $scope.isEly = function isEly(tyyppi) {
      return tyyppi === 'ELY';
    };

    $scope.isMyonnettyAktiivinen = function () {
      return $scope.aktiivinenOsajoukko === data.MYONNETTY;
    };

    $scope.toTab = function toTab(tyyppi) {
      $scope.aktiivinenTyyppi = tyyppi;
      $scope.aktiivinenOrganisaatio = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi}).organisaatiot[0];
      $scope.aktiivinenOrganisaatioVuosi = 2010;
      $scope.aktiivinenOrganisaatioVuosiHaettu = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi}).haetut["2010"][0];
      $scope.aktiivinenOrganisaatioAsukkaat = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi}).organisaatiotAsukkaat[0];
      $scope.haettuMyonnettyYhteensaOptions.subtitle.text = tyypinNimi(tyyppi);
      $scope.haettuMyonnettyOptions.subtitle.text = tyypinNimi(tyyppi);
      $scope.myonnettyPerAsukasOptions.subtitle.text = tyypinNimi(tyyppi);
      $scope.tuotantokustannusOptions.subtitle.text = tyypinNimi(tyyppi);

      if ($scope.haettuMyonnettyYhteensaApi !== undefined) $scope.haettuMyonnettyYhteensaApi.refresh();
      if ($scope.haettuMyonnettyApi !== undefined) $scope.haettuMyonnettyApi.refresh();
      if ($scope.myonnettyPerAsukasApi !== undefined) $scope.myonnettyPerAsukasApi.refresh();
      if ($scope.tyytyvaisyysApi !== undefined) $scope.tyytyvaisyysApi.refresh();
      if ($scope.psaMatkustajatApi !== undefined) $scope.psaMatkustajatApi.refresh();
      if ($scope.siirtymaajanMatkustajatApi !== undefined) $scope.siirtymaajanMatkustajatApi.refresh();
      if ($scope.tuotantokustannusApi !== undefined) $scope.tuotantokustannusApi.refresh();
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

    $scope.haettuPerAsukas = function () {
      return $scope.aktiivinenOrganisaatioVuosiHaettu / $scope.aktiivinenOrganisaatioAsukkaat;
    };

    $scope.haettuMyonnettyYhteensaOptions = {
      chart: {
        multibar: {
          dispatch: {
            elementClick: function (e) {
              if ((e.data.series === 0) && $scope.isMyonnettyAktiivinen()) {
                $scope.aktiivinenOsajoukko = data.HAETTU;
                $scope.haettuMyonnettyOptions.title.text = "Haetut jaoteltuna";
                $scope.haettuMyonnettyApi.refresh();
                $scope.myonnettyPerAsukasApi.refresh();
              } else if ((e.data.series === 1) && !$scope.isMyonnettyAktiivinen()) {
                $scope.aktiivinenOsajoukko = data.MYONNETTY;
                $scope.haettuMyonnettyOptions.title.text = "Myönnetyt jaoteltuna";
                $scope.haettuMyonnettyApi.refresh();
                $scope.myonnettyPerAsukasApi.refresh();
              }
              $scope.$apply();
            }
          }
        },
        type: 'multiBarChart',
        height: 450,
        stacked: false,
        showControls: false,
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.format('.03f')(d / 1000000) + " M€";
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Joukkoliikenteen valtionavustushakemukset ja päätökset'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      }
    };

    $scope.haettuMyonnettyYhteensaData = function () {
      var haettu = [];
      var myonnetty = [];
      var dataPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var vuosi in _.result(dataPerTyyppi, 'haetut')) {
        haettu.push({x: vuosi, y: _.sum(_.result(dataPerTyyppi, data.HAETTU)[vuosi])});
      }
      for (var vuosi in _.result(dataPerTyyppi, 'myonnetyt')) {
        myonnetty.push({x: vuosi, y: _.sum(_.result(dataPerTyyppi, data.MYONNETTY)[vuosi])});
      }
      return [{
        key: 'Haettu',
        color: '#ffaa00',
        values: haettu
      },
        {
          color: '#00bb00',
          key: 'Myönnetty',
          values: myonnetty
        }];
    };

    $scope.haettuMyonnettyOptions = {
      chart: {
        multibar: {
          dispatch: {
            elementClick: function (e) {
              $scope.aktiivinenOrganisaatio = e.data.key;
              $scope.aktiivinenOrganisaatioVuosi = e.data.x;
              $scope.aktiivinenOrganisaatioVuosiHaettu = e.data.y;
              $scope.aktiivinenOrganisaatioAsukkaat = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi}).organisaatiotAsukkaat[0];
              $scope.$apply();
            }
          }
        },
        type: 'multiBarChart',
        height: 450,
        stacked: false,
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.format('.03f')(d / 1000000) + " M€";
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Myönnetyt jaoteltuna'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      }
    };

    $scope.myonnettyPerAsukasData = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(dataPerTyyppi, data.MYONNETTY)) {
          vuosiValues.push({
            x: vuosi,
            y: (_.result(dataPerTyyppi, data.MYONNETTY)[vuosi][i] / $scope.aktiivinenOrganisaatioAsukkaat)
          });
        }
        paluuArvot.push({
          key: _.result(dataPerTyyppi, 'organisaatiot')[i],
          values: vuosiValues
        });
      }
      return paluuArvot;
    };

    $scope.myonnettyPerAsukasOptions = {
      chart: {
        type: 'multiBarChart',
        height: 450,
        stacked: false,
        showControls: false,
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d3.format('.02f')(d) + " €";
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Myönnetty avustus / asukas'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      }
    };

    $scope.haettuMyonnettyData = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(dataPerTyyppi, $scope.aktiivinenOsajoukko)) {
          vuosiValues.push({
            x: vuosi,
            y: _.result(dataPerTyyppi, $scope.aktiivinenOsajoukko)[vuosi][i]
          });
        }
        paluuArvot.push({
          key: _.result(dataPerTyyppi, 'organisaatiot')[i],
          values: vuosiValues
        });
      }
      return paluuArvot;
    };

    $scope.tyytyvaisyysOptions = {
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
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d + " %";
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Tyytyväisyys joukkoliikenteeseen'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      }
    };

    $scope.tyytyvaisyysOptions2 = {
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
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d + " %";
          }
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

    $scope.MatkustajatOptions = {
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
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d;
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Matkustajamäärä - Yhteensä'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      }
    };

    $scope.tyytyvaisyysData = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(dataPerTyyppi, $scope.aktiivinenOsajoukko)) {
          vuosiValues.push({
            x: vuosi,
            y: _.result(dataPerTyyppi, 'tyytyvaisyys')[vuosi][i]
          });
        }
        paluuArvot.push({
          key: _.result(dataPerTyyppi, 'organisaatiot')[i],
          values: vuosiValues
        });
      }
      return paluuArvot;
    };

    $scope.tuotantokustannusOptions = {
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
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d;
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Tuotantokustannukset'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      },
      caption: {
      enable: true,
        text: 'Tuotantokustannus = (Liikennöintikorvaus - Lipputulot) / Linjakilometrit'
    }
    };

    $scope.tuotantokustannusData = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(dataPerTyyppi, $scope.aktiivinenOsajoukko)) {
          vuosiValues.push({
            x: vuosi,
            y: _.result(dataPerTyyppi, 'psa-matkustajat')[vuosi][i]
          });
        }
        paluuArvot.push({
          key: _.result(dataPerTyyppi, 'organisaatiot')[i],
          values: vuosiValues
        });
      }
      return paluuArvot;
    };

    $scope.psaMatkustajatOptions = {
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
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d;
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Matkustajamäärä - PSA liikenne'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      }
    };

    $scope.psaMatkustajatData = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(dataPerTyyppi, $scope.aktiivinenOsajoukko)) {
          vuosiValues.push({
            x: vuosi,
            y: _.result(dataPerTyyppi, 'psa-matkustajat')[vuosi][i]
          });
        }
        paluuArvot.push({
          key: _.result(dataPerTyyppi, 'organisaatiot')[i],
          values: vuosiValues
        });
      }
      return paluuArvot;
    };

    $scope.siirtymaajanMatkustajatOptions = {
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
        yAxis: {
          axisLabel: '',
          tickFormat: function (d) {
            return d;
          }
        },
        xAxis: {
          axisLabel: 'Vuosi'
        }
      },
      title: {
        enable: true,
        text: 'Matkustajamäärä - Siirtymäajan liikenne'
      },
      subtitle: {
        enable: true,
        text: 'Suuret kaupunkiseudut'
      }
    };

    $scope.siirtymaajanMatkustajatData = function () {
      var paluuArvot = [];
      var dataPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(dataPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(dataPerTyyppi, $scope.aktiivinenOsajoukko)) {
          vuosiValues.push({
            x: vuosi,
            y: _.result(dataPerTyyppi, 'siirtymaajan-matkustajat')[vuosi][i]
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

