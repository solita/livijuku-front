'use strict';
var _ = require('lodash');
var pdf = require('utils/pdfurl');

function liitetarkistaminenController(LiiteService, $scope, StatusService) {

  $scope.liitteetOlemassa = function () {
    if (typeof $scope.liitteet === 'undefined') return false;
    return $scope.liitteet.length > 0;
  };

  $scope.formatFileSize = function (size) {
    var sizes = [' B', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    for (var i = 1; i < sizes.length; i++) {
      if (size < Math.pow(1024, i)) return (Math.round((size / Math.pow(1024, i - 1)) * 100) / 100) + sizes[i - 1];
    }
    return size;
  };

  $scope.getLiitePdf = function (hakemusid, liitenumero) {
    return pdf.getLiitePdfUrl(hakemusid, liitenumero);
  };

  LiiteService.haeKaikki($scope.hakemusid).then(function (response) {
    $scope.liitteet = _.map(response.data, function (element) {
      var paate = element.nimi.split('.').pop();
      var nimiosa = element.nimi.substring(0, (element.nimi.length - paate.length - 1));
      return _.extend({}, element, {nimiteksti: nimiosa}, {nimipaate: paate});
    });
  }, StatusService.errorHandlerWithMessage(
    `Liitteiden haku hakemus id:lle ${$scope.hakemusid} epäonnistui.`));
}

liitetarkistaminenController.$inject = ['LiiteService', '$scope', 'StatusService'];

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./index.html'),
    replace: true,
    controller: liitetarkistaminenController
  };
};
