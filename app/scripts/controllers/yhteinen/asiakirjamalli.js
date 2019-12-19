'use strict';

import * as _ from 'lodash';
import {default as simplemde} from 'simplemde';
import * as angular from 'angular';
import * as tl from 'utils/tunnusluvut';
import * as  time from 'utils/time';
import * as  hakemus from 'utils/hakemus';
import * as  c from 'utils/core';

const active = asiakirjamalli => c.isNullOrUndefined(asiakirjamalli.poistoaika);

angular.module('jukufrontApp')

  /* Asiakirjamallit sivu */
  .controller('AsiakirjamallitCtrl',
    ['$scope', '$state', 'AsiakirjamalliService', 'StatusService',
    function ($scope, $state, AsiakirjamalliService, StatusService) {
      $scope.isEmpty = _.isEmpty;
      $scope.organisaatiolajinimi =
          tunnus => c.coalesce(tl.organisaatiolajit.$nimi(tunnus), 'Kaikki organisaatiot');
      $scope.hakemustyyppinimi =
          tunnus => c.coalesce(hakemus.hakemustyypit.$nimi(tunnus), 'Kaikki hakemukset');

      AsiakirjamalliService.findAll().then(asiakirjamallit => {

          $scope.hakemusasiakirjamallit = _.filter(asiakirjamallit, _.overEvery([
            _.matches({ asiakirjalajitunnus: 'H' }),
            active]));

          $scope.paatosasiakirjamallit = _.filter(asiakirjamallit, _.overEvery([
            _.matches({ asiakirjalajitunnus: 'P' }),
            active]));

        }, StatusService.errorHandler);

      $scope.edit = id => $state.go('app.asiakirjamalli', { id: id });

      $scope.add = asiakirjalajitunnus =>
        $state.go('app.asiakirjamalli', { id: 'new', asiakirjalajitunnus: asiakirjalajitunnus });

      $scope.delete = id => {
        AsiakirjamalliService.delete(id)
          .then(function () {
            StatusService.ok('', 'Asiakirjamalli poistettu.');
            $state.reload();
          }, StatusService.errorHandler);
      };
  }])

  /* Asiakirjamalli sivu */
  .controller('AsiakirjamalliCtrl',
    ['$scope', '$stateParams', '$state', '$window', 'AsiakirjamalliService', 'StatusService',
      function ($scope, $stateParams, $state, $window, AsiakirjamalliService, StatusService) {

        $scope.years = _.range(2016, time.currentYear() + 1);
        $scope.organisaatiolajit = _.map(
          tl.organisaatiolajit.$order,
          id => ({id: id !== 'ALL' ? id : null, nimi: tl.organisaatiolajit.$nimi(id)}));
        $scope.hakemustyypit = _.map(
          hakemus.hakemustyypit.$order,
          id => ({id: id !== 'ALL' ? id : null, nimi: hakemus.hakemustyypit.$nimi(id)}));

        const isNew = $state.params.id == 'new';
        $scope.isNew = isNew;

        const editor = new simplemde({
          element: document.getElementById('asiakirjamalli'),
          spellChecker: false,
          autoDownloadFontAwesome: false,
          toolbar: toolbar
        });

        $scope.cancel = function () {
          history.back();
        };

        $scope.delete = function () {
          AsiakirjamalliService.delete($stateParams.id)
            .then(function () {
              StatusService.ok('', 'Asiakirjamalli poistettu.');
              history.back();
            }, StatusService.errorHandler);
        };

        const save = (success) => function() {
          StatusService.tyhjenna();

          const asiakirjamalliEdit = _.omit($scope.asiakirjamalli, ['id', 'poistoaika']);
          asiakirjamalliEdit.sisalto = editor.value();
          const savePromise = isNew ?
            AsiakirjamalliService.add(asiakirjamalliEdit) :
            AsiakirjamalliService.save($scope.asiakirjamalli.id, asiakirjamalliEdit);

          savePromise.then(function() {
            StatusService.ok('', 'Muutokset tallennettu asiakirjamalliin.');
            $scope.asiakirjamalliForm.$setPristine();
            success();

          }, StatusService.errorHandler);
        };

        $scope.save = save(() => history.back());
        $scope.preview = save(() => {
          $window.location.href = `api/asiakirjamalli/${$stateParams.id}/preview`;
        });

        if (!isNew) {
          AsiakirjamalliService.findById($stateParams.id).then(asiakirjamalli => {
            editor.value(asiakirjamalli.sisalto);
            editor.codemirror.refresh();
            $scope.asiakirjamalli = asiakirjamalli;
          }, StatusService.errorHandler);
        } else {
          $scope.asiakirjamalli = {
            voimaantulovuosi: time.currentYear(),
            asiakirjalajitunnus: c.coalesce($stateParams.asiakirjalajitunnus, 'H'),
            hakemustyyppitunnus: null,
            organisaatiolajitunnus: null
          }
        }
      }]);

const toolbar = [
  {
    name: "bold",
    action: simplemde.toggleBold,
    className: "fa fa-bold",
    title: "Bold"
  },
  {
    name: "italic",
    action: simplemde.toggleItalic,
    className: "fa fa-italic",
    title: "Italic",
  },
  {
    name: "heading",
    action: simplemde.toggleHeadingSmaller,
    className: "fas fa-heading",
    title: "Heading",
    default: true
  },
  "|",
  {
    name: "unordered-list",
    action: simplemde.toggleUnorderedList,
    className: "fa fa-list-ul",
    title: "Generic List",
  },
  {
    name: "ordered-list",
    action: simplemde.toggleOrderedList,
    className: "fa fa-list-ol",
    title: "Numbered List",
  },
  {
    name: "table",
    action: simplemde.drawTable,
    className: "fa fa-table",
    title: "Insert Table"
  },
  "|",
  {
    name: "preview",
    action: simplemde.togglePreview,
    className: "fa fa-eye no-disable",
    title: "Toggle Preview",
    default: true
  },
  {
    name: "side-by-side",
    action: simplemde.toggleSideBySide,
    className: "fa fa-columns no-disable no-mobile",
    title: "Toggle Side by Side",
    default: true
  },
  {
    name: "fullscreen",
    action: simplemde.toggleFullScreen,
    className: "fa fa-arrows-alt no-disable no-mobile",
    title: "Toggle Fullscreen",
    default: true
  },
  "|",
  {
    name: "undo",
    action: simplemde.undo,
    className: "fas fa-undo no-disable",
    title: "Undo"
  },
  {
    name: "redo",
    action: simplemde.redo,
    className: "fas fa-redo no-disable",
    title: "Redo"
  },
  "|",
  {
    name: "guide",
    action: "https://simplemde.com/markdown-guide",
    className: "fa fa-question-circle",
    title: "Markdown Guide",
    default: true
  }
];
