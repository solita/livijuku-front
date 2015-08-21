'use strict';

var angular = require('angular');
var _ = require('lodash');
var pdf = require('utils/pdfurl');

angular.module('jukufrontApp')
  .controller('ElyHakemusCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'HakemusService', 'PaatosService', 'StatusService', '$window', 'uiGridConstants', '$q',
    function ($rootScope, $scope, $state, $stateParams, HakemusService, PaatosService, StatusService, $window, uiGridConstants, $q) {
      function haeHakemukset() {
        HakemusService.hae($scope.hakemusid)
          .then(function (data) {
            $scope.hakemus = data;
            $scope.hakija = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).nimi;
            $scope.pankkitilinumero = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).pankkitilinumero;
          })
          .catch(function (data) {
            StatusService.virhe('HakemusService.hae(' + $scope.hakemusid + ')', data.message);
          });
      }

      function haePaatos() {
        PaatosService.hae($scope.hakemusid)
          .then(function (data) {
            $scope.paatos = data;
          })
          .catch(function (data) {
            StatusService.virhe('PaatosService.hae(' + $scope.hakemusid + ')', data.message);
          });
      }

      $scope.hakemusid = parseInt($stateParams.id);
      $scope.vuosi = $stateParams.vuosi;


      $scope.ely_maaratarpeet = {
        enableCellEditOnFocus: true,
        minRowsToShow: 11,
        columnDefs: [
          {
            name: 'maaratarpeet',
            displayName: 'maaratarpeet',
            cellTemplate: '<div class="grid-tooltip" tooltip="{{ row.entity.tooltip }}" tooltip-placement="top" tooltip-append-to-body="true"><div class="ui-grid-cell-contents" >{{ COL_FIELD }} <span class="glyphicon glyphicon-question-sign"></span></div>',
            footerCellTemplate: '<div class="ui-grid-cell-contents">Yhteensä</div>',
            enableCellEdit: false,
            width: '30%'
          },
          {
            name: 'euros',
            displayName: '€ (' + $scope.vuosi + ')',
            enableCellEdit: true,
            type: 'number',
            cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.getCellValue(row, col) | currency}}</div>',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            aggregationHideLabel: true,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
            width: '15%'
          },
          {
            name: 'kommentit', displayName: 'kommentit', width: '55%',
     /*       cellTemplate: '<div class="ui-grid-cell-contents" style="white-space: normal">{{COL_FIELD CUSTOM_FILTERS}}</div>', */
            editableCellTemplate: '<textarea style="width:100%" ng-class="\'colt\' + col.index" ng-input="MODEL_COL_FIELD" ng-model="MODEL_COL_FIELD"></textarea>',
            footerCellTemplate: '<div class="ui-grid-cell-contents">Menot yhteensä (tulot vähennettynä)</div>'
          }
        ],
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        showColumnFooter: true,
        rowHeight: 65
      };

      $scope.ely_kehittamishankkeet = {
        enableCellEditOnFocus: true,
        minRowsToShow: 10,
        headerRowHeight: 50,
        columnDefs: [
          {
            name: 'kehittamishanke',
            displayName: 'Kehittämishankkeiden (jatkuvat / uudet) erittely hankkeittain',
            footerCellTemplate: '<div class="ui-grid-cell-contents">Kehittämishankkeet yhteensä</div>',

            enableCellEdit: false,
            width: '30%'
          },
          {
            name: 'euros',
            displayName: '€ (' + $scope.vuosi + ')',
            enableCellEdit: true,
            type: 'number',
            cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.getCellValue(row, col) | currency}}</div>',
            aggregationType: uiGridConstants.aggregationTypes.sum,
            aggregationHideLabel: true,
            footerCellTemplate: '<div class="ui-grid-cell-contents" >{{col.getAggregationValue() | currency}}</div>',
            width: '15%'
          },
          {
            name: 'nimi',
            displayName: 'Kehityshankkeen nimi, hankkeen ajanjakso (vuodet eli onko hanke jatkuva vai uusi), lyhyt perustelu hankkeelle',
            enableCellEdit: true,
            cellTemplate: '<div class="ui-grid-cell-contents" style="white-space: normal">{{COL_FIELD CUSTOM_FILTERS}}</div>',
            footerCellTemplate: '<div class="ui-grid-cell-contents">Hankkeet yhteensä</div>',
            width: '55%'
          }
        ],
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        showColumnFooter: true,
        rowHeight: 65
      };

      $scope.ely_maaratarpeet.data = [
        {
          "id":0,
          "maaratarpeet": "Siirtymäajan sopimukset",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Siirtymäajan sopimusten määrärahatarve"
        }, {
          "id":1,
          "maaratarpeet": "Bruttosopimukset, sidotut kustannukset",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Voimassa olevat bruttosopimukset, joiden kustannukset on jo sidottu vuodelle 2015"
        }, {
          "id":2,
          "maaratarpeet": "Bruttosopimukset, uudet",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Uudet bruttosopimukset vuodelle 2015, kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta"
        }, {
          "id":3,
          "maaratarpeet": "Bruttosopimusten tulot",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Bruttosopimusten tulot"
        }, {
          "id":4,
          "maaratarpeet": "Käyttösopimuskorvaukset (alueellinen), sidotut",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Voimassa olevat käyttösopimuskorvaukset (alueellinen), joiden kustannukset on jo sidottu vuodelle 2015"
        }, {
          "id":5,
          "maaratarpeet": "Käyttösopimuskorvaukset (alueellinen), uudet",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Uudet käyttösopimuskorvaukset (alueellinen) vuodelle 2015, kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta"
        }, {
          "id":6,
          "maaratarpeet": "Käyttösopimuskorvaukset (alueellinen), tulot",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Käyttösopimuskorvausten (alueellinen) tulot"
        }, {
          "id":7,
          "maaratarpeet": "Käyttösopimuskorvaukset (reitti), sidotut",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Voimassa olevat käyttösopimuskorvaukset (reitti), joiden kustannukset on jo sidottu vuodelle 2015"
        }, {
          "id":8,
          "maaratarpeet": "Käyttösopimuskorvaukset (reitti), uudet",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Uudet käyttösopimuskorvaukset (reitti) vuodelle 2015, kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta"
        }, {
          "id":9,
          "maaratarpeet": "Käyttösopimuskorvaukset (reitti), tulot",
          "euros": 0,
          "kommentit": "",
          "tooltip": "Käyttösopimuskorvausten (reitti) tulot"
        }, {
          "id":10,
          "maaratarpeet": "Joukkoliikennetuki kunnille",
          "euros": 0,
          "kommentit": "",
          "tooltip": "ELYn kunnille myöntämä joukkoliikennetuki"
        }
      ];

      $scope.ely_kehittamishankkeet.data = [
        {
          "id":0,
          "kehittamishanke": "kehittamishanke 1",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":1,
          "kehittamishanke": "kehittamishanke 2",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":2,
          "kehittamishanke": "kehittamishanke 3",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":3,
          "kehittamishanke": "kehittamishanke 4",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":4,
          "kehittamishanke": "kehittamishanke 5",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":5,
          "kehittamishanke": "kehittamishanke 6",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":6,
          "kehittamishanke": "kehittamishanke 7",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":7,
          "kehittamishanke": "kehittamishanke 8",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":8,
          "kehittamishanke": "kehittamishanke 9",
          "euros": 0,
          "nimi": ""
        },
        {
          "id":9,
          "kehittamishanke": "kehittamishanke 10",
          "euros": 0,
          "nimi": ""
        }
      ];

      $scope.ely_maaratarpeet.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.ely_maaratarpeet_grid1Api = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
          console.log('rowentity:', rowEntity);
          $scope.$apply();
        });
      };

      $scope.ely_kehittamishankkeet.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.ely_kehittamishankkeet_grid1Api = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
          console.log('rowentity:', rowEntity);
          $scope.$apply();
        });
      };

      haeHakemukset();
      haePaatos();
      $window.scrollTo(0, 0);
    }
  ]);
