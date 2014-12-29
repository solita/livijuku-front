'use strict';

angular.module('jukufrontApp')
  .controller('KasittelijaPaatosCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {

    $scope.hakemusid = $routeParams.hakemusid;
    $scope.avustus = $routeParams.avustus;

  }]);
