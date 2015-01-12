'use strict';

angular.module('services.status', ['toastr'])
  .config(function (toastrConfig) {
    angular.extend(toastrConfig, {
      allowHtml: false,
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
      virhe: function (toiminto, paluudata) {
        console.log('Virhe: ' + toiminto + ': ' + paluudata);
        toastr.error(paluudata, 'Virhe', {closeButton: true, timeOut: 0, extendedTimeOut: 0});
      }
    }
  }]);
