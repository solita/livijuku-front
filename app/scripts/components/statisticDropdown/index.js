'use strict';

function dropdownController($scope, $location) {
  $scope.isActive = function(route) {
    if (route.substr(0, 27) == '/h/tunnuslukujensyottaminen') {
      return (route.substr(0, 27) == $location.path().substr(0, 27))
    } else if (route.substr(0, 21) == '/h/tunnuslukuraportit') {
      return (route.substr(0, 21) == $location.path().substr(0, 21))
    } else {
      return route === $location.path();
    }
  };
}

dropdownController.$inject = ['$scope', '$location'];

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

