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
      kausiId: '=',
      onSave: '&',
      onEdit: '&',
      editActive: '='
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

      $scope.hakemuskausiAvaamaton = function () {
        return $scope.hakemuskaudenTila === 'A';
      };

      $scope.hakemuskausiKaynnissa = function () {
        return $scope.hakemuskaudenTila === 'K';
      };

      $scope.hakemuskausiSuljettu = function () {
        return $scope.hakemuskaudenTila === 'S';
      };

      $scope.setEditMode = function setEditMode() {
        $scope.backupHakuaika =  _.assign({},$scope.hakemus.hakuaika);
        $scope.editing = true;
      };

      $scope.changeFlag = false;

      $scope.cancelEdit = function cancelEdit(){
        $scope.status.alkupvmOpen = false;
        $scope.status.loppupvmOpen = false;
        $scope.editing = false;
        $scope.hakemus.hakuaika = $scope.backupHakuaika;
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

      $scope.validDateOrder = function () {
        return $scope.hakemus.hakuaika.alkupvm < $scope.hakemus.hakuaika.loppupvm;
      };

      $scope.save = function onSave() {
        $scope.onSave();
        $scope.editing = false;
      };

      $scope.stopPropagation = function stopPropagation(ev) {
        ev.preventDefault();
        ev.stopPropagation();
      };
    }]
  };
};
