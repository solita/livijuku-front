'use strict';
var _ = require('lodash');

function liitetarkistaminenController(LiiteService, $scope, StatusService, Upload) {

    $scope.haeLiitteet = function () {
        LiiteService.haeKaikki($scope.hakemusid)
            .success(function (data) {
                $scope.liitteet = _.map(data, function (element) {
                    var paate = element.nimi.split('.').pop();
                    var nimiosa = element.nimi.substring(0, (element.nimi.length - paate.length - 1));
                    return _.extend({}, element, {nimiteksti: nimiosa}, {nimipaate: paate});
                });
            })
            .error(function (data) {
                StatusService.virhe('LiiteService.hae(' + $scope.hakemusid + ')', data.message);
            });
    };

    $scope.liitteetOlemassa = function () {
        if (typeof $scope.liitteet === 'undefined') return false;
        return $scope.liitteet.length > 0;
    };

     $scope.haeLiitteet();
}

liitetarkistaminenController.$inject = ['LiiteService','$scope', 'StatusService','Upload'];

module.exports = function () {
    return {
        restrict: 'E',
        template: require('./index.html'),
        replace: true,
        controller: liitetarkistaminenController
    };
};
