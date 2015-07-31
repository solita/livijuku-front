'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('jukufrontApp')
  .controller('HakijaTunnusluvutCtrl', ['$scope', 'uiGridConstants', '$q', function ($scope, uiGridConstants, $q) {
    $scope.lks_grid1 = {
      enableCellEditOnFocus: true,
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
      enableCellEditOnFocus: true,
      minRowsToShow: 12,
      columnDefs: [
        {
          name: 'Kuukausi',
          displayName: 'Kuukausi',
          enableCellEdit: false,
          footerCellTemplate: '<div class="ui-grid-cell-contents" style="text-align:right;">yht.</div>',
          width: '60%'
        },
        {
          name: 'Nousua/kk',
          displayName: 'Nousua/kk',
          enableCellEdit: true,
          type: 'number',
          aggregationType: uiGridConstants.aggregationTypes.sum,
          aggregationHideLabel: true,
          width: '15%'
        },
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

    $scope.lks_grid3 = {
      enableCellEditOnFocus: true,
      minRowsToShow: 5,
      columnDefs: [
        {name: 'Bruttoliikenteen tarjouskilpailut', displayName: 'Bruttoliikenteen tarjouskilpailut', enableCellEdit: true, width: '40%'},
        {name: 'Saatujen tarjousten määrä', displayName: 'Saatujen tarjousten määrä', enableCellEdit: true, type: 'number', width: '10%'},
        {name: 'Voittaneen tarjouksen hinta', displayName: 'Voittaneen tarjouksen hinta', enableCellEdit: true, type: 'number', width: '10%'},
        {name: 'Toiseksi tulleen tarjouksen hinta', displayName: 'Toiseksi tulleen tarjouksen hinta', enableCellEdit: true, type: 'number', width: '10%'},
        {name: 'Vapaat kommentit', displayName: 'Vapaat kommentit', enableCellEdit: true, width: '30%'}
      ],
      enableVerticalScrollbar: uiGridConstants.scrollbars.ALWAYS,
      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER
    };

    $scope.lks_grid3.data = [
      {
        "Bruttoliikenteen tarjouskilpailut": "Kohde1",
        "Saatujen tarjousten määrä": 0,
        "Voittaneen tarjouksen hinta": 0,
        "Toiseksi tulleen tarjouksen hinta": 0,
        "Vapaat kommentit": ""
      }
      ];

    $scope.saveRow_grid1 = function (rowEntity) {
      console.log('Saving row:', rowEntity);
      //create a fake promise - normally you'd use the promise returned by $http or $resource
      var promise = $q.defer();
      $scope.lks_grid1Api.rowEdit.setSavePromise(rowEntity, promise.promise);

      promise.resolve();
    };

    $scope.saveRow_grid2 = function (rowEntity) {
      console.log('Saving row:', rowEntity);
      //create a fake promise - normally you'd use the promise returned by $http or $resource
      var promise = $q.defer();
      $scope.lks_grid2Api.rowEdit.setSavePromise(rowEntity, promise.promise);

      promise.resolve();
    };

    $scope.saveRow_grid3 = function (rowEntity) {
      console.log('Saving row:', rowEntity);
      //create a fake promise - normally you'd use the promise returned by $http or $resource
      var promise = $q.defer();
      $scope.lks_grid3Api.rowEdit.setSavePromise(rowEntity, promise.promise);

      promise.resolve();
    };

    $scope.lks_grid1.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.lks_grid1Api = gridApi;
      gridApi.rowEdit.on.saveRow($scope, $scope.saveRow_grid1);
    };

    $scope.lks_grid2.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.lks_grid2Api = gridApi;
      gridApi.rowEdit.on.saveRow($scope, $scope.saveRow_grid2);
    };

    $scope.lks_grid3.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.lks_grid3Api = gridApi;
      gridApi.rowEdit.on.saveRow($scope, $scope.saveRow_grid3);
    };

    $scope.uusiRivi = function() {
      $scope.lks_grid3.data.unshift({});
    };
  }]);
