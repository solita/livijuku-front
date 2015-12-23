'use strict';

const hakemusUtils = require('utils/hakemus');

module.exports = function () {
  return {
    scope: {
      title: '@',
      ely: '=',
      hakemus: '='
    },
    controller: ['$scope', function($scope) {
      $scope.utils = hakemusUtils;
    }],
    template: `
      <hakemus-panel class="hakemus-laatikko" title="{{title}}" ely="ely" inactive="!utils.hakemusKaynnissa(hakemus)">
        <hakemus-label tila="{{ hakemus.hakemustilatunnus }}"></hakemus-label>
        <div class="hakemus-laatikko__hakuaika" transclude>
          <strong>Hakuaika:</strong>
          {{ hakemus.hakuaika.alkupvm | date: 'dd.MM yyyy' }} - {{ hakemus.hakuaika.loppupvm | date: 'dd.MM yyyy' }}
        </div>
      </hakemus-panel>`
  };
};
