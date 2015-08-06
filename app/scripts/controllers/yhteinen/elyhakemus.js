'use strict';

var angular = require('angular');
var _ = require('lodash');
var pdf = require('utils/pdfurl');

angular.module('jukufrontApp')
  .controller('ElyHakemusCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'HakemusService', 'PaatosService', 'StatusService', '$window', 'uiGridConstants', '$q',
    function ($rootScope, $scope, $state, $stateParams, HakemusService, PaatosService, StatusService, $window, uiGridConstants, $q) {
      function haeHakemukset() {
        HakemusService.hae($scope.hakemusid)
          .success(function (data) {
            $scope.hakemus = data;
            $scope.hakija = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).nimi;
            $scope.pankkitilinumero = _.find($rootScope.organisaatiot, {'id': data.organisaatioid}).pankkitilinumero;
          })
          .error(function (data) {
            StatusService.virhe('HakemusService.hae(' + $scope.hakemusid + ')', data.message);
          });
      }

      function haePaatos() {
        PaatosService.hae($scope.hakemusid)
          .success(function (data) {
            $scope.paatos = data;
          })
          .error(function (data) {
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
            name: 'Määrätarpeet',
            displayName: 'Määrätarpeet',
            cellTemplate: '<div class="grid-tooltip" tooltip="{{ row.entity.Tooltip }}" tooltip-placement="top" tooltip-append-to-body="true"><div class="ui-grid-cell-contents" >{{ COL_FIELD }}</div>',
            footerCellTemplate: '<div class="ui-grid-cell-contents">Yhteensä</div>',
            enableCellEdit: false,
            width: '30%'
          },
          {
            name: 'Euros',
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
            name: 'Kommentit', displayName: 'Kommentit', enableCellEdit: true, width: '55%',
            cellTemplate: '<div class="ui-grid-cell-contents" style="white-space: normal">{{COL_FIELD CUSTOM_FILTERS}}</div>',
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
            name: 'Kehittämishanke',
            displayName: 'Kehittämishankkeiden (jatkuvat / uudet) erittely hankkeittain',
            footerCellTemplate: '<div class="ui-grid-cell-contents">Kehittämishankkeet yhteensä</div>',

            enableCellEdit: false,
            width: '30%'
          },
          {
            name: 'Euros',
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
            name: 'Nimi',
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
          "Määrätarpeet": "Siirtymäajan sopimukset",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Siirtymäajan sopimusten määrärahatarve"
        }, {
          "Määrätarpeet": "Bruttosopimukset, sidotut kustannukset",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Voimassa olevat bruttosopimukset, joiden kustannukset on jo sidottu vuodelle 2015"
        }, {
          "Määrätarpeet": "Bruttosopimukset, uudet",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Uudet bruttosopimukset vuodelle 2015, Kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta"
        }, {
          "Määrätarpeet": "Bruttosopimusten tulot",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Bruttosopimusten tulot"
        }, {
          "Määrätarpeet": "Käyttösopimuskorvaukset (alueellinen), sidotut",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Voimassa olevat käyttösopimuskorvaukset (alueellinen), joiden kustannukset on jo sidottu vuodelle 2015"
        }, {
          "Määrätarpeet": "Käyttösopimuskorvaukset (alueellinen), uudet",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Uudet käyttösopimuskorvaukset (alueellinen) vuodelle 2015, Kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta"
        }, {
          "Määrätarpeet": "Käyttösopimuskorvaukset (alueellinen), tulot",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Käyttösopimuskorvausten (alueellinen) tulot"
        }, {
          "Määrätarpeet": "Käyttösopimuskorvaukset (reitti), sidotut",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Voimassa olevat käyttösopimuskorvaukset (reitti), joiden kustannukset on jo sidottu vuodelle 2015"
        }, {
          "Määrätarpeet": "Käyttösopimuskorvaukset (reitti), uudet",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Uudet käyttösopimuskorvaukset (reitti) vuodelle 2015, Kommentit -kenttään perustelu uudelle hankittavalle liikenteelle esimerkiksi palvelutasomäärittelyn pohjalta"
        }, {
          "Määrätarpeet": "Käyttösopimuskorvaukset (reitti), tulot",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "Käyttösopimuskorvausten (reitti) tulot"
        }, {
          "Määrätarpeet": "Joukkoliikennetuki kunnille",
          "Euros": 0,
          "Kommentit": "",
          "Tooltip": "ELYn kunnille myöntämä joukkoliikennetuki"
        }
      ];

      $scope.ely_kehittamishankkeet.data = [
        {
          "Kehittämishanke": "Kehittämishanke 1",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 2",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 3",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 4",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 5",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 6",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 7",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 8",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 9",
          "Euros": 0,
          "Nimi": ""
        },
        {
          "Kehittämishanke": "Kehittämishanke 10",
          "Euros": 0,
          "Nimi": ""
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
