'use strict';
var _ = require('lodash');
var hakemus = require('utils/hakemus');
var tilat = require('utils/hakemuksenTilat');
import {getUTCDateTimestamp,convertDateToUTC} from 'utils/time';

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
      $scope.status = {
        alkupvmOpen: false,
        loppupvmOpen: false
      };
      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        formatMonth: 'MM'
      };

      $scope.hakemuskausiSuljettu = function () {
        return $scope.hakemuskaudenTila === 'S';
      };

      $scope.toggleEditMode = function toggleEditMode() {
        $scope.editing = !$scope.editing;
      };

      $scope.changeFlag = false;

      $scope.cancelEdit = function cancelEdit(){
        $scope.status.alkupvmOpen = false;
        $scope.status.loppupvmOpen = false;
        $scope.editing = false;
      };

      $scope.toggleCalendarAlkupvm = function toggleCalendarAlkupvm(ev) {
        $scope.status.alkupvmOpen = !$scope.status.alkupvmOpen;
      };
      $scope.toggleCalendarLoppupvm = function toggleCalendarLoppupvm(ev) {
        $scope.status.loppupvmOpen = !$scope.status.loppupvmOpen;
      };

      $scope.inPast = function (value) {
        if (typeof value === 'undefined') return;
        return convertDateToUTC(value) < getUTCDateTimestamp();
      };

      $scope.validDateOrder = function (before, after, changeTrigger) {
        // changeFlag is used to trigger also alkupvm validation when loppupvm is changed
        if (typeof before !== 'object' || typeof after !== 'object') return true;
        $scope.changeFlag = changeTrigger;
        return convertDateToUTC(before) < convertDateToUTC(after);
      };

      $scope.save = function onSave() {
        $scope.onSave();
      };

      $scope.stopPropagation = function stopPropagation(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      };
    }]
  };
};
