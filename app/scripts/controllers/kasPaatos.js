'use strict';

angular.module('jukufrontApp')
  .controller('KasPaatosCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

    $scope.hakemusid = $routeParams.hakemusid;
    $scope.avustus = $routeParams.avustus;

  }]);
