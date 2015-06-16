'use strict';
var _ = require('lodash');

function liitelatausController(LiiteService, $scope, StatusService, Upload) {
    $scope.myFiles = [];
    $scope.editoitavaLiite = -1;
    $scope.liitenimi = '';


    $scope.asetaEditTilaan = function (liitenumero) {
        $scope.haeLiitteet();
        $scope.editoitavaLiite = liitenumero;
    };

    $scope.asetaLiitenimi = function (nimi) {
        $scope.liitenimi = nimi;
    };

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

    $scope.liiteNimiTyhja = function (nimi) {
        if (isNaN(nimi)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.liitteetOlemassa = function () {
        if (typeof $scope.liitteet === 'undefined') return false;
        return $scope.liitteet.length > 0;
    };

    $scope.palaaTallentamattaLiite = function () {
        $scope.editoitavaLiite = -1;
        $scope.haeLiitteet();
    };

    $scope.poistaLiite = function (liiteid) {
        LiiteService.poista($scope.hakemusid, liiteid)
            .success(function (data) {
                StatusService.ok('LiiteService.poista(' + $scope.hakemusid + ',' + liiteid + ')', 'Liite poistettiin onnistuneesti');
                $scope.haeLiitteet();
            })
            .error(function (data) {
                StatusService.virhe('LiiteService.poista(' + $scope.hakemusid + ',' + liiteid + ')', data.message);
            });
    };

    $scope.paivitaLiiteNimi = function (liiteid, nimi, paate) {
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.hakemusForm.$valid) {
            if (nimi != $scope.liiteNimi) {
                var tiedostonimi = nimi + '.' + paate;
                LiiteService.paivitaNimi($scope.hakemusid, liiteid, tiedostonimi)
                    .success(function (data) {
                        StatusService.ok('LiiteService.paivitaNimi(' + $scope.hakemusid + ',' + liiteid + ',' + tiedostonimi + ')', 'Liitenimi päivitettiin onnistuneesti');
                        $scope.editoitavaLiite = -1;
                        $scope.haeLiitteet();
                    })
                    .error(function (data) {
                        StatusService.virhe('LiiteService.paivitaNimi(' + $scope.hakemusid + ',' + liiteid + ',' + tiedostonimi + ')', data.message);
                    });
            }
        } else {
            StatusService.virhe('LiiteService.paivitaNimi()', 'Anna liitteelle nimi ennen tallentamista.');
        }
    };

    $scope.$watch('myFiles', function () {
        if ($scope.myFiles != null) {
            for (var i = 0; i < $scope.myFiles.length; i++) {
                var file = $scope.myFiles[i];
                console.log('Watched:' + file.name);
                $scope.upload = Upload.upload({
                    url: 'api/hakemus/' + $scope.hakemusid + '/liite',
                    method: 'POST',
                    data: {myObj: $scope.myModelObj},
                    file: file,
                    fileFormDataName: 'liite'
                }).progress(function (evt) {
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('Liiteen lataus: ' + config.file.name + ' onnistui. Paluuarvo: ' + data);
                    StatusService.ok('Liitteen lataus(' + config.file.name + ')', 'Liitteen lataus:' + config.file.name + ' onnistui.');
                    $scope.haeLiitteet();
                }).error(function (data, status, headers, config) {
                    console.log('Liitteen lataus: ' + config.file.name + ' epaonnistui. Paluuarvo: ' + data);
                    //StatusService.virhe('Liitteen lataus('+config.file.name+')','Liitteen lataus:' + config.file.name + ' epaonnistui:'+data);
                });
            }
        }
    });

    $scope.haeLiitteet();
}

liitelatausController.$inject = ['LiiteService','$scope', 'StatusService','Upload'];

module.exports = function () {
    return {
        restrict: 'E',
        template: require('./index.html'),
        replace: true,
        controller: liitelatausController
    };
};
