'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('HakijaTunnusluvutCtrl', ['$scope', 'uiGridConstants', function ($scope, uiGridConstants) {
    $scope.lks_grid1 = {
      minRowsToShow: 3,
      columnDefs: [
        {name: 'Selite', displayName: 'Selite', enableCellEdit: false, width: '60%'},
        {name: 'Nousua/päivä', displayName: 'Nousua/päivä', enableCellEdit: true, type: 'number', width: '15%'},
        {name: 'Vapaat kommentit', displayName: 'Vapaat kommentit', enableCellEdit: true, width: '25%'}
      ],
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER
    };

    $scope.lks_grid1.data = [
      {
        "Selite": "Arkipäivän keskimääräinen nousumäärä (syyskuu-toukokuu arkipäivien keskiarvo)",
        "Nousua/päivä": 0,
        "Vapaat kommentit": ""
      },
      {
        "Selite": "Lauantain keskimääräinen nousumäärä (syyskuu-toukokuu lauantaiden keskiarvo))",
        "Nousua/päivä": 0,
        "Vapaat kommentit": ""
      },
      {
        "Selite": "Sunnuntain keskimääräinen nousumäärä (syyskuu-toukokuu sunnuntaiden keskiarvo)",
        "Nousua/päivä": 0,
        "Vapaat kommentit": ""
      }
    ];

    $scope.lks_grid2 = {
      minRowsToShow: 12,
      columnDefs: [
        {name: 'Kuukausi', displayName: 'Kuukausi', enableCellEdit: false, width: '60%'},
        {name: 'Nousua/kk', displayName: 'Nousua/kk', enableCellEdit: true, type: 'number', width: '15%'},
        {name: 'Vapaat kommentit', displayName: 'Vapaat kommentit', enableCellEdit: true, width: '25%'}
      ],
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      showColumnFooter: true
    };

    $scope.lks_grid2.data = [
      {
        "Kuukausi": "Tammikuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Helmikuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Maaliskuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Huhtikuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Toukokuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Kesäkuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Heinäkuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Elokuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Syyskuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Lokakuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Marraskuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      },
      {
        "Kuukausi": "Joulukuu",
        "Nousua/kk": 0,
        "Vapaat kommentit": ""
      }
    ];
  }]);
