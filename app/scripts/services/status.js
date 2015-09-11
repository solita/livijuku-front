'use strict';

var c = require('utils/core');
var _ = require('lodash');
var Promise = require('bluebird');

var errorTitles = {
  400: "Virhe",
  404: "Tietoa ei löytynyt 404",
  403: "Käyttöoikeusvirhe",
  409: "Käyttöliittymän tiedot vanhentuneet",
  500: "Järjestelmävirhe",
  arkistointi: "Asiahallintavirhe"
};

var errorMessages = {
  404: ["Palvelimelta pyydettyä resurssia ei ole olemassa.",
        "Käyttöliittymän tiedot eivät ole ajantasalla tai käyttämäsi linkki on vanhentunut.",
        "Kokeile päivittää käyttöliittymän tiedot. "].join(" "),

  409: ["Toiminnon kohde on tilassa, jossa toiminto ei ole enää sallittu.",
        "Käyttöliittymän tiedot eivät ole ajantasalla.",
        "Kokeile päivittää käyttöliittymän tiedot. "].join(" "),

  arkistointi: ["Tapahtuman arkistointi asiahallintajärjestelmään epäonnistui.",
                "Voit kokeilla toimintoa vähän ajan kuluttua uudestaan. "].join(" ")
};

function resolveDetailErrorMessage(data) {
  if (c.isNullOrUndefined(data)) {
    return "";
  } else if (data.message) {
    return data.message;
  } else if (data.errors) {
    return "Käyttöliittymä lähetti virheellisen muotoisen komennon palvelimelle - tekninen kuvaus virheestä: " + JSON.stringify(data.errors);
  } else if (_.isString(data)) {
    return data;
  } else {
    JSON.stringify(data);
  }
}

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
      /*
       * Jos tarvitset backend palvelun promisen virheenkäsittelijää käytä errorHandler-funktiota tämän sijaan.
       */
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

        var message = resolveDetailErrorMessage(response.data);

        toastr.error(intro + message, title, {closeButton: true, timeOut: 0, extendedTimeOut: 0});

        if (response.config) {
          console.log(title, response.config.method, response.config.url, response);
        } else {
          console.log(title, response);
        }

        return Promise.reject(response);
      }
    };
  }]);
