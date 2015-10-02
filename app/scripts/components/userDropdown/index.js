'use strict';

function dropdownController($scope, ConfigService) {
  $scope.fullName = function (user) {
    if (!user) {
      return null;
    }
    if (!(user.etunimi && user.sukunimi)) {
      return null;
    }
    return user.etunimi + ' ' + user.sukunimi;
  };

  ConfigService.hae().then(function (response) {
    $scope.logoutUrl = response.logoutUrl;
  });
}


dropdownController.$inject = ['$scope', 'ConfigService'];

module.exports = function () {
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      user: '='
    },
    controller: dropdownController,
    template: require('./index.html')
  };
};

