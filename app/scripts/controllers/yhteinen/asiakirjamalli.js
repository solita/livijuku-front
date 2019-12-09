'use strict';

import * as _ from 'lodash';
import * as simplemde from 'simplemde';
import * as angular from 'angular';
import * as tl from 'utils/tunnusluvut';
import * as  time from 'utils/time';
import * as  hakemus from 'utils/hakemus';

angular.module('jukufrontApp')

  /* Asiakirjamallit sivu */
  .controller('AsiakirjamallitCtrl',
    ['$scope', '$state', 'AsiakirjamalliService', 'StatusService',
    function ($scope, $state, AsiakirjamalliService, StatusService) {
      AsiakirjamalliService.findAll().then(asiakirjamallit => {
          $scope.asiakirjamallit = asiakirjamallit;
        }, StatusService.errorHandler);

      $scope.edit = id => $state.go('app.asiakirjamalli', { id: id });
  }])

  /* Asiakirjamalli sivu */
  .controller('AsiakirjamalliCtrl',
    ['$scope', '$stateParams', '$state', 'AsiakirjamalliService', 'StatusService',
      function ($scope, $stateParams, $state, AsiakirjamalliService, StatusService) {

        $scope.years = _.range(2016, time.currentYear() + 1);
        $scope.organisaatiolajit = _.map(
          tl.organisaatiolajit.$order,
          id => ({id: id !== 'ALL' ? id : null, nimi: tl.organisaatiolajit.$nimi(id)}));
        $scope.hakemustyypit = _.map(
          hakemus.hakemustyypit.$order,
          id => ({id: id !== 'ALL' ? id : null, nimi: hakemus.hakemustyypit.$nimi(id)}));

        const isNew = $state.params.id == 'new';
        $scope.isNew = isNew;

        const editor = new simplemde.default({
          element: document.getElementById('asiakirjamalli'),
          spellChecker: false
        });

        $scope.cancel = function () {
          history.back();
        };

        $scope.save = function() {
          StatusService.tyhjenna();

          const asiakirjamalliEdit = _.omit($scope.asiakirjamalli, ['id']);
          asiakirjamalliEdit.sisalto = editor.value();
          const savePromise = isNew ?
            AsiakirjamalliService.add(asiakirjamalliEdit) :
            AsiakirjamalliService.save($scope.asiakirjamalli.id, asiakirjamalliEdit);

          savePromise.then(function() {
            StatusService.ok('', 'Asiakirjamallin tallennus onnistui.');
            $scope.asiakirjamalliForm.$setPristine();
            history.back();

          }, StatusService.errorHandler);
        };

        AsiakirjamalliService.findById($stateParams.id).then(asiakirjamalli => {
          editor.value(asiakirjamalli.sisalto);
          $scope.asiakirjamalli = asiakirjamalli;
        }, StatusService.errorHandler);
      }]);
