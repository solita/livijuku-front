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
    $scope.haeLiitteet();
    $scope.editoitavaLiite = liitenumero;
  };

  $scope.asetaLiitenimi = function (nimi) {
    $scope.liitenimi = nimi;
  };

  $scope.formatFileSize = function (size) {
    var sizes = [' Bytes', ' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    for (var i = 1; i < sizes.length; i++) {
      if (size < Math.pow(1024, i)) return (Math.round((size / Math.pow(1024, i - 1)) * 100) / 100) + sizes[i - 1];
    }
    return size;
  };

  $scope.getLiitePdf = function (hakemusid, liitenumero) {
    return pdf.getLiitePdfUrl(hakemusid, liitenumero);
  };

  $scope.haeLiitteet = function () {
    LiiteService.haeKaikki($scope.hakemusid)
      .success(function (data) {
        $scope.liitteidenKoko = 0;
        $scope.liitteet = _.map(data, function (element) {
          $scope.liitteidenKoko = $scope.liitteidenKoko + element.bytesize;
          var paate = element.nimi.split('.').pop();
          var nimiosa = element.nimi.substring(0, (element.nimi.length - paate.length - 1));
          return _.extend({}, element, {nimiteksti: nimiosa}, {nimipaate: paate});
        });
        if (!($scope.liitteetOlemassa())) {
          $scope.allekirjoitusliitetty = false;
        }
      })
      .error(function (data) {
        StatusService.virhe('LiiteService.hae(' + $scope.hakemusid + ')', data.message);
      });
  };

  function isEmpty(str) {
    return (!str || 0 === str.length);
  }

  $scope.isPdf = function (paate) {
    return (paate === 'pdf');
  };

  $scope.liiteNimiOk = function (nimi) {
    if (isEmpty(nimi)) {
      return false;
    } else {
      return true;
    }
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

  $scope.paivitaLiiteNimi = function (liiteid, nimi, paate, validi) {
    if (validi) {
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

  $scope.uploadFiles = function (tiedostot) {
    console.log('tiedostot:',tiedostot);
    if (tiedostot && tiedostot.length > 0) {
      console.log('MyFilesLength:', tiedostot.length);
      var tiedostojenKoko = _.sum(tiedostot, 'size');
      console.log('TiedostojenKoko:', tiedostojenKoko);
      if (tiedostojenKoko <= $scope.liitteitaLadattavissa()) {
        for (var i = 0; i < tiedostot.length; i++) {
          console.log('Watched:' + tiedostot[i].name + ' size:' + tiedostot[i].size + ' file:', tiedostot[i]);
            Upload.upload({
              url: 'api/hakemus/' + $scope.hakemusid + '/liite',
              file: {'liite':tiedostot[i]},
              method: 'POST'
            }).then(function (response) {
              StatusService.ok(
                `Liitteen lataus: ${response.config.file.liite.name} onnistui.`,
                `Liitteen lataus: ${response.config.file.liite.name} onnistui.`
              );
              $scope.haeLiitteet();
            }, StatusService.errorHandlerWithMessage(
              `Liitteen: ${tiedostot[i].name} lataus epäonnistui. `));
          }
      }
      else {
        StatusService.virhe('Liitteen lataus', 'Liitteen lataus epaonnistui, liitteiden koko on liian suuri: ' + $scope.formatFileSize(tiedostojenKoko) + '. Voit vielä ladata liitteitä ' + $scope.formatFileSize($scope.liitteitaLadattavissa()) + '. Hakemuksen liitteiden yhteiskoko ei saa ylittää ' + $scope.formatFileSize($scope.liitteidenMaksimiKoko) + '.');
      }
    }
  };


  $scope.haeLiitteet();
}

liitelatausController.$inject = ['LiiteService', '$scope', 'StatusService', 'Upload'];

module.exports = function () {
  return {
    transclude: true,
    restrict: 'E',
    template: require('./index.html'),
    replace: true,
    controller: liitelatausController
  };
};
