'use strict';

function headerController($scope, $rootScope, $location) {
  $scope.sallittu = require('utils/hasPermission');
  $rootScope.isCollapsed = false;

  $scope.toggleCollapse = function() {
    $rootScope.isCollapsed = !$rootScope.isCollapsed;
  };

  $scope.isActive = function(route) {
    if (route.substr(0, 13) == '/k/hakemukset') {
      return ((route.substr(0, 13) == $location.path().substr(0, 13)) || ('/k/hakemus/' == $location.path().substr(0, 11)) || ('/k/suunnittelu/' == $location.path().substr(0, 15))|| ('/k/paatos/' == $location.path().substr(0, 10)));
    // 'Omat hakemukset' aktiiviseksi
    } else if (route.substr(0, 13) == '/h/hakemukset') {
      return (('/h/hakemus/' == $location.path().substr(0, 11)) ||('/h/maksatushakemus/' == $location.path().substr(0, 19))||('/h/hakemukset' == $location.path().substr(0, 13)));
    } else {
      return route === $location.path();
    }
  };

  $scope.fullName = function(user) {
    if(!user) {
      return null;
    }
    if(!(user.etunimi && user.sukunimi)) {
      return null;
    }
    return user.etunimi + ' ' + user.sukunimi;
  };
}

headerController.$inject = ['$scope', '$rootScope', '$location'];

module.exports = function() {
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
