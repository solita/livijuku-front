'use strict';

function lisatiedotController($scope) {

}

module.exports = function () {
  return {
    restrict: 'E',
    scope: {
      lisatiedot: '=lisatiedot',
      isReadonly: '&isReadonly'
    },
    template: require('./index.html'),
    replace: true,
    controller: ['$scope', lisatiedotController]
  };
};
