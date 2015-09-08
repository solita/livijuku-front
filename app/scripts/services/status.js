'use strict';

var c = require('utils/core');
var _ = require('lodash');
var Promise = require('bluebird');

var errorTitles = {
  400: "Virhe",
  404: "Ajantasaisuusvirhe",
  403: "Käyttöoikeusvirhe",
  500: "Järjestelmävirhe",
  arkistointi: "Asiahallintavirhe"
};

var errorMessages = {
  404: ["Käyttöliittymän tiedot eivät ole ajantasalla ja taustapalvelulta pyydettyä resurssia ei ole olemassa.",
        "Kokeile päivittää käyttöliittymän tiedot."].join(" "),

  arkistointi: ["Tapahtuman arkistointi asiahallintajärjestelmään epäonnistui.",
                "Voit kokeilla toimintoa vähän ajan kuluttua uudestaan. "].join(" ")
};

var angular = require('angular');
angular.module('services.status', ['toastr'])
  .config(function (toastrConfig) {
    angular.extend(toastrConfig, {
      allowHtml: true,
      closeButton: false,
      closeHtml: '<button>&times;</button>',
      containerId: 'toast-container',
      extendedTimeOut: 1000,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning'
      },
      maxOpened: 0,
      messageClass: 'toast-message',
      newestOnTop: true,
      onHidden: null,
      onShown: null,
      positionClass: 'toast-top-right',
      tapToDismiss: true,
      timeOut: 5000,
      titleClass: 'toast-title',
      toastClass: 'toast'
    });
  })
  .factory("StatusService", ['toastr', function (toastr) {
    return {
      ok: function (toiminto, teksti) {
        toastr.success(teksti,'', {timeOut: 1000});
      },
      /*deprecated: käytä virheenkäsittelijää tämän sijaan*/
      virhe: function (toiminto, paluudata) {
        console.log('Virhe: ', toiminto, paluudata);
        toastr.error(paluudata, 'Virhe', {closeButton: true, timeOut: 0, extendedTimeOut: 0});
      },
      tyhjenna: function(){
        toastr.clear();
      },
      errorHandler: function(response) {
        var status = response.status;
        var type = _.get(response, "data.type");
        var title = c.coalesce(errorTitles[type], errorTitles[status], "Virhe");
        var intro = c.coalesce(errorMessages[type], errorMessages[status], "");

        var message = c.coalesce(_.get(response, "data.message"), response.data, "");

        toastr.error(intro + message, title, {closeButton: true, timeOut: 0, extendedTimeOut: 0, preventOpenDuplicates: true});

        console.log(title, response.config.url, response);

        return Promise.reject(response);
      }
    };
  }]);
