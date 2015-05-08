/* http://stackoverflow.com/questions/14995884/select-text-on-input-focus */
'use strict';
angular.module('jukufrontApp')
  .directive('selectOnClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        var focusedElement;
        element.on('click', function () {
          if (focusedElement != this) {
            this.select();
            focusedElement = this;
          }
        });
        element.on('blur', function () {
          focusedElement = null;
        });
      }
    };
});
