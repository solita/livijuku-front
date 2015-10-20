'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('TunnuslukuraporttiCtrl', ['$scope', function ($scope) {
    $scope.avustusData = [
      {
        "tyyppi": "KS1",
        "organisaatiot": ["Oulu", "HSL", "Tampere", "Turku"],
        "haetutarvot": {
          "2010": [320500, 5213000, 998530, 831311],
          "2011": [790000, 6230000, 1990872, 989371],
          "2012": [988990, 5553495, 2265000, 1457016],
          "2013": [2653000, 8000000, 3355000, 3357290],
          "2014": [3649759, 8015000, 3430000, 4400000]
        },
        "myonnetytarvot": {
          "2010": [320500, 5213309, 998530, 831311],
          "2011": [790000, 6229319, 1990872, 989371],
          "2012": [913990, 5553495, 1751951, 1457016],
          "2013": [1314775, 5821548, 2538098, 2377717],
          "2014": [1751255, 6096802, 2805226, 2069717]
        }
      }, {
        "tyyppi": "KS2",
        "organisaatiot": ["Hämeenlinna", "Joensuu", "Jyväskylä", "Kotka", "Kouvola", "Kuopio", "Lahti", "Lappeenranta", "Pori", "Vaasa"],
        "haetutarvot": {
          "2010": [1359492, 363542, 1990000, 1180000, 646800, 823313, 2187624, 700000, 1180419, 732526],
          "2011": [1477181, 437110, 1965000, 1111000, 966500, 1135340, 2389200, 754330, 1323489, 839377],
          "2012": [1592264, 540702, 1951500, 1174000, 1123441, 1059000, 2110350, 838045, 1375860, 914610],
          "2013": [1693099, 539238, 2041050, 977000, 982000, 1249100, 2679170, 662160, 1622061, 1031826],
          "2014": [1459000, 741300, 5059250, 1278000, 1069000, 1249100, 6775500, 1108829, 1439534, 1281000]
        },
        "myonnetytarvot": {
          "2010": [838383, 338622, 1294000, 864739, 560004, 722005, 1009696, 479562, 959244, 490000],
          "2011": [951391, 377650, 1266067, 703223, 625653, 834432, 1074844, 567670, 960700, 482000],
          "2012": [1073901, 457208, 1115100, 702635, 500230, 1152741, 1228289, 558468, 997200, 350000],
          "2013": [985000, 515000, 1238000, 775000, 555000, 1249100, 1380000, 662160, 1162000, 395000],
          "2014": [985000, 515000, 1238000, 775000, 555000, 1249100, 1380000, 662160, 1162000, 395000]
        }
      }, {
        "tyyppi": "ELY",
        "organisaatiot": ["Pohjois-Pohjanmaan ELY", "Pohjois-Savon ELY", "Varsinais-Suomen ELY", "Uudenmaan ELY", "Etelä-Pohjanmaan ELY", "Kaakkois-Suomen ELY", "Keski-Suomen ELY", "Lapin ELY", "Pirkanmaan ELY"],
        "haetutarvot": {
          "2010": [4726300, 8946000, 5044972, 5949922, 3589635, 3940058, 3425700, 3416000, 2988258],
          "2011": [6190000, 10225000, 5885000, 8301474, 4308816, 4419818, 4405000, 3980000, 4392405],
          "2012": [5740000, 9525222, 6900000, 11100000, 4340000, 5440000, 3960000, 3990000, 4120000],
          "2013": [6026000, 7826094, 6985000, 6461517, 4113803, 1450669, 2535000, 4165000, 3762000],
          "2014": [4983361, 6775000, 2980000, 9590919, 3664548, 1705803, 1764000, 3987000, 2415000]
        },
        "myonnetytarvot": {
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
    $scope.aktiivinenOsajoukko = 'myonnetytarvot';

    $scope.isTabSelected = function isTabSelected(tyyppi) {
      return $scope.aktiivinenTyyppi === tyyppi;
    };

    $scope.toTab = function toTab(tyyppi) {
      $scope.aktiivinenTyyppi = tyyppi;
      $scope.haettuMyonnettyYhteensaApi.refresh();
      $scope.haettuMyonnettyApi.refresh();
    };

    $scope.haettuMyonnettyYhteensaOptions = {
      chart: {
        multibar: {
          dispatch: {
            elementClick: function (e) {
              console.log('element: ' + e.value);
              console.dir(e.point);
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
          tickFormat: function (d) {
            return d3.format('.03f')(d / 1000000) + " M€";
          }
        }
      }
    };

    $scope.haettuMyonnettyYhteensaArvot = function () {
      var haettu = [];
      var myonnetty = [];
      var arvotPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var vuosi in _.result(arvotPerTyyppi, 'haetutarvot')) {
        haettu.push({x: vuosi, y: _.sum(_.result(arvotPerTyyppi, 'haetutarvot')[vuosi])});
      }
      for (var vuosi in _.result(arvotPerTyyppi, 'myonnetytarvot')) {
        myonnetty.push({x: vuosi, y: _.sum(_.result(arvotPerTyyppi, 'myonnetytarvot')[vuosi])});
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
              console.log('element: ' + e.value);
              console.dir(e.point);
            }
          }
        },
        type: 'multiBarChart',
        height: 450,
        stacked: true,
        x: function (d) {
          return d.x;
        },
        y: function (d) {
          return d.y;
        },
        yAxis: {
          tickFormat: function (d) {
            return d3.format('.03f')(d / 1000000) + " M€";
          }
        }
      }
    };

    $scope.haettuMyonnettyArvot = function () {
      var paluuArvot = [];
      var arvotPerTyyppi = _.find($scope.avustusData, {'tyyppi': $scope.aktiivinenTyyppi});
      for (var i = 0; i < _.result(arvotPerTyyppi, 'organisaatiot').length; i++) {
        var vuosiValues = [];
        for (var vuosi in _.result(arvotPerTyyppi, $scope.aktiivinenOsajoukko)) {
          vuosiValues.push({
            x: vuosi,
            y: _.result(arvotPerTyyppi, $scope.aktiivinenOsajoukko)[vuosi][i]
          });
        }
        paluuArvot.push({
          key: _.result(arvotPerTyyppi, 'organisaatiot')[i],
          values: vuosiValues
        });
      }
      return paluuArvot;
    };


    $scope.nvd3options2 = {
      chart: {
        multibar: {
          dispatch: {
            elementClick: function (e) {
              console.log('element: ' + e.value);
              console.dir(e.point);
            }
          }
        },
        type: 'multiBarChart',
        height: 450,
        x: function (d) {
          return d[0];
        },
        y: function (d) {
          return d[1];
        },
        stacked: true,
        yAxis: {
          tickFormat: function (d) {
            return d3.format('.02f')(d / 1000000) + " M€";
          }
        }
      }
    };

    $scope.nvd3data2 = [
      {
        "key": "Pohjois-Pohjanmaan ELY",
        "values": [[2010, 4726300], [2011, 6190000], [2012, 5740000], [2013, 6026000], [2014, 4983361]]
      }, {
        "key": "Pohjois-Savon ELY",
        "values": [[2010, 8946000], [2011, 10225000], [2012, 9525222], [2013, 7826094], [2014, 6775000]]
      }, {
        "key": "Varsinais-Suomen ELY",
        "values": [[2010, 5044972], [2011, 5885000], [2012, 6900000], [2013, 6985000], [2014, 2980000]]
      }, {
        "key": "Uudenmaan ELY",
        "values": [[2010, 5949922], [2011, 8301474], [2012, 11100000], [2013, 6461517], [2014, 9590919]]
      }, {
        "key": "Etelä-Pohjanmaan ELY",
        "values": [[2010, 3589635], [2011, 4308816], [2012, 4340000], [2013, 4113803], [2014, 3664548]]
      }, {
        "key": "Kaakkois-Suomen ELY",
        "values": [[2010, 3940058], [2011, 4419818], [2012, 5440000], [2013, 1450669], [2014, 1705803]]
      }, {
        "key": "Keski-Suomen ELY",
        "values": [[2010, 3425700], [2011, 4405000], [2012, 3960000], [2013, 2535000], [2014, 1764000]]
      }, {
        "key": "Lapin ELY",
        "values": [[2010, 3416000], [2011, 3980000], [2012, 3990000], [2013, 4165000], [2014, 3987000]]
      }, {
        "key": "Pirkanmaan ELY",
        "values": [[2010, 2988258], [2011, 4392405], [2012, 4120000], [2013, 3762000], [2014, 2415000]]
      }];
  }
  ])
;
