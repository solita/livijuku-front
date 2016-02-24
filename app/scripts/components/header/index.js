'use strict';
var _ = require('lodash');

function headerController($scope, $rootScope, $stateParams, $filter, KayttajaService) {
  $scope.sallittu = require('utils/hasPermission');
  $rootScope.isCollapsed = false;

  $scope.user = null;
  KayttajaService.hae().then((user) => {
    $scope.user = user;
  });

  $scope.toggleCollapse = function () {
    $rootScope.isCollapsed = !$rootScope.isCollapsed;
  };

  $scope.isOwnApplication = function () {
    if (!($scope.user && $rootScope.hakemusOrganisaatio)) {
      return false;
    }
    return $rootScope.hakemusOrganisaatio === $scope.user.organisaatioid;
  };

  $scope.getType = function () {
    if ((typeof $rootScope.organisaatiot) === 'undefined') return;
    if (_.find($rootScope.organisaatiot, {'id': $scope.user.organisaatioid}).lajitunnus === 'ELY') {
      return 'ELY';
    } else
      return 'AH0';
  };

  $scope.ownApplicationTabActive = function () {
    return $filter('isState')('app.hakija.hakemukset.omat') ||
      ($filter('isState')('app.hakemus') && $scope.isOwnApplication());
  };
}

headerController.$inject = ['$scope', '$rootScope', '$stateParams', '$filter', 'KayttajaService', 'HakemusService'];

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./index.html'),
    replace: true,
    scope: {
      user: '='
    },
    controller: headerController
  };
};
