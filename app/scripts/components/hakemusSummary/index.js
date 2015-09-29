'use strict';
var _ = require('lodash');
var hakemus = require('utils/hakemus');
var tilat = require('utils/hakemuksenTilat');

module.exports = function () {
  return {
    scope: {
      hakemus: '=hakemus',
      hakemuskaudenTila: '=hakemuskaudenTila',
      testIdIndex: '=',
      onSave: '&',
      onEdit: '&'
    },
    restrict: 'E',
    replace: true,
    template: require('./index.html'),
    controller: ['$scope', function ($scope) {
      $scope.hakemuksenTilat = _.filter(tilat.getAll(), (tila) => ['0', 'M'].indexOf(tila.id) === -1);
      $scope.utils = hakemus;
      $scope.editing = false;
      $scope.calendarOpen = {};
      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        formatMonth: 'MM'
      };

      $scope.hakemuskausiSuljettu = function () {
        return $scope.hakemuskaudenTila === 'S';
      };

      $scope.inputs = ['alkupvm', 'loppupvm'];

      $scope.changeFlag = false;

      //const {alkupvm, loppupvm} = $scope.hakemus.hakuaika;
      const alkupvm = new Date($scope.hakemus.hakuaika.alkupvm);
      const loppupvm = new Date($scope.hakemus.hakuaika.loppupvm);
      $scope.values = {alkupvm, loppupvm};

      $scope.toggleEditMode = function toggleEditMode() {
        $scope.editing = !$scope.editing;
      };

      $scope.toggleCalendar = function toggleCalendar(ev, field) {

        for (let fieldName in $scope.calendarOpen) {
          if (fieldName !== field) {
            $scope.calendarOpen[fieldName] = false;
          }
        }

        $scope.calendarOpen[field] = !$scope.calendarOpen[field];
      };

      $scope.inPast = function (value) {
        return value < new Date();
      };

      $scope.validDateOrder = function (value, index) {
        // changeFlag is used to trigger also alkupvm validation when loppupvm is changed
        if ((typeof(value) === 'string') || (index===1 && $scope.changeFlag)) return true;
        $scope.changeFlag=false;
        if (index === 0) {
          return value < $scope.values.loppupvm;
        } else {
          $scope.changeFlag=true;
          return value > $scope.values.alkupvm;
        }
      };



      $scope.save = function onSave() {
        $scope.onSave({values: $scope.values});
      };

      $scope.stopPropagation = function stopPropagation(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      };
    }]
  };
};
