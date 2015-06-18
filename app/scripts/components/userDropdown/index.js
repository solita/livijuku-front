'use strict';

function dropdownController($scope) {
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

dropdownController.$inject = ['$scope'];

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

