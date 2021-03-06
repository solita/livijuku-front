'use strict';
var _ = require('lodash');
var pdf = require('utils/pdfurl');
var transclude = require('utils/transclude');

function liitelatausController(LiiteService, $scope, StatusService, Upload) {
  $scope.editoitavaLiite = -1;
  $scope.liitenimi = '';
  $scope.liitteidenKoko = 0;
  $scope.liitteidenMaksimiKoko = 50 * 1024 * 1024;


  $scope.asetaEditTilaan = function (liitenumero) {
    $scope.haeLiitteetLaskeKoko();
    $scope.editoitavaLiite = liitenumero;
  };

  $scope.asetaLiitenimi = function (nimi) {
    $scope.liitenimi = nimi;
  };

  $scope.formatFileSize = function (size) {
    var sizes = [' B', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    for (var i = 1; i < sizes.length; i++) {
      if (size < Math.pow(1024, i)) return (Math.round((size / Math.pow(1024, i - 1)) * 100) / 100) + sizes[i - 1];
    }
    return size;
  };

  $scope.hasPermissionToViewLiite = function() {
    return $scope.sallittu('view-kaikki-liitteet') ||
      ($scope.sallittu('view-omat-liitteet') && $scope.isOmaHakemus($scope.user));
  }

  $scope.liiteHref = function(hakemusid, liite) {
    return liite.nimipaate === 'pdf' ?
      pdf.getLiitePdfUrl(hakemusid, liite.liitenumero) :
      'api/hakemus/' + hakemusid +'/liite/' + liite.liitenumero;
  }

  $scope.haeLiitteetLaskeKoko = function () {
    LiiteService.haeKaikki($scope.hakemusid).then(function (response) {
      $scope.liitteidenKoko = 0;
      $scope.liitteet = _.map(response.data, function (element) {
        $scope.liitteidenKoko = $scope.liitteidenKoko + element.bytesize;
        var paate = element.nimi.split('.').pop();
        var nimiosa = element.nimi.substring(0, (element.nimi.length - paate.length - 1));
        return _.extend({}, element, {nimiteksti: nimiosa}, {nimipaate: paate});
      });
      if (!($scope.liitteetOlemassa())) {
        $scope.allekirjoitusliitetty = false;
      }
    }, StatusService.errorHandlerWithMessage(
      `Liitteiden haku hakemus id:lle ${$scope.hakemusid} epäonnistui.`));
  };

  function isEmpty(str) {
    return (!str || 0 === str.length);
  }

  $scope.liiteNimiOk = function (nimi) {
    if (isEmpty(nimi)) {
      return false;
    } else {
      return true;
    }
  };

  $scope.liiteNimiPituusOk = function (nimi) {
    return nimi.length <= 150;
  };

  $scope.liitteitaLadattavissa = function () {
    return ($scope.liitteidenMaksimiKoko - $scope.liitteidenKoko);
  };

  $scope.liitteetOlemassa = function () {
    if (typeof $scope.liitteet === 'undefined') return false;
    return $scope.liitteet.length > 0;
  };

  $scope.palaaTallentamattaLiite = function () {
    $scope.editoitavaLiite = -1;
    $scope.haeLiitteetLaskeKoko();
  };

  $scope.poistaLiite = function (liiteid) {
    LiiteService.poista($scope.hakemusid, liiteid).then(function (response) {
      StatusService.ok(
        `Liite poistettiin onnistuneesti.`,
        `Liite poistettiin onnistuneesti.`
      );
      $scope.haeLiitteetLaskeKoko();
    }, StatusService.errorHandlerWithMessage(
      `Liitteen: ${liiteid} poistaminen epäonnistui.`));
  };

  $scope.paivitaLiiteNimi = function (liiteid, nimi, paate, validi) {
    if (validi) {
      if (nimi != $scope.liiteNimi) {
        var tiedostonimi = nimi + '.' + paate;
        LiiteService.paivitaNimi($scope.hakemusid, liiteid, tiedostonimi).then(function (response) {
          StatusService.ok(
            `Liitenimi päivitettiin onnistuneesti.`,
            `Liitenimi päivitettiin onnistuneesti.`
          );
          $scope.editoitavaLiite = -1;
          $scope.haeLiitteetLaskeKoko();
        }, StatusService.errorHandlerWithMessage(
          `Liitteen: ${tiedostonimi} nimen päivittäminen epäonnistui.`));
      }
    } else {
      StatusService.virhe('LiiteService.paivitaNimi()', 'Liitteen nimi on virheellinen.');
    }
  };

  $scope.uploadFiles = function (tiedostot) {
    if (tiedostot && tiedostot.length > 0) {
      var tiedostojenKoko = _.sumBy(tiedostot, 'size');
      if (tiedostojenKoko <= $scope.liitteitaLadattavissa()) {
        for (var i = 0; i < tiedostot.length; i++) {
          console.log('Upload filename:' + tiedostot[i].name + ' size:' + tiedostot[i].size + ' file:', tiedostot[i]);
          Upload.upload({
            url: 'api/hakemus/' + $scope.hakemusid + '/liite',
            data: {'liite': tiedostot[i]},
            method: 'POST'
          }).then(function (response) {
            StatusService.ok(
              `Liitteen lataus: ${response.config.data.liite.name} onnistui.`,
              `Liitteen lataus: ${response.config.data.liite.name} onnistui.`
            );
            $scope.haeLiitteetLaskeKoko();
          }, StatusService.errorHandlerWithMessage(
            `Liitteen: ${tiedostot[i].name} lataus epäonnistui. `));
        }
      }
      else {
        StatusService.virhe('Liitteen lataus', 'Liitteen lataus epaonnistui, liitteiden koko on liian suuri: ' + $scope.formatFileSize(tiedostojenKoko) + '. Voit vielä ladata liitteitä ' + $scope.formatFileSize($scope.liitteitaLadattavissa()) + '. Hakemuksen liitteiden yhteiskoko ei saa ylittää ' + $scope.formatFileSize($scope.liitteidenMaksimiKoko) + '.');
      }
    }
  };


  $scope.haeLiitteetLaskeKoko();
}

liitelatausController.$inject = ['LiiteService', '$scope', 'StatusService', 'Upload'];

module.exports = function () {
  return {
    restrict: 'E',
    template: require('./index.html'),
    controller: liitelatausController
  };
};
