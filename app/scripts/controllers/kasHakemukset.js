'use strict';

/**
 * @ngdoc function
 * @name jukufrontApp.controller:KasHakemuksetCtrl
 * @description
 * # KasHakemuksetCtrl
 * Controller of the jukufrontApp
 * */

angular.module('jukufrontApp')
  .controller('KasHakemuksetCtrl', function ($scope, $filter, HakemuksetOsasto) {
    $scope.gridOptions = {};
    $scope.gridOptions.columnDefs = [
      { name: 'Hakija'},
      { name: 'Hakemuksen tila'},
      { name: 'Viimeisin muutos' },
      { name: 'Diaarinumero'},
      { name: 'Käsittelijä'},
      { name: 'Toiminto',
        cellTemplate:'<div>' +
        '  <a href="#/k/hakemus">Tarkasta</a>' +
        '</div>' }
    ];
    $scope.gridOptions.enableVerticalScrollbar = 0;
    $scope.gridOptions.enableHorizontalScrollbar = 0;

    HakemuksetOsasto.getAvustushakemuksetVuosi('2015')
      .then(function (data) {
        $scope.hakemAktiivisetVuosi = data;
        $scope.gridOptions.data = [];
        angular.forEach(data, function (hakemus) {
          $scope.gridOptions.data.push({
            'Hakija': hakemus.osasto,
            'Hakemuksen tila': hakemus.avustushakemusstatus,
            'Viimeisin muutos': $filter('date')(hakemus.aikaleima, "dd/MM/yyyy HH:mm"),
            'Diaarinumero': hakemus.diaarinumero,
            'Käsittelijä': hakemus.kasittelija
          });
        });
      })
  });
